import { Cart } from '@/js/modules/Cart';
import CustomSelect from '@/js/common/CustomSelect';

/**
 *
 * @param {HTMLElement} section
 * @param { import("../custom-input/methods")} inputMethods
 */
export default async function checkoutPickupDateInit(section, inputMethods) {
    const { default: flatpickr } = await import(
        /* webpackChunkName: "flatpickr" */ 'flatpickr'
    );
    await import(
        /* webpackChunkName: "flatpickr" */ 'flatpickr/dist/flatpickr.min.css'
    );
    const { Russian } = await import(
        /* webpackChunkName: "flatpickr" */ 'flatpickr/dist/l10n/ru.js'
    );

    const sectionParent = section.closest('.cart-section');
    const form = sectionParent.querySelector('#cartCheckoutForm');
    const sideBar = sectionParent.querySelector('#cartSidebar');

    const pickupDateNode = section.querySelector('#pickupDate');
    const pickupTimeSelectNode = section.querySelector('#pickupTime');

    const pickupTimeSelect = new CustomSelect(pickupTimeSelectNode, {
        valueType: 'value'
    });

    const pickupDateSelect = flatpickr(pickupDateNode, {
        locale: Russian,
        dateFormat: 'd-m-Y',
        minDate: new Date(),
        disableMobile: 'true',
        disable: [
            function(date) {
                // return true to disable
                return (date.getDay() === 6);
            }
        ],
        onReady(_, __, { calendarContainer }) {
            calendarContainer.classList.add('checkout-date');
        },
        onOpen() {
            inputMethods.hideSingleInputError(
              pickupDateSelect.isMobile ? pickupDateSelect.mobileInput : pickupDateSelect.input
            );
        },
        onClose(val) {
            console.log(val);
            if (val.length === 0) {
                inputMethods.showInputError(
                  pickupDateSelect.isMobile
                    ? pickupDateSelect.mobileInput
                    : pickupDateSelect.input,
                  'Выберите дату'
                );
                pickupTimeSelectNode.classList.add('disabled');
                pickupTimeSelect.clearSelected();
            } else {
                pickupTimeSelectNode.classList.remove('disabled');
                Cart.deliveryCalculate(form, sideBar);
            }
        },
        onChange(val) {
            //TODO send selected date to server now or only on close hook
            //updateTimeSlots(timeSelect, html)
        },
    });

    const activePickupDateInput = pickupDateSelect.isMobile
        ? pickupDateSelect.mobileInput
        : pickupDateSelect.input;

    inputMethods.floatLabelsInit([activePickupDateInput]);

    return {
        validate() {
            const selectedDate =
              pickupDateSelect.selectedDates.length > 0 &&
              pickupDateSelect.selectedDates[0];

            if (!pickupDateSelect.input.disabled) {
                if (!selectedDate) {
                    inputMethods.showInputError(activePickupDateInput, 'Выберите дату');
                    return {
                        errors: [
                            {
                                el: activePickupDateInput,
                            },
                        ],
                    };
                } else if (!pickupTimeSelect.valueInput.value) {
                    pickupTimeSelect.select.classList.add('error');
                    return {
                        errors: [
                            {
                                el: pickupTimeSelect.select,
                                selectInstance: pickupTimeSelect,
                            },
                        ],
                    };
                } else {
                    return {
                        errors: [],
                    };
                }
            } else {
                return {
                    errors: [],
                };
            }
        },
    };
}
