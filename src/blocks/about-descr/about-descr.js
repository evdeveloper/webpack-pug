import Modal from '@/js/common/Modal';

(function () {
    const guarantyCards = document.querySelectorAll('.guaranty-card');
    if (!guarantyCards.length) return;
    guarantyCards.forEach(item => {
        const id = item.dataset.id;

        item.addEventListener('click', e => {
            const imageSrc = item.querySelector('img')
                .getAttribute('src');
            const clicked = window.guarantee.filter(el => el.id == id)[0];
            createModal(clicked, imageSrc);
            Modal.showModal('resultModal', {
                removeOnClose: true,
            });
        });
    });

    const callModal = (data, imageSrc) => {
        const text = data.modalText.map(text => `<p>${text}</p>`).join('\n');
        return `
            <div class="modal" id="resultModal" aria-hidden="false">
                <div class="result-modal">
                    <div class="modal__overlay modal__overlay_custom" tabindex="-1" data-micromodal-close>
                        <div class="modal__dialog" role="dialog" aria-modal="true" data-micromodal-close>

                            <div class="result-modal__body modal_custom">
                                <button class="result-modal__close modal__close" aria-label="Закрыть окно" data-micromodal-close="">
                                    <svg id="close" viewBox="0 0 14 14" aria-label="Иконка">
                                        <path d="M.408 11.998c-.378.387-.395 1.072.009 1.468.404.395 1.081.386 1.468.009l4.992-4.993 4.983 4.993c.396.386 1.073.395 1.468-.01.396-.403.404-1.071.009-1.467L8.345 7.006l4.992-4.984a1.048 1.048 0 00-.009-1.467 1.065 1.065 0 00-1.468-.01L6.877 5.539 1.885.546C1.498.168.812.15.417.555.021.959.03 1.635.408 2.014L5.4 7.006.408 11.998z"></path>
                                    </svg>
                                </button>
                                <div class="result-modal__header">
                                    <img 
                                        data-src="${imageSrc}" 
                                        alt="" 
                                        src="${imageSrc}">
                                </div>
                                <div class="result-modal__title">${data.modalTitle}</div>
                                <div class="result-modal__subtitle">${text}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    function createModal(data, imageSrc) {
        const modal = callModal(data, imageSrc);
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    const guarantyCard = document.querySelectorAll('.guaranty-card');

    const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.classList.add('animated');
            }
        });
    });
    const arr = document.querySelectorAll('.animate');
    arr.forEach(v => {
        imageObserver.observe(v);
    });
})();
