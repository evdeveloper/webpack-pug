import { hamburger } from '@/blocks/hamburger/hamburger';
import headerSearch from '@/blocks/header-search/header-search';
import { forceImageLoad, throttle } from '@/js/common/helpers';
import { deviceType } from '@/js/common/plugins';
import fixedHeaderLogo from '@/assets/images/logo-fixed.svg';
import deliveryAddressModalInit from '@/blocks/delivery-address-modal/delivery-address-modal';

const mainHeader = document.querySelector('.main-header');

export function headerInit() {
    if (!mainHeader) return;

    if (deviceType.minimumLaptopMedia.matches) {
        const fixedHeader = createFixedHeader(mainHeader);
        mainHeader.insertAdjacentElement('afterend', fixedHeader);
        headerSearch(fixedHeader);
    } else {
        headerOnSroll(mainHeader, mainHeader.offsetHeight, 'filled');
    }

    try {
        deviceType.minimumLaptopMedia.addEventListener('change', e => {
            /** if resized to screen less than minimumLaptopMedia */
            if (!e.matches)
                headerOnSroll(mainHeader, mainHeader.offsetHeight, 'filled');
        });
    } catch (e) {
        // Fallback for Safari < 14 and older browsers
        deviceType.minimumLaptopMedia.addListener(() => {
            /** if resized to screen less than minimumLaptopMedia */
            if (!e.matches)
                headerOnSroll(mainHeader, mainHeader.offsetHeight, 'filled');
        });
    }

    headerLogic(mainHeader);
    headerSearch(mainHeader);

    document.addEventListener('click', e => {
        const trigger = e.target.closest('.js-address-change');
        if (trigger) {
            deliveryAddressModalInit(true);
        }
    });
}

function headerLogic(header) {
    hamburger(header);
}

/**
 *
 * @param {HTMLElement} mainHeader
 * @returns {HTMLElement}
 */
function createFixedHeader(mainHeader) {
    const fixedHeader = mainHeader.cloneNode(true);
    fixedHeader.classList.add('fixed');

    changeLogo(fixedHeader);

    headerLogic(fixedHeader);

    headerOnSroll(fixedHeader, mainHeader.offsetHeight, 'visible');

    fixedHeader.addEventListener(
        'mouseover',
        () => {
            const innerNavImages = fixedHeader.querySelectorAll(
                '.main-nav__image img[data-src]'
            );
            forceImageLoad(innerNavImages);
        },
        {
            once: true,
        }
    );

    return fixedHeader;
}

/**
 *
 * @param {HTMLElement} header
 * @param {Number} cutoff virtual line of page scroll after which toggle header styles
 * @param {String} modifier just a class we toggle on the header
 */
function headerOnSroll(header, cutoff, modifier) {
    if (header.hasScrollListener) return;

    header.hasScrollListener = true;
    const debouncedScroll = throttle(
        onScroll.bind({}, header, cutoff, modifier),
        200,
        { leading: true }
    );
    document.addEventListener('scroll', debouncedScroll);
}

/**
 *
 * @param {HTMLElement} fixedHeader
 */
async function changeLogo(fixedHeader) {
    const logoImage = fixedHeader.querySelector('.main-header__logo img');
    logoImage.src = fixedHeaderLogo;

    logoImage.addEventListener(
        'load',
        () => {
            logoImage.parentElement.classList.add('loaded');
        },
        { once: true }
    );
}

/**
 *
 * @param {HTMLElement} header
 * @param {Number} cutoff virtual line of page scroll after which toggle header styles
 * @param {String} modifier just a class we toggle on the header
 */
function onScroll(header, cutoff, modifier) {
    if (window.scrollY > cutoff) header.classList.add(modifier);
    else header.classList.remove(modifier);
}
