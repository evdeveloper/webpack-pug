import { postData } from '@/js/common/ajax';

(async function () {
    const userCredits = document.querySelector('.user-credits');
    if (!userCredits) return;

    const module = await import(
        /* webpackChunkName: "inputMethods" */
        '../custom-input/custom-input'
    );
    const InputMethods = await module.default();

    const form = userCredits.querySelector('.user-credits__form');
    const submitBtn = form.querySelector('.user-credits__submit');

    const allInputs = form.querySelectorAll('.custom-input input');
    InputMethods.floatLabelsInit(allInputs);

    const inputsToValidate = form.querySelectorAll(
        '.custom-input input[data-validate]'
    );
    InputMethods.setInputValidationHandlers(inputsToValidate);

    form.addEventListener('submit', e => {
        e.preventDefault();

        InputMethods.fireInputsValidation(inputsToValidate);
        const formValid = [...inputsToValidate].every(input =>
            input.parentNode.classList.contains('valid')
        );

        if (formValid) {
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const action = form.getAttribute('action');

            postData(action, {
                body: formData,
                headers: {},
            }).then(res =>{
                if(res.success && res.canReloadPage)
                    window.location.href = window.location;
                 else 
                    alert(res.error);
            });
        } else {
            console.log('not valid');
        }
    });
})();
