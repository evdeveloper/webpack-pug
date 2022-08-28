import { postData } from '@/js/common/ajax';
import Modal from '@/js/common/Modal';

/**
 *
 * @param {HTMLDivElement} modal
 */
export default async function editAddressModalInit(modal) {
    if (modal.isItialized) {
        console.log('🛠: authModalInit -> ', 'already inited');
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
            /** TODO post some data */
            const action = form.getAttribute('action');
            const formData = new FormData(form);

            postData(action, {
                body: formData,
                headers: {},
            }).then(res =>{
                if(res.success && res.canReloadPage){
                    Modal.closeModal(modal.id);
                    window.location.href = window.location;
                }else alert(res.error);
            });
        }
    });
}

function validateForm(inputs) {
    return [...inputs].every(input =>
        input.parentElement.classList.contains('valid')
    );
}
