import deliveryZones from '@/data/deliveryZones';
import { mapIconParams } from '@/data/mapIconConfig';
import { loadYandexMap } from '@/js/common/ajax';
import {
    debounce,
    deleteCookie,
    getCookie,
    setCookie,
} from '@/js/common/helpers';
import Modal from '@/js/common/Modal';
import { getData, postData } from '@/js/common/ajax';

import {
    deviceType,
    fadeIn,
    fadeOut,
    hide,
    isHidden,
    show,
    slideDown,
    slideUp,
} from '@/js/common/plugins';

/** link to map placemark used over several functions */
let placemark = null;

/** yandex maps geobject with all zones */
let mapZones = null;

/** selected address state */
let selectedDeliveryData = {
    address: '',
    zone: '',
    coordinates: [],
};

function setSelectedDeliveryData(address, zone, coordinates) {
    selectedDeliveryData = {
        ...selectedDeliveryData,
        address,
        zone,
        coordinates,
    };
}

export default function deliveryAddressModalInit(triggered = false) {
    const modal = document.querySelector('#deliveryAddressModal');
    const canShowModal =
        localStorage.getItem('hideDeliveryAddressModal') !== null &&
        localStorage.getItem('hideDeliveryAddressModal') !== undefined
            ? false
            : true;
    if (!modal) return;

    if (triggered === true || canShowModal) {
        Modal.showModal(modal.id, { setLocalStorage: true });
    }

    if (!modal || modal.isInitialized) return;

    const savedAddressCoordinates = getCookie('addressCoordinates');

    modal.isInitialized = true;

    const scheme = deliveryZones.allZones;
    let pickupPoints;
    if (
        typeof window.pickUPoints !== null &&
        window.pickUPoints !== undefined
    ) {
        pickupPoints = window.pickUPoints;
    } else {
        pickupPoints = deliveryZones.pickupPoints;
    }

    const form = modal.querySelector('.delivery-address-modal__form');
    const notFoundButton = modal.querySelector(
        '.delivery-address-modal__not-found'
    );

    loadYandexMap('&coordorder=longlat').then(() => {
        deliveryMapInit(scheme, savedAddressCoordinates).then(mapInstance => {
            formInit(form, mapInstance);
        });

        pickupMapInit(pickupPoints, modal);
    });

    tabsLogic(modal);

    notFoundButton.addEventListener('click', () => {
        Modal.closeModal(modal.id);

        deleteCookie('addressRegion');
        deleteCookie('addressCity');
        deleteCookie('addressStreet');
        deleteCookie('addressHouse');
        deleteCookie('addressBlock');

        deleteCookie('addressType');
        deleteCookie('address');
        deleteCookie('zoneName');
        deleteCookie('addressCoordinates');

        // document.querySelectorAll('.js-address-change').forEach(node => {
        //     hide(node.parentElement);
        // });
    });
}

function deliveryMapInit(scheme, savedCoords) {
    return new Promise(resolve => {
        ymaps.ready(() => {
            const map = new ymaps.Map(
                'deliveryMap',
                {
                    center: [30.315868, 59.939098],
                    zoom: 9,
                    controls: ['zoomControl'],
                },
                {
                    searchControlProvider: 'yandex#search',
                }
            );

            mapZones = ymaps.geoQuery(scheme).addToMap(map);

            mapZones.each(function (obj) {
                obj.options.set({
                    fillColor: obj.properties.get('fill'),
                    fillOpacity: obj.properties.get('fill-opacity'),
                    strokeColor: obj.properties.get('stroke'),
                    strokeWidth: obj.properties.get('stroke-width'),
                    strokeOpacity: obj.properties.get('stroke-opacity'),
                });
            });

            map.behaviors.disable('scrollZoom');

            if (deviceType.isMobile || deviceType.isTablet) {
                map.behaviors.disable('drag');
            }

            map.geoObjects.events.add('click', e => {
                const coords = e.get('coords');

                const selectedZone = highlightSelectedZone(coords);

                showPlacemark(coords, map);
                getAddressByCoords(coords, selectedZone);
            });

            map.events.add('click', e => {
                console.log('Ничего не выбрано');
            });

            if (savedCoords) {
                const coords = savedCoords.split(',');
                showPlacemark(coords, map);
            }

            resolve({ map });
        });
    });
}

