const infoPages = [
    {
        link: 'payment-page.html',
        text: 'Оформление заказа и оплата',
    },
    {
        link: 'delivery-page.html',
        text: 'Условия и зона доставки',
    },
    {
        link: 'warranty-page.html',
        text: 'Гарантии и возврат',
    },
    {
        link: 'faq-page.html',
        text: 'Часто задаваемые вопросы',
    },
    {
        link: 'pickup-page.html',
        text: 'Самовывоз',
    },
];

module.exports.devNav = {
    main: [
        {
            link: 'result-page.html',
            text: 'Результат оплаты',
        },
        {
            link: 'main-page.html',
            text: 'Главная страница',
        },
        {
            link: 'sales-page.html',
            text: 'Акции',
        },
        {
            link: 'sale-article-page.html',
            text: 'Страница акции',
        },
        {
            link: 'catalog-categories-page.html',
            text: 'Категории каталога',
        },
        {
            link: 'catalog-page.html',
            text: 'Каталог',
        },
        {
            link: 'product-page.html',
            text: 'Карточка товара',
        },
        {
            link: 'cart-page.html',
            text: 'Корзина',
        },
        {
            link: 'cart-pay-page.html',
            text: 'Корзина (оплата)',
        },
        {
            link: 'testimonials-page.html',
            text: 'Отзывы',
        },
        {
            link: 'joint-purchase-page.html',
            text: 'Совместная закупка',
        },
        {
            link: 'pickup-page.html',
            text: 'Самовывоз',
        },
        {
            link: 'about-page.html',
            text: 'О компании',
        },
        ...infoPages,
    ],
    account: [
        {
            link: 'account-orders-page.html',
            text: 'Заказы',
        },
        {
            link: 'account-personal-page.html',
            text: 'Мои данные',
        },
        {
            link: 'account-addresses-page.html',
            text: 'Мои адреса',
        },
        {
            link: 'account-promocodes-page.html',
            text: 'Промокоды',
        },
    ],
    jointPurchase: [
        {
            link: '#',
            text: 'Пушкин',
        },
        {
            link: '#',
            text: 'Петергоф',
        },
    ],
    infoPages
};

module.exports.mainNav = [
    {
        text: 'Акции',
        link: 'sales-page.html',
    },
    {
        text: 'Каталог',
        link: 'catalog-page.html',
        innerNav: [
            {
                text: 'Охлажденная курица',
                link: '#',
                image: 'main-nav/image1.jpg',
            },
            {
                text: 'Полуфабрикаты премиум',
                link: '#',
                image: 'main-nav/image2.jpg',
            },
        ],
    },
    {
        text: 'O нас',
        link: 'about-page.html',
        innerNav: [
            {
                text: 'Птицефабрика',
                link: '#',
                image: 'main-nav/image3.jpg',
            },
            {
                text: 'Бренды',
                link: '#',
                image: 'main-nav/image4.jpg',
            },
        ],
    },
    {
        text: 'Оплата и доставка',
        link: 'payment-page.html ',
    },

];

module.exports.footerNav = [
    [
        {
            link: 'about-page.html',
            text: 'О птицефабрике',
        },
        {
            link: 'account-personal-page.html',
            text: 'Личный кабинет',
        },
        {
            text: 'Отзывы',
            link: 'testimonials-page.html',
        },
        {
            link: 'faq-page.html',
            text: 'Часто задаваемые вопросы',
        }
    ],
    [
        ...this.mainNav,
        {
            text: 'Самовывоз',
            link: 'pickup-page.html',
        },
    ],
];
