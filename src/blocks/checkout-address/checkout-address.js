import { loadModal } from '@/js/common/ajax';
import Modal from '@/js/common/Modal';
import { cart } from '@/data/pages/cart';
import { fadeIn, fadeOut, slideDown, slideUp } from '@/js/common/plugins';
import { Cart } from '@/js/modules/Cart';
/**
 *
 * @param {HTMLElement} section
 * @param { import("../custom-input/methods")} inputMethods
 */
export default function checkoutAddressInit(section, inputMethods) {
    if(!section || section == null || section == undefined)
        return;
    const allInputs = section.querySelectorAll('.custom-input input');
    const allTextInputs = section.querySelectorAll(
        '.custom-input input:not([type="checkbox"])',
        '.custom-input input:not([type="radio"])'
    );
    const inputsToValidate = section.querySelectorAll(
        '.custom-input input[data-validate]'
    );

    const deliveryChoiceTogglers = section.querySelectorAll(
        '.custom-radio input[data-delivery]'
    );
    const elevationDropdown = section.querySelector('.js-elevation-inputs');
    deliveryChoiceTogglers.forEach(input => {
        input.addEventListener('change', e => {
            
            const type = input.dataset.delivery;
            const form = document.querySelector('#cartCheckoutForm');
            const sideBar = document.querySelector('#cartSidebar');
            Cart.deliveryCalculate(form, sideBar);

            if (type === 'elevation') {
                slideDown(elevationDropdown);
            } else {
                slideUp(elevationDropdown);
            }
        });
    });

    inputMethods.floatLabelsInit(allTextInputs);
    if(inputsToValidate){
        inputMethods.setInputValidationHandlers(inputsToValidate);
    }
    selectSavedAddresses(section);

    return {
        toggleAddressStep(type) {
            console.log('toggle me,', type);
            if (type === 'courier') {
                allInputs.forEach(input => {
                    input.disabled = false;
                });

                fadeIn(section);
            } else if (type === 'self') {
                allInputs.forEach(input => {
                    // input.setAttribute('data-required', input.required);
                    // input.required = false;
                    input.disabled = true;
                });

                fadeOut(section);
            }
        },
        validate() {
            if(inputsToValidate){
                inputMethods.fireInputsValidation(inputsToValidate);
                const firstInputWithError = section.querySelector(
                    '.custom-input.error input:not(:disabled)'
                );
    
                if (firstInputWithError) {
                    return {
                        errors: [{ el: firstInputWithError }],
                    };
                } else {
                    return { errors: [] };
                }
            }
        },
    };
}

/**
 * key: input name
 * value: input value
 */
const fakeAdderssObject = {
    city: 'Санкт-Петербург',
    street: 'Лиговский проспект',
    house: '145',
    appartment: '12',
    entryphone: '12',
};

function selectSavedAddresses(section) {
    const modalTrigger = section.querySelector('.js-trigger-addresses');
    if(modalTrigger){
        modalTrigger.addEventListener('click', () => {
            /** TODO loadModal().then() */
            Modal.showModal('savedAddressesModal', {
                onShown(modal) {
                    const addressSelectBtns = modal.querySelectorAll(
                        '.address-card__select'
                    );
                    addressSelectBtns.forEach(btn => {
                        btn.addEventListener('click', e => {
                            for (const [key, value] of Object.entries(
                                fakeAdderssObject
                            )) {
                                const input = section.querySelector(
                                    `[name="${key}"]`
                                );
                                input.value = value;
                                input.dispatchEvent(new Event('blur'));
                            }
                            Modal.closeModal(modal.id);
                        });
                    });
                },
                removeOnClose: true,
            });
        });
    }
   
}