/**
 *
 * @param {HTMLFormElement} form
 */
async function formInit(form, { map }) {
    const action = form.action;
    let currentSelectedAddress = null;

    const module = await import(
        /* webpackChunkName: "inputMethods" */
        '../custom-input/custom-input'
    );
    const InputMethods = await module.default();

    const addressInput = form.querySelector('#deliveryModalAddress');
    const regionInput = form.querySelector('[name="REGION"]');
    const cityInput = form.querySelector('[name="CITY"]');
    const streetInput = form.querySelector('[name="STREET"]');
    const houseInput = form.querySelector('[name="HOUSE"]');
    const blockInput = form.querySelector('[name="BLOCK"]');

    const autocompleteDropdown = form.querySelector('.autocomplete-dropdown');
    const autocompleteDropdownList = autocompleteDropdown.querySelector(
        '.autocomplete-dropdown__list'
    );

    addressInput.disabled = false;

    InputMethods.floatLabelsInit([addressInput]);
    InputMethods.handleTextInput(addressInput);

    const onInput = debounce(
        function () {
            const currentValue = this.value.trim();

            InputMethods.hideSingleInputError(addressInput);

            if (!currentValue || currentValue === '' || currentValue.length < 3)
                return;

            if (isHidden(autocompleteDropdown))
                slideDown(autocompleteDropdown, { toggleClass: 'active' });

            getData(`/address-search.php?query=${currentValue}`).then(data => {
                if (data === null || data === undefined) {
                    InputMethods.showInputError(
                        addressInput,
                        'Улица не найдена'
                    );
                } else {
                    autocompleteDropdownList.innerHTML = data.html;
                }
            });
        },
        500,
        false
    );

    addressInput.addEventListener('input', onInput);

    autocompleteDropdown.addEventListener('click', e => {
        const targetItem = e.target.closest('.autocomplete-dropdown__item');
        if (targetItem) {
            slideUp(autocompleteDropdown, {
                toggleClass: 'active',
            }).promise.then(() => {
                autocompleteDropdownList.innerHTML = '';
                addressInput.value = targetItem.textContent;

                regionInput.value = targetItem.dataset.region;
                cityInput.value = targetItem.dataset.city || targetItem.dataset.settlement;
                streetInput.value = targetItem.dataset.street;
                houseInput.value = targetItem.dataset.house;
                blockInput.value = targetItem.dataset.block;
            });

            ymaps
                .geocode(targetItem.textContent, {
                    results: 1,
                })
                .then(data => {
                    const firstGeoObject = data.geoObjects.get(0);
                    const coords = firstGeoObject.geometry.getCoordinates();
                    const zoneName = highlightSelectedZone(coords);
                    showPlacemark(coords, map);

                    getAddressByGeoObject(firstGeoObject, zoneName, coords);
                });
        }
    });

    document.addEventListener('click', e => {
        if (
            autocompleteDropdown.classList.contains('active') &&
            !autocompleteDropdown.contains(e.target)
        ) {
            slideUp(autocompleteDropdown, {
                toggleClass: 'active',
            });
        }
    });

    document.addEventListener('address-selected', e => {
        currentSelectedAddress = e.detail.result;
        const zoneName = e.detail.zoneName;
        const coordinates = e.detail.coords;
        const addressParts = e.detail.addressParts;

        const addressString = currentSelectedAddress.join(', ');

        switch (currentSelectedAddress.length) {
            case 0:
                addressInput.value = addressString;
                addressInput.dispatchEvent(new Event('blur'));
                break;
            case 1:
                addressInput.value = addressString;
                addressInput.dispatchEvent(new Event('blur'));

                /** next tick */
                setTimeout(() => {
                    InputMethods.showInputError(
                        addressInput,
                        'Необходимо уточнить адрес'
                    );
                });
                break;
            case 2:
            default:
                regionInput.value = addressParts.area;
                cityInput.value = addressParts.city;
                streetInput.value = addressParts.street;
                houseInput.value = addressParts.house;

                addressInput.value = addressString;
                addressInput.dispatchEvent(new Event('blur'));
                toggleDeliveryTip(zoneName);

                setSelectedDeliveryData(addressString, zoneName, coordinates);

                break;
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        if (!currentSelectedAddress) {
            Modal.closeModal('deliveryAddressModal');
            return;
        }

        if (!addressInput.parentNode.classList.contains('valid')) {
            switch (currentSelectedAddress.length) {
                case 1:
                    addressInput.dispatchEvent(new Event('blur'));

                    /** next tick */
                    setTimeout(() => {
                        InputMethods.showInputError(
                            addressInput,
                            'Необходимо уточнить адрес'
                        );
                    });
                    break;
                case 2:
                default:
                    addressInput.value = addressString;
                    addressInput.dispatchEvent(new Event('blur'));
                    break;
            }
            return;
        }

        updateSelectedAddress(addressInput.value);

        setCookie('addressRegion', regionInput.value, 365);
        setCookie('addressCity', cityInput.value, 365);
        setCookie('addressStreet', streetInput.value, 365);
        setCookie('addressHouse', houseInput.value, 365);
        setCookie('addressBlock', blockInput.value, 365);

        setCookie('addressType', 'delivery', 365);
        setCookie('address', selectedDeliveryData.address, 365);
        setCookie('zoneName', selectedDeliveryData.zone, 365);
        setCookie('addressCoordinates', selectedDeliveryData.coordinates, 365);

        Modal.closeModal('deliveryAddressModal');
    });
}

/**
 *
 * @param {String} type
 */
function toggleDeliveryTip(type) {
    console.log(type);
    const activeTip = document.querySelector(
        '.delivery-address-modal__tip.active'
    );
    const targetTip = document.querySelector(
        `.delivery-address-modal__tip[data-type='${type}']`
    );

    if (activeTip) hide(activeTip, { classList: 'active' });
    if (targetTip) show(targetTip, { classList: 'active' });
}

function showPlacemark(coords, map) {
    if (placemark) {
        map.geoObjects.remove(placemark);
    }
    const newPlacemark = createPlacemark(coords);
    map.geoObjects.add(newPlacemark);

    newPlacemark.events.add('dragend', function () {
        const selectedZone = highlightSelectedZone(
            placemark.geometry.getCoordinates()
        );
        getAddressByCoords(placemark.geometry.getCoordinates(), selectedZone);
    });

    placemark = newPlacemark;
}

function getAddressByCoords(coords, zoneName) {
    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        /** nice format of returned address */
        const city =
            firstGeoObject.getLocalities().length > 0
                ? firstGeoObject.getLocalities()[0]
                : '';
        const area =
            firstGeoObject.getAdministrativeAreas().length > 0
                ? firstGeoObject.getAdministrativeAreas()[0]
                : '';
        const secondArea =
            firstGeoObject.getAdministrativeAreas().length > 1
                ? firstGeoObject.getAdministrativeAreas()[1]
                : '';
        const street = firstGeoObject.getThoroughfare()
            ? firstGeoObject.getThoroughfare()
            : '';
        const house = firstGeoObject.getPremiseNumber()
            ? firstGeoObject.getPremiseNumber()
            : '';

        let result = [area, secondArea, city, street, house];
        result = [...new Set(result.filter(Boolean))];

        const addressParts = {
            area,
            secondArea,
            city,
            street,
            house
        }

        document.dispatchEvent(
            new CustomEvent('address-selected', {
                detail: {
                    addressParts,
                    result,
                    zoneName,
                    coords,
                },
            })
        );

        return result.join(', ');

        /** or just uncomment next line */
        // vm.selectedAddress = firstGeoObject.getAddressLine();
    });
}

