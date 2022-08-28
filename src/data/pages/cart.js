const productsArray = [
    {
        image: 'catalog/product1.jpg',
        title: 'Тушка цыпленка-бройлера 1-го сорта потрошеная, охлажденная',
        subtitle: 'Тушка цыпленка-бройлера 1-го сорта потрошеная, охлажденная',
        weight: 'Вес: 1,25 кг',
        amount: '1',
        packSelect: {
            name: 'pack',
            options: [
                'Индивидуальная упаковка 1.8 кг.',
                'Коробка вал 5 кг (75,90 ₽ за кг)',
                'Коробка вал 15 кг (64,90 ₽ за кг)',
            ],
        },
        prices: {
            old: '3999 ₽',
            current: '2322,58 ₽',
        },
    },
    {
        image: 'catalog/product1.jpg',

        title: 'Тушка цыпленка-бройлера 1-го',
        subtitle: 'Тушка цыпленка-бройлера 1-го',
        amount: '3',
        packSelect: {
            name: 'pack',
            options: [
                'Индивидуальная упаковка 1.8 кг.',
                'Коробка вал 5 кг (75,90 ₽ за кг)',
                'Коробка вал 15 кг (64,90 ₽ за кг)',
            ],
        },
        prices: {
            old: '3999 ₽',
            current: '21 120,99 ₽',
        },
    },
    {
        image: 'catalog/product1.jpg',
        title: 'Тушка цыпленка',
        subtitle: 'Тушка цыпленка',
        weight: 'Вес: 1,25 кг',
        amount: '2',
        prices: {
            old: '3999 ₽',
            current: '4 456,17 ₽',
        },
    },
    {
        image: 'catalog/product1.jpg',
        title: 'Тушка цыпленка-бройлера 1-го сорта потрошеная, охлажденная',
        subtitle: 'Тушка цыпленка-бройлера 1-го сорта потрошеная, охлажденная',
        weight: 'Вес: 1,25 кг',
        amount: '1',
        prices: {
            old: '3999 ₽',
            current: '2322,58 ₽',
        },
    },
];

const pickupPointsSelect = {
    name: 'delivery_place',
    placeholder: 'Выбрать точку доставки',
    options: [
        { id: 1, label: 'Самовывоз с севера города' },
        { id: 2, label: 'Самовывоз с юга города' },
    ],
};

module.exports.cart = {
    deliveryTimeSelect: {
        name: 'delivery_time',
        placeholder: 'Выбрать время доставки',
        options: [
            '09:00 — 12:00',
            '11:00 — 14:00',
            '12:00 — 18:00',
            '14:00 — 17:00',
            '15:00 — 20:00',
            '17:00 — 22:00',
        ],
    },
    pickupPointsSelect,
    products: productsArray,
    banner: {
        title: 'Промокод на скидку 25% уже в личном кабинете',
        text: 'В личном кабинете вы можете найти актуальные промокоды со скидка до 45%.',
        action: 'в личный кабинет',
    },
    mapData: {
        type: 'FeatureCollection',
        zoom: 12,
        mapCenter: [59.939099, 30.315877],
        features: [
            {
                type: 'Feature',
                id: pickupPointsSelect.options[0].id,
                name: pickupPointsSelect.options[0].label,
                geometry: {
                    type: 'Point',
                    coordinates: [60.008924, 30.308349],
                },
                properties: [],
            },
            {
                type: 'Feature',
                id: pickupPointsSelect.options[1].id,
                name: pickupPointsSelect.options[1].label,
                geometry: {
                    type: 'Point',
                    coordinates: [59.833898, 30.572117],
                },
                properties: [],
            },
        ],
    },
};
