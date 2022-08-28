import { AlertMessages } from '@/blocks/alert-messages/alert-messages';
import { copyToClipboard } from '@/js/common/plugins';

export default function promocodeCardInit() {
    document.addEventListener('click', e => {
        const trigger = e.target.closest('.promocode-card__copy');
        if (trigger && trigger instanceof HTMLButtonElement) {
            copyToClipboard(trigger.textContent).then(() => {
                const alertMessage = new AlertMessages();
                alertMessage.add({
                    title: 'Промокод успешно скопирован',
                    status: trigger.textContent,
                });
            });
        }
    });
}
