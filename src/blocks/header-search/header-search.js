import { postData } from '@/js/common/ajax';
import { debounce, getAllSiblings } from '@/js/common/helpers';
import {
    hide,
    slideDown,
    fadeIn,
    deviceType,
    fadeToggle,
    compensateScrollbarWidth,
    fadeOut,
} from '@/js/common/plugins';

/**
 *
 * @param {HTMLElement} header
 * @returns
 */
export default function headerSearch(header) {
    const headerSearch = header.querySelector('.header-search');
    if (!headerSearch) return;

    /**
     * @type {HTMLFormElement}
     */
    const searchForm = headerSearch.querySelector('.header-search__form');
    const headerSearchContainer = headerSearch.parentNode;
    // const searchTrigger = header.querySelector('.js-search-trigger');

    const searchInput = searchForm.querySelector('.header-search__input');
    const searchReset = searchForm.querySelector('.header-search__reset');

    const resultWrapper = headerSearch.querySelector('.header-search__result');
    const resultContainer = headerSearch.querySelector(
        '.header-search__result-container'
    );

    const headerLogo = document.querySelector('.main-header__logo');

    searchReset.addEventListener('click', closeSearch);

    /** listen for Esc key press */
    document.addEventListener('keyup', e => {
        if (headerSearch.classList.contains('active') && e.key === 'Escape') {
            closeSearch();
        }
    });

    /** listen for search trigger buttons click */
    header.addEventListener('click', e => {
        if (e.target.classList.contains('js-search-trigger')) {
            if (headerSearch.classList.contains('active')) {
                closeSearch();
                return;
            }

            headerSearch.classList.add('active');

            /** fixed header has diffrent height, so need to change search container's padding-top */
            // if (deviceType.minimumLaptopMedia.matches) {
            //     const parentHeader = e.target.closest('.main-header');
            //     headerSearch.style.paddingTop = `${parentHeader.offsetHeight}px`;
            // }

            // compensateScrollbarWidth('set');
            // document.body.classList.add('search-opened');

            getAllSiblings(headerSearchContainer).forEach(el =>
                el.classList.add('hidden')
            );

            toggleLogo(headerLogo);

            searchInput.focus();

            return;
        }

        if (searchForm.contains(e.target) || resultContainer.contains(e.target))
            return;

        if (headerSearch.classList.contains('active')) closeSearch();
    });

    document.addEventListener('click', e => {
        if (
            e.target.classList.contains('js-search-trigger') ||
            searchForm.contains(e.target) ||
            resultContainer.contains(e.target)
        )
            return;

        if (headerSearch.classList.contains('active')) closeSearch();
    });

    // remove listener to redirect on seacrh page 
    // searchForm.addEventListener('submit', search);

    const debouncedSearch = debounce(search, 500);
    searchInput.addEventListener('input', debouncedSearch);

    function closeSearch() {
        headerSearch.classList.remove('active');
        headerSearch.classList.remove('result-shown');
        searchForm.reset();

        hide(resultWrapper);
        resultContainer.innerHTML = '';

        getAllSiblings(headerSearchContainer).forEach(el =>
            el.classList.remove('hidden')
        );

        // document.body.classList.remove('search-opened');
        // compensateScrollbarWidth('reset');

        toggleLogo(headerLogo);
    }

    function showResults(data) {
        headerSearch.classList.add('result-shown');
        // resultContainer.append();

        fadeIn(resultWrapper, { speed: 100 }).then(() => {
            slideDown(resultContainer);
            resultContainer.innerHTML = data;
        });
    }

    function search(e) {
        e.preventDefault();
        const value = searchInput.value.trim();
        if (value.length < 3) return;

        const url = searchForm.dataset.url;

        postData(url, {
            body: new URLSearchParams(`${searchInput.name}=${value}`),
        })
            .then(res => {
                showResults(res.html);
            })
            .catch(console.log(e));
    }
}

function toggleLogo(logo) {
    if (deviceType.isMobile) {
        fadeToggle(logo);
    }
}
