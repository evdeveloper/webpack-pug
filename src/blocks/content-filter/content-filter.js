import { hide, show } from '@/js/common/plugins';

/**
 *
 * @param {HTMLElement} filterNode
 * @param {HTMLElement[]} elements
 */
export default function contentFilter(filterNode, elements) {
    const allFilterBtns = filterNode.querySelectorAll('.content-filter__btn');

    const initialFilter = filterNode.querySelector(
        '.content-filter__btn.active'
    );
    const initialId = initialFilter.dataset.id;

    filterElements(initialId, elements);

    filterNode.addEventListener('click', e => {
        /** @type {HTMLButtonElement} */
        const btnTarget = e.target;
        if (btnTarget.classList.contains('content-filter__btn')) {
            if (btnTarget.classList.contains('active')) return;

           

            allFilterBtns.forEach(btn => btn.classList.remove('active'));

            const id = btnTarget.dataset.id;

            if(btnTarget.dataset.type === 'switch'){
                const modalTirgger = document.querySelector('.user-addresses__add-new');
                modalTirgger.dataset.modal = id; 
            }
            btnTarget.classList.add('active');

            filterElements(id, elements);
        }
    });
}

function filterElements(id, elements) {
    /** 0 === show all */
    if (id === '0') {
        elements.forEach(element => show(element));
        return;
    }

    const filteredElements = elements.filter(
        element => element.dataset.id === id
    );
    elements.forEach(element => hide(element));
    filteredElements.forEach(element => show(element));
}
