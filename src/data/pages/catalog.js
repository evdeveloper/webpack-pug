const productsArray = [
    {
        image: 'catalog/product1.jpg',
        labels: [
            {
                text: 'новинка',
                color: '#219653',
            },
            {
                text: '-5%',
                color: '#EB5757',
            },
        ],
        title: 'Тушка цыпленка-бройлера 1-го сорта потрошеная, охлажденная',
        unitPrice: '85,97 ₽ за кг.',
        packSelect: {
            name: 'pack',
            options: [
                {
                    id: 1232,
                    title: 'Индивидуальная упаковка 1.8 кг.',
                    perPrice: '',
                    currentPrice: '2322,58 ₽',
                    oldPrice: '2322,58 ₽',
                },
                {
                    id: 235245,
                    title: 'Коробка вал 5 кг (75,30 ₽ за кг)',
                    perPrice: '75,30 ₽ за кг',
                    currentPrice: '2312,8 ₽',
                    oldPrice: '2722,58 ₽',
                },
                {
                    id: 1456,
                    title: 'Коробка вал 15 кг (64,69 ₽ за кг)',
                    perPrice: '64,69 ₽ за кг',
                    currentPrice: '2200,58 ₽',
                    oldPrice: '',
                },
            ],
            label: 'Выберите упаковку (вес нетто)',
        },
        prices: {
            old: '3999 ₽',
            current: '2322,58 ₽',
        },
    },
    {
        image: 'catalog/product1.jpg',
        labels: [
            {
                text: 'новинка',
                color: '#219653',
            },
            {
                text: '-5%',
                color: '#EB5757',
            },
        ],
        title: 'Тушка цыпленка-бройлера 1-го',
        unitPrice: ' ',
        packSelect: {
            name: 'pack',
            options: [
                {
                    id: 1232,
                    title: 'Индивидуальная упаковка 1.8 кг.',
                    perPrice: '',
                    currentPrice: '2322,58 ₽',
                    oldPrice: '2322,58 ₽',
                },
                {
                    id: 235245,
                    title: 'Коробка вал 5 кг (75,30 ₽ за кг)',
                    perPrice: '75,30 ₽ за кг',
                    currentPrice: '2312,8 ₽',
                    oldPrice: '2722,58 ₽',
                },
                {
                    id: 1456,
                    title: 'Коробка вал 15 кг (64,69 ₽ за кг)',
                    perPrice: '64,69 ₽ за кг',
                    currentPrice: '2200,58 ₽',
                    oldPrice: '',
                },
            ],
            label: 'Выберите упаковку (вес нетто)',
        },
        prices: {
            old: '3999 ₽',
            current: '2322,58 ₽',
        },
    },
    {
        image: 'catalog/product1.jpg',
        title: 'Тушка цыпленка',
        unitPrice: '85,97 ₽ за кг.',
        packSelect: {
            name: 'pack',
            options: [
                {
                    id: 1232,
                    title: 'Индивидуальная упаковка 1.8 кг.',
                    perPrice: '',
                    currentPrice: '2322,58 ₽',
                    oldPrice: '2322,58 ₽',
                },
                {
                    id: 235245,
                    title: 'Коробка вал 5 кг (75,30 ₽ за кг)',
                    perPrice: '75,30 ₽ за кг',
                    currentPrice: '2312,8 ₽',
                    oldPrice: '2722,58 ₽',
                },
                {
                    id: 1456,
                    title: 'Коробка вал 15 кг (64,69 ₽ за кг)',
                    perPrice: '64,69 ₽ за кг',
                    currentPrice: '2200,58 ₽',
                    oldPrice: '',
                },
            ],
            label: 'Выберите упаковку (вес нетто)',
        },
        prices: {
            old: '',
            current: '2322,58 ₽',
        },
    },
    {
        image: 'catalog/product1.jpg',
        labels: [
            {
                text: '-5%',
                color: '#EB5757',
            },
        ],
        title: 'Тушка цыпленка-бройлера 1-го сорта потрошеная, охлажденная',
        unitPrice: '85,97 ₽ за кг.',
        packSelect: {
            name: 'pack',
            options: [
                {
                    id: 1232,
                    title: 'Индивидуальная упаковка 1.8 кг.',
                    perPrice: '',
                    currentPrice: '2322,58 ₽',
                    oldPrice: '2322,58 ₽',
                },
                {
                    id: 235245,
                    title: 'Коробка вал 5 кг (75,30 ₽ за кг)',
                    perPrice: '75,30 ₽ за кг',
                    currentPrice: '2312,8 ₽',
                    oldPrice: '2722,58 ₽',
                },
                {
                    id: 1456,
                    title: 'Коробка вал 15 кг (64,69 ₽ за кг)',
                    perPrice: '64,69 ₽ за кг',
                    currentPrice: '2200,58 ₽',
                    oldPrice: '',
                },
            ],
            label: 'Выберите упаковку (вес нетто)',
        },
        prices: {
            old: '3999 ₽',
            current: '2322,58 ₽',
        },
    },
];

module.exports.catalog = {
    filters: [
        {
            name: 'category',
            options: [
                'Смотреть все',
                'Охлажденная курица',
                'Полуфабрикаты премиум',
            ],
            placeholder: 'Категория',
        },
        {
            name: 'type',
            options: ['Целые тушки', 'Разделка', 'Субпродукты', 'Прочее'],
            placeholder: 'Тип продукта',
        },
        {
            name: 'suitable',
            options: [
                'Диетично',
                'Домашних питомцев',
                'Первых блюд',
                'Тушения',
                'Шашлыка',
            ],
            placeholder: 'Подходит для',
        },
        {
            name: 'sort',
            options: [
                'Сначала дешевые',
                'Сначала дорогие',
                'Популярные',
                'Новинки',
            ],
            placeholder: 'Сортировка',
        },
    ],
    products: [...productsArray, ...productsArray, ...productsArray],
};
