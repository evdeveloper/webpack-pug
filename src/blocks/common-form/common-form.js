import { postData } from '@/js/common/ajax';
import CustomSelect from '@/js/common/CustomSelect';

const events = ['formSubmitted'];

export class CommonForm {
    /**
     * Creates an instance of CommonForm.
     *
     * @param {HTMLFormElement} form
     * @param { import("../custom-input/methods")} InputMethods
     * @memberof CommonForm
     */
    constructor(form, InputMethods) {
        this.formElement = form;
        this.submitBtn = this.formElement.querySelector('.common-form__submit');
        this.InputMethods = InputMethods;

        this.action = this.formElement.action;

        this.initialState = this.formElement.cloneNode(true);

        this.init();
    }

    init() {
        if (this.formElement.CommonFormInstance) {
            console.warn('form allready attached', this.formElement);

            return;
        }
        this.formElement.CommonFormInstance = this;

        this.inputValidationHandlers();
        this.setMasks();

        this.fileUploadLogic();
    }

    inputValidationHandlers() {
        const inputs = this.formElement.querySelectorAll(
            'input[data-validate]'
        );
        this.InputMethods.setInputValidationHandlers(inputs);
    }

    submitHandler() {
        const inputs = this.formElement.querySelectorAll(
            'input[data-validate]'
        );
        this.formElement.addEventListener('submit', e => {
            e.preventDefault();
            const isFormValid = this.validateForm();
            debugger;
            if (isFormValid) {
                this.submitBtn.disabled = true;
                const formData = new FormData(this.formElement);

                const formName = this.formElement.dataset.form;
                if (formName) formData.append('form', formName)

                if (this.uploadFiles) {
                    this.uploadFiles.files.forEach(function (file, indx) {
                        if (file.accepted)
                            formData.set('file' + indx, file, file.name);
                    });
                }

                postData(this.action, {
                    body: formData,
                    headers: {},
                })
                    .then(response => {
                        fireSubmittedEvent.call(this, response);
                    })
                    .catch(e => {
                        fireSubmittedEvent.call(this, e);
                    })
                    .finally(() => {
                        this.submitBtn.disabled = false;
                    });
            } else {
                this.InputMethods.fireInputsValidation(inputs);

                const firstInputWithError = this.formElement.querySelector(
                    '.custom-input.error input'
                );
                firstInputWithError.focus();
            }
        });
    }

    setMasks() {
        const inputsToMask = this.formElement.querySelectorAll('[data-mask]');
        inputsToMask.forEach(input => {
            const type = input.dataset.mask;

            switch (type) {
                case 'phone':
                    this.InputMethods.setPhoneMask(input);
                    break;
                case 'birthday':
                    this.InputMethods.setBirthdayMask(input);
                    break;
            }
        });
    }

    validateForm() {
        debugger;
        const inputs = this.formElement.querySelectorAll(
            'input[data-validate]'
        );

        this.InputMethods.fireInputsValidation(inputs);

        return [...inputs].every(input =>
            input.parentElement.classList.contains('valid')
        );
    }

    clearErrors() {
        const errorInputs = this.formElement.querySelectorAll(
            '.custom-input.error input'
        );
        this.InputMethods.hideInputErrors(errorInputs);
    }

    reset() {
        this.formElement.reset();
    }

    async fileUploadLogic() {
        const fileUploadNode = this.formElement.querySelector('.file-upload');
        if (!fileUploadNode) return;

        this.submitBtn.disabled = true;
        const { default: fileUploadInit } = await import(
            /* webpackChunkName: "fileUploadInit" */ '@/blocks/file-upload/file-upload'
        );
        fileUploadInit(fileUploadNode).then(instance => {
            this.uploadFiles = instance;
            this.submitBtn.disabled = false;
        });
    }

    selectsInit(options = {}) {
        const selectNodes = this.formElement.querySelectorAll('.custom-select');
        if (selectNodes.length) {
            this.selects = {};
            selectNodes.forEach(select => {
                const selectInstance = new CustomSelect(select, options);
                this.selects[selectInstance.select.dataset.type] = selectInstance
            });
        }
    }

    dispatchEvent(event) {
        this.formElement.dispatchEvent(event);
    }

    on(event, cb) {
        this.formElement.addEventListener(event, cb);
    }

    destroy() {
        this.formElement.CommonFormInstance = null;

        let formParent = this.formElement.parentNode;

        formParent.replaceChild(this.initialState, this.formElement);
        this.initialState = null;
        formParent = null;

        if (this.uploadFiles) {
            this.uploadFiles.destroy();
        }
    }
}

function fireSubmittedEvent(result) {
    const formSubmittedEvent = new CustomEvent('formSubmitted', {
        detail: {
            result,
        },
    });
    this.dispatchEvent(formSubmittedEvent);
}
