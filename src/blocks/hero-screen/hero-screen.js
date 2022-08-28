import Flickity from 'flickity';
import 'flickity/dist/flickity.min.css';
import 'flickity-imagesloaded';

import { lazyLoadPictures, setCustomViewportUnits } from '@/js/common/helpers';

(function () {
    const heroScreen = document.querySelector('.hero-screen');
    if (!heroScreen) return;

    setCustomViewportUnits(false);

    const bannersWrapper = heroScreen.querySelector('.hero-screen__banners');

    if (bannersWrapper.children.length > 1) {
        sliderInit(bannersWrapper);
    } else {
        const lazyImages = bannersWrapper.querySelectorAll('.lazy-banner');
        lazyLoadPictures(lazyImages);
    }
})();

function sliderInit(wrapper) {
    const slider = new Flickity(wrapper, {
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        imagesLoaded: true,
        contain: true,
        cellAlign: 'center',
        autoPlay: 5000,
        on: {
            ready: onSliderReady,
        },
    });

    function onSliderReady() {
        const lazyImages = wrapper.querySelectorAll('.lazy-banner');
        lazyLoadPictures(lazyImages, {
            root: this.viewport,
            rootMargin: '0%',
        });
    }

    const dots = createCustomDots(wrapper, slider);

    dots.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('active')) return;

        [...dots.children].forEach(el => el.classList.remove('active'));
        button.classList.add('active');

        const index = [...dots.children].indexOf(button);
        slider.select(index);
    });

    slider.on('change', index => {
        [...dots.children].forEach(el => el.classList.remove('active'));
        const thumb = dots.children[index];
        thumb.classList.add('active');
    });
}

/**
 *
 * @param {HTMLElement} wrapper
 * @param {Flickity} slider
 *
 * @returns {HTMLElement}
 */
function createCustomDots(wrapper, slider) {
    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('hero-screen__dots');

    slider.getCellElements().forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('hero-screen__dot');

        if (index === 0) dot.classList.add('active');

        dotsContainer.append(dot);
    });

    // wrapper.insertAdjacentElement('afterend', dotsContainer)
    wrapper.append(dotsContainer);

    return dotsContainer;
}
