import { Cart } from '@/js/modules/Cart';
import { postData } from '@/js/common/ajax';
import {
    hide,
    show,
} from '@/js/common/plugins';

/**
 *
 * @param {HTMLElement} section
 * @param { import("../custom-input/methods")} inputMethods
 */
export default function checkoutPersonalInit(section, inputMethods) {
    const allInputs = section.querySelectorAll('.custom-input input');
    const inputsToValidate = [...allInputs].filter(
        input => input.dataset.validate
    );
    inputMethods.floatLabelsInit(allInputs);
    inputMethods.setInputValidationHandlers(inputsToValidate);

    const phoneInput = section.querySelector('#userPhone');
    const codeInput = section.querySelector('#userPhoneCode');
    const getCodeBtn = section.querySelector('#getPhoneCode');
    const sendCodeBtn = section.querySelector('#sendPhoneCode');
    const codeTimer = section.querySelector('#codeTimer');
    const privatePolicy = section.querySelector('.private-policy-block');
    const checkResult = section.querySelector('.phone-check-result');

    let timerIntervalId;

    const isNonAuthorized = phoneInput.dataset.noneAuthorize;
    if (isNonAuthorized) {
        let updateFired = false;
        phoneInput.addEventListener('blur', () => {
            console.count('blur');
            const isValid = !phoneInput.parentNode.classList.contains('error');

            const form = document.querySelector('#cartCheckoutForm');
            const sideBar = document.querySelector('#cartSidebar');

            if (isValid && !updateFired) {
                updateFired = true;
                Cart.deliveryCalculate(form, sideBar);

                setTimeout(() => {
                    updateFired = false
                }, 500);
            }
        });
    }

    phoneInput.addEventListener('change', (e) => {
        if (inputMethods.validatePhoneInput(phoneInput)) {
            getCodeBtn.classList.remove('disabled');
            codeInput.parentNode.parentNode.classList.remove('disabled');
            codeInput.value = '';
            clearInterval(timerIntervalId);
            hide(codeTimer);
            hide(sendCodeBtn);
            hide(privatePolicy);
            hide(checkResult);
            show(getCodeBtn);
        }
    });

    let canGetSmsCode = true;
    getCodeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        inputMethods.hideInputErrors([codeInput]);

        if (inputMethods.validatePhoneInput(phoneInput)) {

            if (!canGetSmsCode) return;
            canGetSmsCode = false;

            postData('/cart/get-code.php', {body: new URLSearchParams({phone: phoneInput.value}).toString()}).then(
                (res) => {
                    if (res.success) {
                        hide(getCodeBtn);
                        show(sendCodeBtn);
                        show(codeTimer);
                        show(privatePolicy);

                        let seconds = 59;
                        timerIntervalId = setInterval(function () {
                            seconds--;
                            const value = seconds >= 10 ? seconds : '0' + seconds;
                            section.querySelector('.seconds').textContent = value;

                            if (seconds === 0) {
                                clearInterval(timerIntervalId);
                                hide(codeTimer);

                                if (!codeTimer.parentNode.parentNode.classList.contains('verified')) {
                                    hide(sendCodeBtn);
                                    show(getCodeBtn);
                                }
                            }
                        }, 1000);
                    } else {
                        let error = res.error;
                        if (!error) return;
                        inputMethods.showInputError(codeInput, res.error);
                    }
                },
                (rej) => {
                    console.error(rej);
                }
              )
              .finally(()=>{
                  canGetSmsCode = true;
              });
        }
    });

    sendCodeBtn?.addEventListener('click', (e) => {
        e.preventDefault();

        const code = codeInput.value;
        const phone = phoneInput.value;

        postData('/cart/check-code.php', {body: new URLSearchParams({code, phone}).toString()}).then(function (res) {
            if (res.success) {
                clearInterval(timerIntervalId);
                inputMethods.hideInputErrors([codeInput]);
                sendCodeBtn.classList.add('disabled');
                hide(privatePolicy)
                hide(codeTimer);
                codeTimer.parentNode.parentNode.classList.add('verified');

                if (res.canReloadPage) {
                    window.location.href = window.location;
                }

                if (res.newUser) {
                    show(checkResult);
                }
            } else {
                inputMethods.showInputError(codeInput, res.error);
            }
        }, function (rej) {
            console.error(rej);
        });
    });

    return {
        validate() {
            inputMethods.fireInputsValidation(inputsToValidate);

            const codeInput = section.querySelector('#userPhoneCode');
            if (codeInput && !codeInput.parentNode.parentNode.classList.contains('verified')) {
                inputMethods.showInputError(codeInput, 'неверно введен код');
            }

            const firstInputWithError = section.querySelector(
                '.custom-input.error input'
            );

            if (firstInputWithError) {
                return {
                    errors: [{ el: firstInputWithError }],
                };
            } else {
                return { errors: [] };
            }
        },
    };
}
