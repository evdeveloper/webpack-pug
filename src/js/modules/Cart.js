import { AlertMessages } from '@/blocks/alert-messages/alert-messages';
import { forEach } from '@/data/common/addresses';
import { postData } from '@/js/common/ajax';
import { fadeIn, fadeOut } from '@/js/common/plugins';
import cartInfoInit from "@/blocks/cart-info/cart-info";

const alertMessage = new AlertMessages();

export const Cart = {
    /**
     * add product to cart by id
     * @param {String} id
     * @returns {Promise}
     */
    addProduct(id, amount = 1) {
        return new Promise((resolve, reject) => {
            postData('/cart/add.php', {
                body: JSON.stringify({
                    id,
                    amount,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(data => {
                    this.updateCartCounter(data.count);
                    onCartUpdateEvent({ data, status: 'success' });
                    /** TODO fire this event on postData success */
                    alertMessage.add({
                        title: data.title,
                        status: data.status,
                    });
                    resolve(data);
                })
                .catch(e => {
                    /** TODO demo purpose, remove later */
                    this.updateCartCounter(Math.floor(Math.random() * 10 + 1));
                    onCartUpdateEvent({ e, status: 'error' });

                    reject(e);
                });
        });
    },

    /**
     * add set of products to cart by ids
     * @param {String} ids
     * @returns {Promise}
     */
    addSet(ids) {
        return new Promise((resolve, reject) => {
            postData('/cart/add_set.php', {
                body: JSON.stringify({ ids }),
                headers: { 'Content-Type': 'application/json' },
            }).then(data => {
                this.updateCartCounter(data.count);
                onCartUpdateEvent({ data, status: 'success' });
                /** TODO fire this event on postData success */
                alertMessage.add({
                    title: data.title,
                    status: data.status,
                });
                resolve(data);
            });
        });
    },

    /**
     * delete product from cart by id
     * @param {String} id
     * @returns {Promise}
     */
    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            postData('/cart/delete.php', {
                body: JSON.stringify({
                    id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(data => {
                if (!data.COUNT) {
                    window.location.reload();
                    return;
                }

                onCartUpdateEvent({ data, status: 'success' });
                this.updateCartCounter(data.COUNT);
                // this.updateLayout(data);
                resolve(data);
            });
        });
    },

    updateProductCount(id, amount) {
        return new Promise((resolve, reject) => {
            postData('/cart/update.php', {
                body: JSON.stringify({
                    id: id,
                    amount: amount,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(data => {
                this.updateCartCounter(data.count);
                onCartUpdateEvent({ data, status: 'success' });
                this.updateLayout(data);
                resolve(data);
            });
        });
    },

    updateCartCounter(count) {
        const cartCounters = document.querySelectorAll('.js-cart-counter');

        cartCounters.forEach(el => (el.textContent = count || 0));
    },

    updateLayout(data) {
        /*  Обновление элементов корзины */
        const section = document.querySelector('.cart-section');
        const emptyCartBlock = document.querySelector('.empty-cart');
        if (data.BASKET !== null) {
            data.BASKET.forEach(element => {
                this.updateCartItems(element);
            });
        } else {
            section.remove();
            emptyCartBlock.classList.remove('hidden-element');
        }
    },

    updateCartItems(data) {
        const basketContainer = document.querySelector(
            '.cart-section__products'
        );
        if (basketContainer) {
            const basketCard = basketContainer.querySelector(
                `[data-id="${data.PRODUCT_ID}"]`
            );
            if (basketCard) {
                const counter = basketCard.querySelector(
                    '.product-counter__current'
                );
                const oldPrice = basketCard.querySelector(
                    '.cart-product__old-price span'
                );
                const currentPrice = basketCard.querySelector(
                    '.cart-product__current-price span'
                );
                if (counter) counter.textContent = data.QUANTITY;
                if (oldPrice) oldPrice.textContent = data.OLD_PRICE * data.QUANTITY;
                if (currentPrice) currentPrice.textContent = data.PRICE_FORMAT;
                if (data.OLD_PRICE !== data.PRICE_FORMAT)
                    oldPrice.parentNode.classList.remove('hidden');
            }
        }
    },

    deliveryCalculate(form, sideBar) {
        const formData = new FormData(form);
        const action = '/cart/delivery-calculate.php';
        if (sideBar) {
            fadeOut(sideBar).then(() => {
                sideBar.innerHTML = '';
                postData(action, {
                    body: new URLSearchParams(formData),
                }).then(res => {
                    sideBar.insertAdjacentHTML('afterbegin', res.html);
                    cartInfoInit();
                    if (res.freeDelivery) {
                        new AlertMessages().add({
                            title: 'Вам доступна бесплатная доставка!',
                            status: '',
                        });
                    }

                    fadeIn(sideBar)
                });
            });
        }
    },

    updateTotal(data) {
        const totalDiscountBlock = document.querySelector('#basketDiscount');
        if (totalDiscountBlock) totalDiscountBlock.textContent = data.DISCOUNT_FULL;

        const totalDeliveryBlock = document.querySelector('#deliveryPriceText');
        const totalDelivery = Number(totalDeliveryBlock.textContent);

        const totalLifUpBlock = document.querySelector('#liftUpPrice');
        const totalLifUp = Number(totalLifUpBlock.textContent);

        const intervalPriceBlock = document.querySelector('#payIntervalPrice');
        const intervalPrice = intervalPriceBlock ? Number(intervalPriceBlock.textContent) : 0;

        const cartTotalBlock = document.querySelector('#totalPrice');
        const cartTotal = data.BASKET_CURRENT_PRICE + totalDelivery + totalLifUp + intervalPrice;

        cartTotalBlock.textContent = cartTotal;
    },

};

function onCartUpdateEvent(data) {
    const event = new CustomEvent('cart-updated', {
        detail: data,
    });
    document.dispatchEvent(event);
}
