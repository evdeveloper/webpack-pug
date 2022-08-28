import { deviceType, fadeIn, fadeOut, fadeToggle } from '@/js/common/plugins';

(function () {
    const subNav = document.querySelector('.sub-nav');
    if (!subNav) return;

    const linksTrigger = subNav.querySelector('.sub-nav__current');
    const linksWrapper = subNav.querySelector('.sub-nav__links');

    linksTrigger.addEventListener('click', () => {
        linksTrigger.classList.toggle('active');
        fadeToggle(linksWrapper);
    });

    try {
        deviceType.minimumTabletMedia.addEventListener('change', e => {
            if (e.matches) {
                fadeIn(linksWrapper, { display: 'flex' });
            } else {
                fadeOut(linksWrapper, {
                    display: 'block',
                });
            }
        });
    } catch (e) {
        // Fallback for Safari < 14 and older browsers
        deviceType.minimumTabletMedia.addListener(() => {
            if (e.matches) {
                fadeIn(linksWrapper, { display: 'flex' });
            } else {
                fadeOut(linksWrapper, {
                    display: 'block',
                });
            }
        });
    }
})();
