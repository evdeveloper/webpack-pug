import checkoutAddressInit from '@/blocks/checkout-address/checkout-address';
import checkoutDateInit from '@/blocks/checkout-date/checkout-date';
import checkoutPickupDateInit from '@/blocks/checkout-pickup-date/checkout-pickup-date';
import checkoutDeliveryInit from '@/blocks/checkout-delivery/checkout-delivery';
import checkoutPersonalInit from '@/blocks/checkout-personal/checkout-personal';
import { scrollTo } from '@/js/common/plugins';
import { postData } from '@/js/common/ajax';


export default async function cartCheckoutInit(InputMethods) {
    const checkoutForm = document.querySelector('#cartCheckoutForm');
    if (!checkoutForm) {
        return;
    }
    //------initialization-------

    const personalStep = checkoutForm.querySelector('.checkout-personal');
    const { validate: checkoutPersonalValidate } = checkoutPersonalInit(
        personalStep,
        InputMethods
    );

    const dateStep = checkoutForm.querySelector('.js-courier-date');
    const { validate: checkoutDateValidate } = await checkoutDateInit(
        dateStep,
        InputMethods
    );

    const datePickupStep = checkoutForm.querySelector('.js-pickup-date');
    const { validate: checkoutPickupDateValidate } = await checkoutPickupDateInit(
        datePickupStep,
        InputMethods
    );

    const deliveryStep = checkoutForm.querySelector('.checkout-delivery');
    const { validate: checkoutDeliveryValidate } = checkoutDeliveryInit(
        deliveryStep,
        InputMethods
    );

    const addressStep = checkoutForm.querySelector('.checkout-address');
    const { validate: checkoutAddressValidate, toggleAddressStep } =
        checkoutAddressInit(addressStep, InputMethods);

    //---------------------------

    deliveryStep.addEventListener('deliveryChanged', e => {
        const selectedType = e.detail.type;
        toggleAddressStep(selectedType);
    });

    checkoutForm.addEventListener('submit', e => {
        e.preventDefault();

        const submitBtn = document.querySelector('[form="cartCheckoutForm"]');
        submitBtn.classList.add('disabled');

        const errors = formValidate();
        if (errors.length) {
            const invalidElement = errors[0].el;
            scrollTo(invalidElement, 200);
            submitBtn.classList.remove('disabled');
        } else {
            const action = checkoutForm.getAttribute('action');
            const formData = new FormData(checkoutForm);

            postData(action, {    
                body: formData,
                headers: {},
            }).then(res =>{
                if (res.success){
                    window.location.href = res.href;
                } else alert(res.error);
            });
        }
    });

    function formValidate() {
        const errors = [
            ...checkoutPersonalValidate().errors,
            ...checkoutPickupDateValidate().errors,
            ...checkoutDeliveryValidate().errors,
            ...checkoutDateValidate().errors,
            ...checkoutAddressValidate().errors,
        ];

        return errors;
    }
}
