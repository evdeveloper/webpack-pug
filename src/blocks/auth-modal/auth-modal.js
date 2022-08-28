import { postData } from '@/js/common/ajax';
import Modal from '@/js/common/Modal';
import { fadeIn, fadeOut } from '@/js/common/plugins';

document.addEventListener('click', e => {
    /** @type {HTMLButtonElement} */
    const trigger = e.target.closest('.js-auth-trigger');

    if (trigger) {
        Modal.showModal('authModal', {
            async onShown(modal) {
                const module = await import(
                    /* webpackChunkName: "inputMethods" */
                    '../custom-input/custom-input'
                );
                const InputMethods = await module.default();
                authModalInit(modal, InputMethods);

                modal.InputMethods = InputMethods;
            },
            onClosed(modal) {
                resetAuthForms(modal);
            },
        });
    }
});

/**
 *
 * @param {HTMLDivElement} modal
 * @param {import('@/blocks/custom-input/methods')} inputMethods
 */
function authModalInit(modal, inputMethods) {

    modal.isItialized = true;
    const allLabelledInputs = modal.querySelectorAll('.custom-input__input');
    inputMethods.floatLabelsInit(allLabelledInputs);

    const requiredInputs = modal.querySelectorAll(
        '.custom-input__input[required]'
    );
    requiredInputs.forEach(input => {
        inputMethods.handleTextInput(input);
    });

    const phoneInput = modal.querySelector('#authPhone');
    const birthDayInput = modal.querySelector('#authBirthDay');

    inputMethods.handlePhoneInput(phoneInput);
    inputMethods.handleBirthdayInput(birthDayInput);
    
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const label = form.querySelector('.custom-input');
            const parentStep = form.closest('.auth-modal__step');
            const nextStep = parentStep.nextElementSibling;
            const id = form.id
            const requiredInputs = form.querySelectorAll(
                '.custom-input__input[data-validate]'
            );
            
            inputMethods.fireInputsValidation(requiredInputs);
            const isFormValid = validateForm(requiredInputs);

            if (isFormValid) {
                const action = form.getAttribute('action');
                const formData = new FormData(form);
                
                postData(action, {
                    body:  new URLSearchParams(formData),
                }).then(res => {
                   if(res.success){
                        if(res.canReloadPage){
                            window.location.href = window.location;
                        } else {
                            if (parentStep && nextStep) switchSteps(parentStep, nextStep);
                        }
                   } else {
                        label.classList.add('error');
                   }
                });               
            }
        });
    });
}

function switchSteps(current, next) {
    fadeOut(current, { toggleClass: 'active' }).then(() =>
        fadeIn(next, { toggleClass: 'active' })
    );
}

function validateForm(inputs) {
    return [...inputs].every(input =>
        input.parentElement.classList.contains('valid')
    );
}

function resetAuthForms(modal) {
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => form.reset());

    const modalInputs = modal.querySelectorAll('.custom-input input');
    modalInputs.forEach(input => {
        modal.InputMethods.hideSingleInputError(input);
        input.parentElement.classList.remove('js-has-value');
    });

    const currentStep = modal.querySelector('.auth-modal__step.active');
    const initialStep = modal.querySelector('.auth-modal__step');

    switchSteps(currentStep, initialStep);
}
