import { postData } from '@/js/common/ajax';
import { debounce } from '@/js/common/helpers';
import { Cart } from '@/js/modules/Cart';
export default class ProductCounter {
    /**
     * @param {HTMLElement} product
     */
    constructor(product, isProductPage = false) {
        this.product = product;

        this.counter = product.querySelector('.product-counter');
        if (!this.counter) return null;

        this.currentNode = this.counter.querySelector(
            '.product-counter__current'
        );
        this.priceNode = this.product.querySelector('[data-current]');
        this.minusButton = this.counter.querySelector(`[data-action='minus']`);
        this.plusButton = this.counter.querySelector(`[data-action='plus']`);

        this.maxCount = parseInt(this.counter.dataset.max);
        this.initialCount = parseInt(this.currentNode.textContent);
        if(isProductPage)
            this.canSendDataToServer = true;
    }

    init() {
        if (!this.counter) return;

        this.setActiveControls();

        this.minusButton.addEventListener('click', () => {
            this.decreaseCounter();
        });

        this.plusButton.addEventListener('click', () => {
            this.inreaseCounter();
        });
    }

    update(newValue, newMax) {
        this.currentNode.textContent = newValue;

        this.maxCount = +newMax;
        this.counter.dataset.max = newMax;

        this.setActiveControls();
    }

    get currentCount() {
        return parseInt(this.currentNode.textContent);
    }

    set currentCount(value) {
        this.currentNode.textContent = value;
    }

    decreaseCounter() {
        const current = parseInt(this.currentNode.textContent);
        let newValue = current;

        newValue = current - 1;
        this.plusButton.classList.remove('disabled');
        if (newValue < 1) {
            return current;
        } else if (newValue === 1) {
            this.minusButton.classList.add('disabled');
        }

        this.currentNode.textContent = newValue;
        if(this.canSendDataToServer)
            this.getActuallyPriceByServer(newValue);
        return newValue;
    }

    inreaseCounter() {
        const current = parseInt(this.currentNode.textContent);
        let newValue = current;

        newValue = current + 1;
        this.minusButton.classList.remove('disabled');
        if (newValue > this.maxCount) {
            /** show some error, I guess */
            return current;
        } else if (newValue === this.maxCount) {
            this.plusButton.classList.add('disabled');
        }

        this.currentNode.textContent = newValue;
        if(this.canSendDataToServer)
            this.getActuallyPriceByServer(newValue);
        return newValue;
    }

    setActiveControls() {
        this.minusButton.classList.remove('disabled');
        this.plusButton.classList.remove('disabled');

        if (this.maxCount === this.initialCount) {
            this.plusButton.classList.add('disabled');
        }

        if (this.initialCount === 1) {
            this.minusButton.classList.add('disabled');
        }
    }

    getActuallyPriceByServer(newValue){
        const id = this.currentNode.closest('[data-id]').dataset.id;
        const data = {
            id: id,
            count: newValue
        }
        postData('/product-price.php', {
            body: new URLSearchParams(data).toString()
        }).then(res => {
            this.priceNode.textContent = res.PRICE
        })

    }
}

export class CartProductCounter extends ProductCounter {
    constructor(product, callbacks = {}) {
        super(product);

        this.productCard = this.product.querySelector('.cart-product');

        this.productId = this.productCard.dataset.id;

        this.callbacks = callbacks;
    }

    decreaseCounter() {
        const newValue = super.decreaseCounter();
        this.submitProductCount(newValue);
    }

    inreaseCounter() {
        const newValue = super.inreaseCounter();
        this.submitProductCount(newValue);
    }

    submitProductCount = debounce(newValue => {
        Cart.updateProductCount(this.productId, newValue);
    }, 500);
}
