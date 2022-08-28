import CustomSelect from '@/js/common/CustomSelect';
import { Cart } from '@/js/modules/Cart';
import {postData} from "@/js/common/ajax";

/**
 *
 * @param {HTMLElement} card
 */

export default function productCardInit(card) {
    const packSelectNode = card.querySelector(
        '.product-card__pack .custom-select'
    );
    if (packSelectNode) {
        new CustomSelect(packSelectNode, {
            onSelect: onPackChange.bind(null, card),
        });
    }

    const buyBtn = card.querySelector('.product-card__buy');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            const productId = card.dataset.id;

            Cart.addProduct(productId);
        });
    }

    card.classList.add('initialized');
}

/**
 *
 * @param {HTMLElement} productCard
 * @param {Object} item
 */
function onPackChange(productCard) {
    const oldPriceNode = productCard.querySelector('.product-card__old-price');
    const currentPriceNode = productCard.querySelector(
        '.product-card__current-price'
    );

    getActuallyBadgesByServer(productCard);

    /** TODO change for real data later */
    // oldPriceNode.textContent = '1999 ₽';
    // currentPriceNode.textContent = '2000 ₽';
}

// для карточки товара в списке.
function getActuallyBadgesByServer(productCard) {
    const badgesNode = productCard.querySelector('.product-card__labels');
    const data = {id: productCard.dataset.id};
    postData('/product-card-badges.php', {
        body: new URLSearchParams(data).toString()
    }).then(res => {
        const oldBadges = badgesNode.querySelectorAll('.product-card__label:not(.js-discount-label)');
        if (oldBadges) {
            oldBadges.forEach(el => el.remove());
        }
        badgesNode.insertAdjacentHTML('beforeend', res.html);
    });
}