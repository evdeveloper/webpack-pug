import { deviceType, fadeIn } from '@/js/common/plugins';

(function () {
    const errorBlock = document.querySelector('.error-block');
    if (!errorBlock) return;

    const eggShadow = document.querySelector('.error-block__egg-shadow');
    if (deviceType.desktopMedia.matches) {
        fadeIn(eggShadow);
        errorBlock.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            console.log(x, y);

            eggShadow.style.left = x + 'px';
            eggShadow.style.top = y + 'px';
        });
    }
})();
