import cartCheckoutInit from '@/blocks/cart-checkout/cart-checkout';
import cartPaymentInit from '@/blocks/cart-payment/cart-payment';
import cartInfoInit from '@/blocks/cart-info/cart-info';
import cartProductLogic from '@/blocks/cart-product/cart-product';
import { deviceType } from '@/js/common/plugins';
import { cart } from '@/data/pages/cart';
import { Cart } from '@/js/modules/Cart';
import { debounce } from '@/js/common/helpers';

(async function () {
    const cartSection = document.querySelector('.cart-section');
    if (!cartSection) return;

    const module = await import(
        /* webpackChunkName: "inputMethods" */
        '../custom-input/custom-input'
    );
    const InputMethods = await module.default();

    const form = document.querySelector('#cartCheckoutForm');
    const sideBar = document.querySelector('#cartSidebar');

    cartCheckoutInit(InputMethods);
    cartPaymentInit();
    cartInfoInit();
    cartProductsInit(cartSection);
    toggleStickyPosition(cartSection);

    document.addEventListener('cart-updated', e => {
        Cart.deliveryCalculate(form, sideBar);
    });

    cartSection
        .querySelectorAll('[data-change-delivery-price=""]')
        .forEach(input => {
            input.addEventListener('change', e => {
                //двоится сайдбар, если быстро кликать например этаж и есть лифт.
                const triggers = document.querySelectorAll('[data-change-delivery-price=""]');
                triggers.forEach(element => {
                    element.classList.add('no-touch');
                });
                Cart.deliveryCalculate(form, sideBar);
                setTimeout( () => {
                    triggers.forEach(element => {
                        element.classList.remove('no-touch');
                    });
                }, 500);
            });
        });
})();

/**
 *
 * @param {HTMLElement} section
 */
function cartProductsInit(section) {
    const products = section.querySelectorAll('.cart-section__product');
    if (products.length) {
        products.forEach(cartProductLogic);
    }
}

/**
 *
 * @param {HTMLElement} section
 */
function toggleStickyPosition(section) {
    const info = section.querySelector('.cart-section__info');
    if (deviceType.minimumLaptopMedia.matches && info) {
        const infoHeight = info.offsetHeight;
        if (infoHeight > window.innerHeight - 116) {
            info.style.position = 'static';
        }
    }
}
