// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';
// import { Russian } from 'flatpickr/dist/l10n/ru.js';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-toward.css';
import { Cart } from '@/js/modules/Cart';
import CustomSelect from '@/js/common/CustomSelect';

/**
 *
 * @param {HTMLElement} section
 * @param { import("../custom-input/methods")} inputMethods
 */
export default async function checkoutDateInit(section, inputMethods) {
    const { default: flatpickr } = await import(
        /* webpackChunkName: "flatpickr" */ 'flatpickr'
    );
    await import(
        /* webpackChunkName: "flatpickr" */ 'flatpickr/dist/flatpickr.min.css'
    );
    const { Russian } = await import(
        /* webpackChunkName: "flatpickr" */ 'flatpickr/dist/l10n/ru.js'
    );

    tooltipInit(section);

    const sectionParent = section.closest('.cart-section');
    const form = sectionParent.querySelector('#cartCheckoutForm');
    const sideBar = sectionParent.querySelector('#cartSidebar');

    const dateNode = section.querySelector('#deliveryDate');
    const timeSelectNode = section.querySelector('#deliveryTime');

    const timeSelect = new CustomSelect(timeSelectNode, {
        onSelect({ el }) {
            const type = el.dataset.type;
            if (type === 'free') {
                timeSelect.valueInput.name = 'FREE_DELIVERY_INTERVALS';
            } else {
                timeSelect.valueInput.name = 'PAY_DELIVERY_INTERVALS';
            }
            Cart.deliveryCalculate(form, sideBar);
        },
        valueType: 'value'
    });

    const dateSelect = flatpickr(dateNode, {
        locale: Russian,
        dateFormat: 'd-m-Y',
        minDate: new Date(),
        // defaultDate: new Date(),
        disableMobile: 'true',
        onReady(_, __, { calendarContainer }) {
            calendarContainer.classList.add('checkout-date');
        },
        onOpen() {
            inputMethods.hideSingleInputError(
                dateSelect.isMobile ? dateSelect.mobileInput : dateSelect.input
            );
        },
        onClose(val) {
            console.log(val);
            if (val.length === 0) {
                inputMethods.showInputError(
                    dateSelect.isMobile
                        ? dateSelect.mobileInput
                        : dateSelect.input,
                    'Выберите дату'
                );
                timeSelectNode.classList.add('disabled');
                timeSelect.clearSelected();
            } else {
                timeSelectNode.classList.remove('disabled');
                Cart.deliveryCalculate(form, sideBar);
            }
        },
        onChange(val) {
            //TODO send selected date to server now or only on close hook
            //updateTimeSlots(timeSelect, html)
        },
    });

    const activeDateInput = dateSelect.isMobile
        ? dateSelect.mobileInput
        : dateSelect.input;

    inputMethods.floatLabelsInit([activeDateInput]);

    return {
        validate() {
            const selectedDate =
                dateSelect.selectedDates.length > 0 &&
                dateSelect.selectedDates[0];

            if (!dateSelect.input.disabled) {
                if (!selectedDate) {
                    inputMethods.showInputError(activeDateInput, 'Выберите дату');
                    return {
                        errors: [
                            {
                                el: activeDateInput,
                            },
                        ],
                    };
                } else if (!timeSelect.valueInput.value) {
                    timeSelect.select.classList.add('error');
                    return {
                        errors: [
                            {
                                el: timeSelect.select,
                                selectInstance: timeSelect,
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

/**
 *
 * @param {HTMLElement} section
 */
function tooltipInit(section) {
    const tipNode = section.querySelector('.tip');
    const content = tipNode?.dataset?.content || '';

    tippy(tipNode, {
        content: content,
        allowHTML: true,
        placement: 'top-end',
        theme: 'base',
        maxWidth: 268,
        offset: [-2, 2],
        arrow: false,
        animation: 'shift-toward',
    });
}

// /**
//  *
//  * @param {HTMLElement} section
//  * @param {CustomSelect} timeSelect
//  */
// function timeRangesToggle(section, timeSelect) {
//     debugger;
//     const rangeBtns = section.querySelectorAll('.checkout-step__range-btn');
//     rangeBtns.forEach(btn => {
//         btn.addEventListener('click', () => {
//             if (btn.classList.contains('active')) return;

//             rangeBtns.forEach(b => b.classList.remove('active'));
//             btn.classList.add('active');
//             const type = btn.dataset.type;
//             const input = section.querySelector('[data-delivery-interval]');
//             const sectionParent = section.closest('.cart-section');
//             const sideBar = sectionParent.querySelector('#cartSidebar');
//             const form = sectionParent.querySelector('#cartCheckoutForm');
//             input.setAttribute('name', type);
//             input.value = '';
//             input.nextElementSibling.innerText = 'Выбрать время доставки';
//             document
//                 .querySelectorAll('[data-type-interval]')
//                 .forEach(option => {
//                     if (option.dataset.typeInterval === type)
//                         option.classList.remove('hidden-element');
//                     else option.classList.add('hidden-element');
//                 });
//             setTimeout(Cart.deliveryCalculate(form, sideBar), 200);
//         });
//     });
// }

/**
 *
 * @param {CustomSelect} timeSelect
 * @param {String} html
 */
function updateTimeSlots(timeSelect, html) {
    timeSelect.optionsList.innerHTML = html;
}