function getAddressByGeoObject(geoObject, zoneName, coords) {
    /** nice format of returned address */
    const city =
        geoObject.getLocalities().length > 0
            ? geoObject.getLocalities()[0]
            : '';
    const area =
        geoObject.getAdministrativeAreas().length > 0
            ? geoObject.getAdministrativeAreas()[0]
            : '';
    const secondArea =
        geoObject.getAdministrativeAreas().length > 1
            ? geoObject.getAdministrativeAreas()[1]
            : '';
    const street = geoObject.getThoroughfare()
        ? geoObject.getThoroughfare()
        : '';
    const house = geoObject.getPremiseNumber()
        ? geoObject.getPremiseNumber()
        : '';

    // console.table({ city, area, secondArea, street, house });

    let result = [area, city, street, house];
    result = [...new Set(result.filter(Boolean))];

    const addressParts = {
        area,
        secondArea,
        city,
        street,
        house
    }

    document.dispatchEvent(
        new CustomEvent('address-selected', {
            detail: {
                addressParts,
                result,
                zoneName,
                coords,
            },
        })
    );

    return result.join(', ');
}

function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {}, mapIconParams);
}

/**
 *
 * @param {*} coords
 * @returns {String} description of zone
 */
function highlightSelectedZone(coords) {
    const polygon = mapZones.searchContaining(coords).get(0);

    if (!polygon) return 'Zone undefined';

    mapZones.setOptions('fillOpacity', 0.4);
    polygon.options.set('fillOpacity', 0.8);

    return polygon.properties.get('description');
}

