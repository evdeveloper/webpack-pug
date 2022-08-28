import { fadeOut, slideUp } from '@/js/common/plugins';

document.addEventListener('click', e => {
    const closeBtn = e.target.closest('.banner-card__close');
    if (closeBtn) {
        const card = closeBtn.closest('.banner-card');
        const parentNode = card.parentElement;
        slideUp(card, { speed: 200 });
        fadeOut(card, { speed: 160 }).then(() => {
            parentNode.remove();
        });
    }
});
