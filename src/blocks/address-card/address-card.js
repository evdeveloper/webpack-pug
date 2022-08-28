import { loadModal, postData, getData } from '@/js/common/ajax';
import Modal from '@/js/common/Modal';
import { fadeOut, fadeIn } from '@/js/common/plugins';
import editAddressModalInit from '@/blocks/edit-address-modal/edit-address-modal';
import addAddressModalInit from '@/blocks/add-address-modal/add-address-modal';
// import pickupAddModalInit from '@/blocks/edit-address-mod/al/edit-address-modal';

/**
 *
 * @param {HTMLElement} card
 * @returns {void}
 */
export default function addressCardLogic(card) {
    if (!card) return;

    const editBtn = card.querySelector('[data-action="edit"]');
    const deleteBtn = card.querySelector('[data-action="delete"]');
    const id = card.dataset.idEdit;
    const coords = card.dataset.coords;
    const address = card.dataset.address

    card.addEventListener('click', e => {

        if (e.target.contains(editBtn)) {
            Modal.showModal('addAddressModal', {
                onShown: addAddressModalInit.bind(null, {coords, address, id}),
            });
            return;
        }

        if (e.target.contains(deleteBtn)) {
            confirmDelete(card).then(() => {
                getData(`/delete-address.php?id=${id}`).then(res => {
                    if (res.success) {
                        fadeOut(card).then(() => card.remove());
                        window.location.reload();
                    } else alert(res.error);
                });
            });
            return;
        }
    });
}

/**
 *
 * @param {HTMLElement} card
 * @returns {Promise}
 */
function confirmDelete(card) {
    const deleteBlock = card.querySelector('.address-card__delete');
    const confirmButton = deleteBlock.querySelector(
        '.address-card__delete-confirm'
    );
    const cancelButton = deleteBlock.querySelector(
        '.address-card__delete-cancel'
    );

    fadeIn(deleteBlock);

    return new Promise((resolve, reject) => {
        confirmButton.addEventListener(
            'click',
            () => {
                resolve();
            },
            { once: true }
        );
        cancelButton.addEventListener(
            'click',
            () => {
                fadeOut(deleteBlock);
                reject();
            },
            { once: true }
        );
    });
}
