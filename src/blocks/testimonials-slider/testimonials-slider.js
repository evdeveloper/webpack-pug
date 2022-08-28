import SliderContols from '@/blocks/slider-controls/slider-controls';
import { deviceType } from '@/js/common/plugins';
import Flickity from 'flickity';
import 'flickity/dist/flickity.min.css';

import '@/blocks/testimonial-card/testimonial-card';

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
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (!testimonialsSlider) return;

    const sliderNode = testimonialsSlider.querySelector(
        '.testimonials-slider__slider'
    );

    const adaptiveHeight = !deviceType.minimumLaptopMedia.matches;

    const slider = new Flickity(sliderNode, {
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        contain: true,
        cellAlign: 'left',
        adaptiveHeight,
    });

    new SliderContols(slider, testimonialsSlider);
})();
