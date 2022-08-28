module.exports.product = {
    slides: [
        'product/product-slide1.jpg',
        'product/product-slide2.jpg',
        'product/product-slide3.jpg',
    ],
    thumbnails: [
        'product/product-thumb1.jpg',
        'product/product-thumb2.jpg',
        'product/product-thumb3.jpg',
    ],
    labels: [
        {
            text: 'хит',
            color: '#2D9CDB',
        },
        {
            text: '-5%',
            color: '#EB5757',
        },
    ],
    title: 'Тушка цыпленка-бройлера 1-го сорта потрошеная, охлажденная',
    article: ' ТУ 10.13.14-212-23476484-2018',
    brand: 'Птицефабрика «Северная»',
    prices: {
        old: '999 ₽',
        current: '322,58 ₽',
    },
    packSelect: {
        name: 'pack',
        placeholder: 'Выберите упаковку',
        options: [
            'Индивидуальная упаковка 1.8 кг.',
            'Коробка вал 5 кг (75,90 ₽ за кг)',
            'Коробка вал 15 кг (64,90 ₽ за кг)',
        ],
    },
    spec: [
        {
            modifier: 'no-wrap',
            title: 'Б,Ж,У:',
            value: 'Белки – 16 г. <br> Жиры – 14 г. <br>Углеводы – 0 г.',
        },
        {
            title: 'Срок годности и условия хранения',
            value: 'Не более 9 суток при температуре хранения от -2°C до +2°C и относительной влажности воздуха (85±5) %',
        },
    ],

    advantages: [
        { icon: 'product/advantage1.svg', label: 'Без добавок' },
        { icon: 'product/advantage2.svg', label: 'Без ГМО' },
        { icon: 'product/advantage3.svg', label: 'Ручная работа' },
        {
            icon: 'product/advantage4.svg',
            label: 'Короткий срок хранения',
        },
    ],
    description: [
        {
            title: 'Способ приготовления',
            value: 'Перед употреблением продукт подвергнуть термической обработке до полной кулинарной готовности.',
        },
        {
            title: 'Энергетическая ценность:',
            value: '800 кДж (190 ккал)',
        },
        {
            modifier: 'full-width',
            title: 'Вид упаковки',
            value: 'Индивидуальная упаковка: Тушка в полиэтиленовом пакете с клипсой. Валовая упаковка: Короб из гофрированного картона - количество вложений 4 тушки (вес нетто 7,2 кг); Короб из гофрированного картона - количество вложений 8 тушек (вес нетто 14,4кг).',
        },
    ],
};

module.exports.breadcrumbs = [
    'Каталог',
    'Мясо птицы',
    'Мясо цыпленка-бройлера',
];

module.exports.packProducts = [
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
        // packSelect: {
        //     name: 'pack',
        //     options: [
        //         'Индивидуальная упаковка 1.8 кг.',
        //         'Коробка вал 5 кг (75,90 ₽ за кг)',
        //         'Коробка вал 15 кг (64,90 ₽ за кг)',
        //     ],
        // },
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
        unitPrice: '',
        // packSelect: {
        //     name: 'pack',
        //     options: [
        //         'Индивидуальная упаковка 1.8 кг.',
        //         'Коробка вал 5 кг (75,90 ₽ за кг)',
        //         'Коробка вал 15 кг (64,90 ₽ за кг)',
        //     ],
        // },
        prices: {
            old: '3999 ₽',
            current: '2322,58 ₽',
        },
    },
    {
        image: 'catalog/product1.jpg',
        title: 'Тушка цыпленка',
        unitPrice: '85,97 ₽ за кг.',
        // packSelect: {
        //     name: 'pack',
        //     options: [
        //         'Индивидуальная упаковка 1.8 кг.',
        //         'Коробка вал 5 кг (75,90 ₽ за кг)',
        //         'Коробка вал 15 кг (64,90 ₽ за кг)',
        //     ],
        // },
        prices: {
            old: '',
            current: '2322,58 ₽',
        },
    },
];
