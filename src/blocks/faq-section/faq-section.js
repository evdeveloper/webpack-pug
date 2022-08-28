import Accordion from '@/js/common/Accordion';

(function () {
    const faqSection = document.querySelector('.faq-section');
    if (!faqSection) return;

    new Accordion(faqSection)
})();
