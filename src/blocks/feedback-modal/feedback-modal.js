import { createResultModal } from '@/blocks/result-modal/result-modal';
import CustomSelect from '@/js/common/CustomSelect';
import { postData } from '@/js/common/ajax';
import Modal from '@/js/common/Modal';

/**
 *
 * @param {HTMLDivElement} modal
 */
async function feedbackModalInit(modal) {
    if (modal.isItialized) {
        console.log('🛠: feedbackModalInit -> ', 'already inited');
        return;
    }

    const module = await import(
        /* webpackChunkName: "inputMethods" */
        '../custom-input/custom-input'
    );
    const InputMethods = await module.default();

    modal.isItialized = true;
    const allLabelledInputs = modal.querySelectorAll('.custom-input__input');
    InputMethods.floatLabelsInit(allLabelledInputs);

    const requiredInputs = modal.querySelectorAll(
        '.custom-input__input[required]'
    );

    const themeSelect = modal.querySelector('#themeSelect');
    new CustomSelect(themeSelect)

    InputMethods.setInputValidationHandlers(requiredInputs);

    const form = modal.querySelector('form');
    form.addEventListener('submit', e => {
        e.preventDefault();

        const requiredInputs = form.querySelectorAll(
            '.custom-input__input[data-validate]'
        );
        InputMethods.fireInputsValidation(requiredInputs);
        const isFormValid = validateForm(requiredInputs);

        if (isFormValid) {
            const action = form.getAttribute('action');
            // method form.action return all path with protocol and domain, i dont know why :/
            const formData = new FormData(form);

            postData(action, {
                body: new URLSearchParams(formData).toString(),
            }).then(res => {
                Modal.closeModal(modal.id).then(() => {
                    form.reset();
                    InputMethods.resetFloatLabels(allLabelledInputs);
                    createResultModal({
                        type: res.type,
                        title: res.title,
                        subtitle:res.subtitle
                    }).then(() => {
                        Modal.showModal('resultModal', {
                            removeOnClose: true,
                        });
                    });
                });
            })
            .catch(console.log(e)); 
        }
    });
}

function validateForm(inputs) {
    return [...inputs].every(input =>
        input.parentElement.classList.contains('valid')
    );
}

document.addEventListener('click', e => {
    const trigger = e.target.closest('.js-feedback-trigger');
    if (trigger) {
        Modal.showModal('feedbackModal', {
            onShown: feedbackModalInit,
        });
    }
});