/**
 *
 * @param {HTMLElement} modal
 */
function tabsLogic(modal) {
    const tabsNavBtns = modal.querySelectorAll(
        '.delivery-address-modal__tabs-nav button'
    );

    tabsNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            const targetName = btn.dataset.target;
            const targetTab = modal.querySelector(
                `.delivery-address-modal__tab[data-type='${targetName}']`
            );
            const currentTab = modal.querySelector(
                '.delivery-address-modal__tab.active'
            );

            tabsNavBtns.forEach(b => b.classList.remove('active'));

            fadeOut(currentTab, { toggleClass: 'active' }).then(() => {
                fadeIn(targetTab, { toggleClass: 'active' }).then(() => {
                    btn.classList.add('active');
                });
            });
        });
    });
}

/**
 *
 * @param {{}} data
 * @param {HTMLElement} modal
 */
function pickupMapInit(data, modal) {
    const pickupCards = modal.querySelectorAll('.delivery-address-modal__card');

    ymaps.ready(() => {
        const map = new ymaps.Map(
            'pickupMap',
            {
                center: data.mapCenter,
                zoom: data.zoom,
                controls: ['zoomControl'],
            },
            {
                searchControlProvider: 'yandex#search',
            }
        );

        const objectManager = new ymaps.ObjectManager({
            clusterize: true,
            hasHint: true,
        });

        const points = data.features;

        objectManager.objects.options.set(mapIconParams);

        objectManager.add(points);

        objectManager.objects.events.add('click', markerOnClickEvent);

        map.geoObjects.add(objectManager);
        map.behaviors.disable('scrollZoom');

        if (window.matchMedia('(max-width: 1024px)').matches) {
            map.behaviors.disable('drag');
        }

        function markerOnClickEvent(event) {
            event.stopPropagation();
            event.get('domEvent').originalEvent.stopPropagation();

            const pointId = event.get('objectId');
            console.log(pointId);
            postData('/forms/add-pickup.php', {
                body: new URLSearchParams({ id: pointId }),
            });
            const geoObject = objectManager.objects.getById(pointId);

            setCookie('addressType', 'pickup', 365);
            setCookie('address', geoObject.address, 365);
            setCookie('pickupId', pointId, 365);

            updateSelectedAddress(geoObject.address);
            Modal.closeModal('deliveryAddressModal');

            return false;
        }

        pickupCards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const geoObject = objectManager.objects
                    .getAll()
                    .find(el => el.id === id);

                postData('/forms/add-pickup.php', {
                    body: new URLSearchParams({ id }),
                });

                setCookie('addressType', 'pickup', 365);
                setCookie('address', geoObject.address, 365);
                setCookie('pickupId', id, 365);

                updateSelectedAddress(geoObject.address);
                Modal.closeModal('deliveryAddressModal');
            });
        });
    });
}

function updateSelectedAddress(val) {
    document.querySelectorAll('.js-address-change').forEach(node => {
        node.textContent = val;
    });
}
