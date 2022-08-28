import contentFilter from '@/blocks/content-filter/content-filter';
import orderCardsInit from '@/blocks/order-card/order-card';

(function () {
    const userOrders = document.querySelector('.user-orders');
    if (!userOrders) return;

    const filterNode = userOrders.querySelector('.content-filter');
    if (filterNode) {
        const orders = [
            ...userOrders.querySelectorAll('.user-orders__order'),
        ];
        contentFilter(filterNode, orders);
    }

    orderCardsInit()
})();
