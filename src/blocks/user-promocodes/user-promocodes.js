import contentFilter from '@/blocks/content-filter/content-filter';
import promocodeCardInit from '@/blocks/promocode-card/promocode-card';

(function () {
    const userPromocodes = document.querySelector('.user-promocodes');
    if (!userPromocodes) return;

    const filterNode = userPromocodes.querySelector('.content-filter');
    if (filterNode) {
        const orders = [
            ...userPromocodes.querySelectorAll('.user-promocodes__card'),
        ];
        contentFilter(filterNode, orders);
    }

    promocodeCardInit();
})();
