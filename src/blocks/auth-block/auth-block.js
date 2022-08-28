import { postData } from '@/js/common/ajax';
import { fadeIn, fadeOut } from '@/js/common/plugins';

export default async function authBlock() {
    const module = await import(
        /* webpackChunkName: "inputMethods" */
        '../custom-input/custom-input'
    );
    const InputMethods = await module.default();
    const block = document.querySelector('.auth-block');
    if(block){
        authBlockInit(block, InputMethods);
    }
/**
 *
 * @param {HTMLDivElement} block
 * @param {import('@/blocks/custom-input/methods')} inputMethods
 */
 function authBlockInit(block, inputMethods) {

    block.isItialized = true;
    const allLabelledInputs = block.querySelectorAll('.custom-input__input');
    inputMethods.floatLabelsInit(allLabelledInputs);

    const requiredInputs = block.querySelectorAll(
        '.custom-input__input[required]'
    );
    requiredInputs.forEach(input => {
        inputMethods.handleTextInput(input);
    });

    const phoneInput = block.querySelector('#authPhone');
    const birthDayInput = block.querySelector('#authBirthDay');

    inputMethods.handlePhoneInput(phoneInput);
    inputMethods.handleBirthdayInput(birthDayInput);
    
    const forms = block.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const label = form.querySelector('.custom-input');
            const parentStep = form.closest('.auth-block__step');
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

    function resetAuthForms(block) {
        const forms = block.querySelectorAll('form');
        forms.forEach(form => form.reset());

        const blockInputs = block.querySelectorAll('.custom-input input');
        blockInputs.forEach(input => {
            block.InputMethods.hideSingleInputError(input);
            input.parentElement.classList.remove('js-has-value');
        });

        const currentStep = block.querySelector('.auth-block__step.active');
        const initialStep = block.querySelector('.auth-block__step');

        switchSteps(currentStep, initialStep);
    }
};




