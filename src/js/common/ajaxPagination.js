import { lazyLoadImages } from '@/js/common/helpers';
import productCardInit from '@/blocks/product-card/product-card';

document.querySelector('.js-ajax-show-more')?.addEventListener('click', showMore);

function showMore(e) {
  e.preventDefault();
  const showMoreBtn = e.target;
  const url = showMoreBtn.getAttribute('data-url');
  const ajaxContainer = document.querySelector('.js-ajax-list');

  fetch(url).then(function (response) {
    return response.text();
  }).then(function (text) {

    const html = new DOMParser().parseFromString(text, 'text/html');
    const newBtn = html.querySelector('.js-ajax-show-more')?.parentElement;
    const elements = html.querySelector('.js-ajax-list').innerHTML;

    showMoreBtn.remove();
    ajaxContainer.insertAdjacentHTML('beforeend', elements);
    if (newBtn) {
      ajaxContainer.after(newBtn);
      newBtn.addEventListener('click', showMore);
    }

    lazyLoadImages(document.querySelectorAll('.lazy-img:not(.loaded)'));

    const productCards = document.querySelectorAll('.product-card:not(.initialized)');
    productCards.forEach(card => productCardInit(card));
  });
}
