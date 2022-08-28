import { CartProductCounter } from '@/blocks/product-counter/product-counter';
import { fadeOut, slideUp } from '@/js/common/plugins';
import { Cart } from '@/js/modules/Cart';

/**
 *
 * @param {HTMLElement} cardWrapper
 */
export default function cartProductLogic(cardWrapper) {
    const card = cardWrapper.querySelector('.cart-product');
    const productId = card.dataset.id;

    const counter = new CartProductCounter(cardWrapper);
    counter.init();

    const removeButton = card.querySelector('.cart-product__remove');
    removeButton.addEventListener('click', () => {

        fadeOut(cardWrapper, { speed: 160 }).then(() => {
            debugger;
            console.log('ooooo');
            Cart.deleteProduct(productId);
            cardWrapper.remove();


        });
        slideUp(cardWrapper, { speed: 160 }).promise.then(() => {debugger;});
    });
}
