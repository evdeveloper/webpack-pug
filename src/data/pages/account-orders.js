const orderInfo = {
    details: [
        {
            label: 'Дата доставки:',
            value: '24  февраля 2021',
        },
        {
            label: 'Адрес доставки:',
            value: 'Лиговский проспект 140, кв. 406',
        },
        {
            label: 'Вес заказа:',
            value: '4.2 кг.',
        },
        {
            label: 'Товары:',
            value: '13 968, 54 ₽',
        },
        {
            label: 'Промокод:',
            value: '- 560, 78 ₽',
            modifier: 'negative',
        },
        {
            label: 'Скидка:',
            value: '- 52 ₽',
            modifier: 'negative',
        },
        {
            label: 'Стоимость подъема:',
            value: '50 ₽',
        },
        {
            label: 'Стоимость доставки:',
            value: '199 ₽',
        },
    ],
    products: [
        {
            image: 'account-orders/product1.jpg',
            title: 'Тушка цыпленка-бройлера 1-го сорта потрешеная, охлажденная',
            subttile: 'Индивидуальная упаковка 1,8 кг.',
            amount: '2 шт.',
            price: '456,17 ₽',
        },
        {
            image: 'account-orders/product1.jpg',
            title: 'Тушка цыпленка-бройлера 3-го сорта',
            subttile: 'Индивидуальная упаковка 1,8 кг.',
            amount: '2 шт.',
            price: '456,17 ₽',
        },
        {
            image: 'account-orders/product1.jpg',
            title: 'Тушка цыпленка-бройлера 1-го сорта потрешеная, охлажденная',
            subttile: 'Индивидуальная упаковка 1,8 кг.',
            amount: '9 шт.',
            price: '12 456,17 ₽',
        },
    ],
};

module.exports.filter = [
    { id: 0, label: 'Все' },
    { id: 1, label: 'Выполненные' },
    { id: 2, label: 'В работе' },
    { id: 3, label: 'Отмененные' },
];

module.exports.orders = [
    {
        id: 2,
        status: 'draft',
        statusLabel: 'Черновик',
        title: 'Заказ №49854-23 от 24.02.2021',
        price: '23 456,17 ₽',
        info: orderInfo,
    },
    {
        id: 2,
        status: 'planned',
        statusLabel: 'Поставлен на доставку 03.08.2021 с 11:00 - 14:00',
        title: 'Заказ №49854-23 от 24.02.2021',
        price: '23 456,17 ₽',
        info: orderInfo,
        paymentStatus: 'Не оплачен',
    },
    {
        id: 1,
        status: 'done',
        statusLabel: 'Доставлен',
        title: 'Заказ №49854-23 от 24.02.2021',
        price: '23 456,17 ₽',
        info: orderInfo,
        paymentStatus: 'Оплачен',
    },
    {
        id: 2,
        status: 'courier',
        statusLabel: 'Передан курьеру',
        title: 'Заказ №49854-23 от 24.02.2021',
        price: '23 456,17 ₽',
        info: orderInfo,
        paymentStatus: 'Оплачен',
    },
    {
        id: 3,
        status: 'cancelled',
        statusLabel: 'Отменен',
        title: 'Заказ №49854-23 от 24.02.2021',
        price: '23 456,17 ₽',
        info: orderInfo,
    },
    {
        id: 3,
        status: 'refunded',
        statusLabel: 'Возврат',
        title: 'Заказ №49854-23 от 24.02.2021',
        price: '23 456,17 ₽',
        info: orderInfo,
    },
];
