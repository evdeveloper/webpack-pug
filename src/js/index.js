import '@/scss/main.scss';

import '@/js/polyfills';

/** common blocks */

import { headerInit } from '@/blocks/main-header/main-header';
import Modal from '@/js/common/Modal';
import '@/blocks/img/img';
import '@/blocks/auth-modal/auth-modal';
import '@/blocks/banner-card/banner-card';
import '@/blocks/location-contacts/location-contacts';
import '@/blocks/testimonial-form-modal/testimonial-form-modal';
import '@/blocks/feedback-modal/feedback-modal';
import '@/js/common/ajaxPagination';
import '@/blocks/up-button/up-button';


/* index page */
import '@/blocks/hero-screen/hero-screen';

/* catalog page */
import '@/blocks/catalog-section/catalog-section';

/* about page */
import '@/blocks/about-descr/about-descr';

/* catalog-categories page */
import '@/blocks/product-categories/product-categories';

/* product page */
import '@/blocks/product-section/product-section';
import '@/blocks/testimonials-slider/testimonials-slider';
import '@/blocks/products-pack/products-pack';

/* cart page */
import '@/blocks/cart-section/cart-section';

/* faq page */
import '@/blocks/faq-section/faq-section';

/* delivery page */
import '@/blocks/delivery-map/delivery-map';

/* error page */
import '@/blocks/error-block/error-block';

/** account */

/* account common blocks */
import '@/blocks/sub-nav/sub-nav';

/* mobile navigaion*/
import '@/blocks/mobile-nav/mobile-nav';

/* header marquee*/
import '@/blocks/header-marquee/header-marquee'

/* account orders */
import '@/blocks/user-orders/user-orders';
import '@/blocks/user-credits/user-credits';
import '@/blocks/user-addresses/user-addresses';
import '@/blocks/user-promocodes/user-promocodes';
import deliveryAddressModalInit from '@/blocks/delivery-address-modal/delivery-address-modal';
import  authBlock from '@/blocks/auth-block/auth-block';

document.addEventListener('DOMContentLoaded', () => {
    headerInit();

    Modal.listenTriggers();

    authBlock();

    document.body.classList.add('js-loaded');

    setTimeout(() => {
        deliveryAddressModalInit();
    }, 4000)
});
