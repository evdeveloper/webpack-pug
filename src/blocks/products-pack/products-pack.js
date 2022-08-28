import productCardInit from '@/blocks/product-card/product-card';
import SliderContols from '@/blocks/slider-controls/slider-controls';
import { throttle } from '@/js/common/helpers';
import { Cart } from '@/js/modules/Cart';
import { deviceType } from '@/js/common/plugins';
import Flickity from 'flickity';
import 'flickity-imagesloaded';
import 'flickity/dist/flickity.min.css';

Flickity.prototype._createResizeClass = function () {
    this.element.classList.add('flickity-resize');
};

Flickity.createMethods.push('_createResizeClass');

var resize = Flickity.prototype.resize;
Flickity.prototype.resize = function () {
    this.element.classList.remove('flickity-resize');
    resize.call(this);
    this.element.classList.add('flickity-resize');
};

(function () {
    const productsPack = document.querySelector('.products-pack');
    if (!productsPack) return;

    const productsList = productsPack.querySelector(
        '.products-pack__products-inner'
    );

    const slider = new Flickity(productsList, {
        wrapAround: false,
        imagesLoaded: true,
        prevNextButtons: false,
        pageDots: false,
        contain: true,
        cellAlign: 'left',
    });

    const controls = new SliderContols(slider, productsPack);
    controls.toggle();

    const throttledToggle = throttle(() => {
        controls.toggle();
    }, 300)
    window.addEventListener('resize', throttledToggle);

    const counter = productsPack.querySelector('.products-pack__counter');
    const currentNode = counter.querySelector('.current');
    const totalNode = counter.querySelector('.total');
    totalNode.textContent = slider.getCellElements().length;

    slider.on('change', index => {
        if (index > 0) {
            slider.element.classList.add('started');
        } else {
            slider.element.classList.remove('started');
        }

        if (index > 1) {
            slider.element.classList.add('finished');
        } else {
            slider.element.classList.remove('finished');
        }

        currentNode.textContent = ++index;
    });

    const productCards = productsPack.querySelectorAll('.product-card');
    productCards.forEach(card => productCardInit(card));

    const productPackBuy = document.querySelector('.products-pack__buy');
    productPackBuy?.addEventListener('click', function (e) {
        e.preventDefault();
        const ids = e.target.getAttribute('data-ids');
        Cart.addSet(ids);
    });
})();
