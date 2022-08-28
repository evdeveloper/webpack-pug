import { createResultModal } from '@/blocks/result-modal/result-modal';
import { concat } from '@/data/common/addresses';
import { postData } from '@/js/common/ajax';
import Modal from '@/js/common/Modal';

/**
 *
 * @param {HTMLDivElement} modal
 */
async function testimonialFormModalInit(modal) {
    if (modal.isItialized) {
        console.log('🛠: testimonialFormModalInit -> ', 'already inited');
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
                body:  new URLSearchParams(formData).toString(),
            })
             .then(res => {
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
    const trigger = e.target.closest('.js-trigger-testimonial-form');
    if (trigger) {
        Modal.showModal('testimonialFormModal', {
            onShown: testimonialFormModalInit,
        });
    }
});
