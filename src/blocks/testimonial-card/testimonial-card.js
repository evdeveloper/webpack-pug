import Modal from '@/js/common/Modal';
import { getData } from '@/js/common/ajax';

document.addEventListener('click', e => {
    const target = e.target;
    const modalTrigger = target.closest('.js-testimonial-full')

    if (modalTrigger) {
        e.preventDefault();
        modalTrigger.disabled = true
        const id = modalTrigger.dataset.id;
        getData(`/testimonial.php?id=${id}`).then((data) => {
            const modal = document.getElementById('testimonialModalCard'),
                  modalWrapper = modal.querySelector('.testimonial-card');
            modalWrapper.innerHTML = '';
            modalWrapper.insertAdjacentHTML('beforeend', data.html);
            Modal.showModal('testimonialModalCard', {});
            modalTrigger.disabled = false;
        });
    }
})