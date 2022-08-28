import productCardInit from '@/blocks/product-card/product-card';
import CustomSelect from '@/js/common/CustomSelect';

(function () {
    const catalogSection = document.querySelector('.catalog-section');
    if (!catalogSection) return;

    const productCards = catalogSection.querySelectorAll('.product-card');
    productCards.forEach(card => productCardInit(card));

    const filters = catalogSection.querySelectorAll(
        '.catalog-section__filter .custom-select'
    );
    filters.forEach(filter => new CustomSelect(filter));
})();
