import { deviceType, slideToggle } from '@/js/common/plugins';

(function () {
    const productCategories = document.querySelector('.product-categories');
    if (!productCategories) return;

    if (deviceType.isMobile) {
        const triggers = productCategories.querySelectorAll(
            '.product-categories__icon'
        );
        triggers.forEach(el => {
            el.setAttribute('tabindex', '0');

            el.addEventListener('click', () => {
                const list = el.parentElement.nextElementSibling;
                slideToggle(list, { speed: 500 });
                el.classList.toggle('active');
            });
        });
    }
})();
