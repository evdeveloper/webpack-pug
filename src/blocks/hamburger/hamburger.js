import { deviceType } from '@/js/common/plugins';

export function hamburger(header) {
    let headerInitialized = false;
    if (!deviceType.minimumLaptopMedia.matches) init();

    try {
        deviceType.minimumLaptopMedia.addEventListener('change', e => {
            /** if resized to screen less than minimumLaptopMedia */
            if (!e.matches) init();
        });
    } catch (e) {
        // Fallback for Safari < 14 and older browsers
        deviceType.minimumLaptopMedia.addListener(() => {
            /** if resized to screen less than minimumLaptopMedia */
            if (!e.matches) init();
        });
    }

    function init() {
        if (headerInitialized) return;
        headerInitialized = true;

        const hamburger = header.querySelector('.hamburger');
        const mobilenav = document.querySelector('.mobile-nav');

        hamburger.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobilenav.classList.remove('opened');
                document.body.classList.remove('menu-opened');
                header.classList.remove('menu-opened');
            } else {
                hamburger.classList.add('active');
                mobilenav.classList.add('opened');
                document.body.classList.add('menu-opened');
                header.classList.add('menu-opened');
            }
        });
    }
}
