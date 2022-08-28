import { postData } from '@/js/common/ajax';
import { debounce } from '@/js/common/helpers';
import { Cart } from '@/js/modules/Cart';

export default async function cartInfoInit() {
    const section = document.querySelector('.cart-info');
    if (!section) return;

    promocodeLogic(section);
}

/**
 *
 * @param {HTMLElement} section
 */
function promocodeLogic(section) {
    const currentPromocodeInputs = section.querySelectorAll(
        '.cart-info__promocode .custom-input'
    );
    const addPromocodeButton = section.querySelector(
        '.cart-info__add-promocode'
    );

    const promocodesWrapper = section.querySelector('.cart-info__promocodes');

    const debouncedPromocodeValidate = debounce(promocodeValidate, 500);

    currentPromocodeInputs.forEach(input => {
        input.addEventListener('input', debouncedPromocodeValidate);
    });

    if (addPromocodeButton) {
        addPromocodeButton.addEventListener('click', () => {
            const promocodeInput = currentPromocodeInputs[0];
            const promocodeNode = promocodeInput.parentNode;

            const clone = promocodeNode.cloneNode(true);
            clone.querySelector('.custom-input').classList.remove('success');
            clone.querySelector('.custom-input__input').value = '';
            clone.classList.add('can-remove');
            promocodesWrapper.append(clone);

            clone
                .querySelector('.custom-input__input')
                .addEventListener('input', debouncedPromocodeValidate);
        });
    }

    section.addEventListener('click', e => {
        if (e.target.classList.contains('cart-info__promocode-remove')) {
            const promocodeInput = e.target.closest('.cart-info__promocode').querySelector('input');
            const action = '/cart/promocode-remove.php';

            postData(action, {
                body: new URLSearchParams({promocode: promocodeInput.value}),
            }).then(res => {
              if (!res.STATUS) {
                  promocodeInput.parentNode.classList.add('error');
              } else{
                  Cart.updateLayout(res);
                  const form = document.querySelector('#cartCheckoutForm');
                  const sideBar = document.querySelector('#cartSidebar');
                  Cart.deliveryCalculate(form, sideBar);
              }
          })
        }
    })
}

function promocodeValidate(e) {
    e.preventDefault();
    const value = e.target.value.trim();
    if (value.length < 4) {
        e.target.parentNode.classList.remove('success');
        return;
    }
    const parentNode = e.target.parentNode;
    const action = '/cart/promocode.php';

    postData(action, {
        body: new URLSearchParams(`${e.target.name}=${value}`),
    }).then(res => {
        if (!res.STATUS) {
            parentNode.classList.remove('success');
            parentNode.classList.add('error');
        } else {
            parentNode.classList.remove('error');
            parentNode.classList.add('success');
            Cart.updateLayout(res);
            Cart.updateTotal(res);
        }
    })
}
