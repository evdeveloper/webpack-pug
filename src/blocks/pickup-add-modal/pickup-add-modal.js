import { postData } from '@/js/common/ajax';
import Modal from '@/js/common/Modal';

/**
 *
 * @param {HTMLDivElement} modal
 */
export default async function pickupAddModalInit(modal) {
    if (modal.isItialized) {
        return;
    }

    modal.isItialized = true;
}


