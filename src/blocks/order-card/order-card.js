import photosUploadInit from '@/blocks/photos-upload/photos-upload';
import { postData } from '@/js/common/ajax';
import { slideToggle } from '@/js/common/plugins';
import Modal from '@/js/common/Modal';
import { Cart } from '@/js/modules/Cart';

export default function orderCardsInit() {
    const orderCards = document.querySelectorAll('.order-card');
    orderCards.forEach(card => {
        orderCommentFormInit(card);
        orderRepeatFormInit(card);
    });

    document.addEventListener('click', e => {
        const headerTrigger = e.target.closest('.order-card__header');

        if (headerTrigger && headerTrigger instanceof HTMLElement) {
            const info = headerTrigger.nextElementSibling;
            headerTrigger.classList.toggle('active');
            slideToggle(info);
        }
    });
}

/**
 *
 *
 * @param {HTMLElement} card
 */
async function orderRepeatFormInit(card) {
    const form = card.querySelector('.js-repeat-order');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const action = form.getAttribute('action');
        const formData = new FormData(form);
        postData(action, {
            body: formData,
            cors: 'same-origin',
            headers: {},
        }).then(res => {
            if (res.success) {
                Modal.showModal('repeatOrderModal', {});
                Cart.updateCartCounter(res.count);
            } else {
                alert(res.error);
            }
        });
    });
}

/**
 *
 *
 * @param {HTMLElement} card
 */
async function orderCommentFormInit(card) {
    const uploadContainer = card.querySelector('.order-card__feedback-upload');
    const dzInstances = await photosUploadInit(uploadContainer);

    const submitTrigger = card.querySelector('.order-card__submit');
    submitTrigger.addEventListener('click', e => {
        e.preventDefault();

        const form = submitTrigger.closest('form');
        const action = form.getAttribute('action');
        const textarea = form.querySelector('textarea');

        if (textarea.value.trim().length > 0) {
            const formData = new FormData(form);
            dzInstances.forEach(dz => {
                if (dz.files.length) {
                    formData.append('files[]', dz.files[0], dz.files[0].name);
                }
            });

            postData(action, {
                body: formData,
                cors: 'same-origin',
                headers: {},
            })
                .then(res => {
                    if (res.success) {
                        form.reset();
                        dzInstances.forEach(dz => dz.removeAllFiles());

                        const resultMessage = document.createElement('div');
                        resultMessage.classList.add('order-card__info-title');
                        resultMessage.textContent = 'Ваше сообщение отправлено';

                        form.replaceWith(resultMessage);
                    } else {
                        alert(res.error);
                    }
                })
        }
    });
}
