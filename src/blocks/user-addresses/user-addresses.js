import addressCardLogic from '@/blocks/address-card/address-card';
import editAddressModalInit from '@/blocks/edit-address-modal/edit-address-modal';
import contentFilter from '@/blocks/content-filter/content-filter';
import Modal from '@/js/common/Modal';
import addAddressModalInit from '@/blocks/add-address-modal/add-address-modal';
import { postData } from '@/js/common/ajax';

(function () {
    const userAddresses = document.querySelector('.user-addresses');
    if (!userAddresses) return;

    const addNewTrigger = userAddresses.querySelector(
        '.user-addresses__add-new'
    );

    const addNewTriggerPickup = userAddresses.querySelector(
        '.user-addresses__add-pickup'
    );

    addNewTrigger.addEventListener('click', () => {
        Modal.showModal('addAddressModal', {
            onShown: addAddressModalInit,
        });
    });

    addNewTriggerPickup.addEventListener('click', () => {
        Modal.showModal('addPickUpPoint');
    });

    const cards = [...userAddresses.querySelectorAll('.user-addresses__card')];
    cards.forEach(card => addressCardLogic(card));
    const cardsToFilter = cards.filter(card => card.dataset.id);

    const filterNode = userAddresses.querySelector('.content-filter');
    if (filterNode) {
        contentFilter(filterNode, cardsToFilter);
    }

    document.querySelectorAll('[data-type="add_pickup"]').forEach(card => {
        card.addEventListener('click', function () {
            const id = this.dataset.id;
            const formData = new FormData();
            const action = '/forms/add-pickup.php';
            formData.append('id', id);

            postData(action, {
                body: formData,
                headers: {},
            }).then(res => {
                if (res.success && res.canReloadPage) {
                    debugger;
                    window.location.href = res.href || window.location;
                } else alert(res.error);
            });
        });
    });
})();
