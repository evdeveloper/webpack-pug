import Flickity from 'flickity';
import 'flickity/dist/flickity.min.css';
import 'flickity-imagesloaded';
import { lazyLoadImages } from '@/js/common/helpers';
import { Cart } from '@/js/modules/Cart';
import CustomSelect from '@/js/common/CustomSelect';
import ProductCounter from '@/blocks/product-counter/product-counter';
import { AlertMessages } from '@/blocks/alert-messages/alert-messages';
import {postData} from "@/js/common/ajax";

(function () {
    const productSection = document.querySelector('.product-section');

    if (!productSection) return;

    const productPrice = productSection.querySelector('[data-current]');

    sliderInit(productSection);

    const packSelectNode = productSection.querySelector(
        '.product-section__pack .custom-select'
    );

    let packSelect;
    if (packSelectNode) {
        packSelect = new CustomSelect(packSelectNode, {
            onSelect: onPackChange.bind(null, productSection),
        });
    }

    const counter = new ProductCounter(productSection, true);
    counter.init();

    const buyBtn = productSection.querySelector('.product-section__buy');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            if (!packSelect.valueInput.value) {
                new AlertMessages().add({
                    title: 'Выберите упакову',
                    status: '',
                    type: 'error',
                });
                return;
            }

            buyBtn.disabled = true;
            const productId = productSection.dataset.id;

            Cart.addProduct(productId, counter.currentCount).finally(
                () => (buyBtn.disabled = false)
            );
        });
    }
})();

/**
 *
 * @param {HTMLElement} productSection
 * @param {Object} item
 */
function onPackChange(productSection, item) {
    const oldPriceNode = productSection.querySelector(
        '.product-section__old-price'
    );
    const currentPriceNode = productSection.querySelector(
        '.product-section__current-price'
    );
    getActuallyOfferInfoByServer(productSection);
}

// для детальной карточки товара.
function getActuallyOfferInfoByServer(productSection) {
    const badgesNode = productSection.querySelector('.product-section__labels');
    const warningNode = productSection.querySelector('.js-warning-text');
    const packageNode = productSection.querySelector('.js-package-text');
    const data = {id: productSection.dataset.id};
    postData('/product-offer-info.php', {
        body: new URLSearchParams(data).toString()
    }).then(res => {
        const oldBadges = badgesNode.querySelectorAll('.product-section__label:not(.js-discount-label)');
        if (oldBadges) {
            oldBadges.forEach(el => el.remove());
        }
        badgesNode.insertAdjacentHTML('beforeend', res.badges);
        warningNode.innerHTML = res.warning;
        packageNode.innerHTML = res.package;
    });
}

function sliderInit(wrapper) {
    const sliderNode = wrapper.querySelector('.product-section__slides');
    const slider = new Flickity(sliderNode, {
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        imagesLoaded: true,
        contain: true,
        cellAlign: 'center',
        on: {
            ready: onSliderReady,
        },
    });

    function onSliderReady() {
        const lazyImages = sliderNode.querySelectorAll('.lazy-product-image');
        lazyLoadImages(lazyImages, {
            root: this.viewport,
            rootMargin: '75%',
        });
    }

    /** @type {HTMLDivElement} */
    const thumbnails = wrapper.querySelector('.product-section__thumbnails');

    thumbnails.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('active')) return;

        [...thumbnails.children].forEach(el => el.classList.remove('active'));
        button.classList.add('active');

        const index = [...thumbnails.children].indexOf(button);
        slider.select(index);
    });

    slider.on('change', index => {
        [...thumbnails.children].forEach(el => el.classList.remove('active'));
        const thumb = thumbnails.children[index];
        thumb.classList.add('active');
    });
}
