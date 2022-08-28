export { getData, postData, loadModal, loadYandexMap };

const BASE_URL = '/local/ajax';
/**
 *
 *
 * @param {String} url
 * @param {Object} options
 * @param {String} [options.method = post]
 * @param {Object} [options.headers]
 * @param {URLSearchParams | FormData} [options.body]
 * @returns {Promise}
 */
function postData(url, options) {
    console.log(BASE_URL)
    const requestOptions = {
        method: 'POST',
        headers: options.headers || {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: options.body,
    };
    return fetch(BASE_URL + url, requestOptions).then(response => {
        return response.json();
        // if  (response.ok) {
        //     return response.json();
        // } else {
        //     window.location.reload()
        // }
    });
}

function getData(url, options) {
    return fetch(BASE_URL + url, options).then(
        response => {
            return response.json();
        },
        e => {}
    );
}

function loadModal(url) {
    return new Promise(resolve => {
        getData(url).then(data => {
            const modalHtml = data.html;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            resolve();
        });
    });
}

/**
 *
 * @param {String} params additional params to load yandex script
 * @returns
 */
function loadYandexMap(params = '') {
    return new Promise(resolve => {
        if (window.yandexMapIsLoading) {
            setTimeout(() => resolve(loadYandexMap(url)), 1000);
        } else if (typeof ymaps !== 'undefined') {
            resolve();
        } else {
            // const yandexMapUrl = url;
            window.yandexMapIsLoading = true;
            const yandexMapUrl =
                window.yandexMapUrl ||
                `https://api-maps.yandex.ru/2.1/?apikey=ffdb9429-0e6a-4614-bc3c-506c6e953a6e&lang=ru_RU&coordorder=longlat`;
            const yandexMapScript = document.createElement('script');
            yandexMapScript.type = 'text/javascript';
            yandexMapScript.src = yandexMapUrl;
            document.body.appendChild(yandexMapScript);

            yandexMapScript.onload = function () {
                window.yandexMapIsLoading = false;
                resolve();
            };
        }
    });
}
