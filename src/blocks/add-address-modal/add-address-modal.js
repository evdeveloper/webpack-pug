import deliveryZones from '@/data/deliveryZones';
import { mapIconParams } from '@/data/mapIconConfig';
import { loadYandexMap, postData } from '@/js/common/ajax';
import { debounce } from '@/js/common/helpers';
import Modal from '@/js/common/Modal';
import { getData } from '@/js/common/ajax';

import {
    deviceType,
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

export default function addAddressModalInit({ coords, address, id } = {}) {
    const modal = document.querySelector('#addAddressModal');

    const scheme = deliveryZones.allZones;

    const form = modal.querySelector('.add-address-modal__form');
    const addressInput = form.querySelector('#addressModalAddress');

    if (modal.mapInstance) {
        if (coords && address) {
            showPlacemark(coords.split(','), modal.mapInstance.map);
            addressInput.value = address;
        } else {
            addressInput.value = '';
            modal.mapInstance.map.geoObjects.remove(placemark);
        }
    } else {
        loadYandexMap('&coordorder=longlat').then(() => {
            addressMapInit(scheme).then(mapInstance => {
                formInit(form, mapInstance, id);
                modal.mapInstance = mapInstance;

                showPlacemark(coords.split(','), modal.mapInstance.map);
                addressInput.value = address;
            });
        });
    }

    // if (modal.isInitialized) return;

    // modal.isInitialized = true;
}

function addressMapInit(scheme) {
    return new Promise(resolve => {
        ymaps.ready(() => {
            const map = new ymaps.Map(
                'addAddressMap',
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

            resolve({ map });
        });
    });
}

/**
 *
 * @param {HTMLFormElement} form
 */
async function formInit(form, { map }, addressId = null) {
    let selectedAddressData = null;

    const module = await import(
        /* webpackChunkName: "inputMethods" */
        '../custom-input/custom-input'
    );
    const InputMethods = await module.default();

    const addressInput = form.querySelector('#addressModalAddress');
    const regionInput = form.querySelector('[name="REGION"]');
    const cityInput = form.querySelector('[name="CITY"]');
    const streetInput = form.querySelector('[name="STREET"]');
    const houseInput = form.querySelector('[name="HOUSE"]');
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

    document.addEventListener('address-added', e => {
        const selectedAddress = e.detail.address;
        const zoneName = e.detail.zoneName;
        const addressParts = e.detail.addressParts;

        const addressString = selectedAddress.join(', ');

        switch (selectedAddress.length) {
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

                selectedAddressData = e.detail;

                break;
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        if (!selectedAddressData) {
            Modal.closeModal('addAddressModal');
            return;
        }

        if (!addressInput.parentNode.classList.contains('valid')) {
            switch (selectedAddressData.address.length) {
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

        const data = new FormData();
        for (let key in selectedAddressData) {
            if (key === 'result') {
                for (let resultKey in selectedAddressData[key]) {
                    data.append(
                        `result[${resultKey}]`,
                        selectedAddressData[key][resultKey]
                    );
                }
            } else if (key === 'addressParts') {
                for (let resultKey in selectedAddressData[key]) {
                    data.append(
                      `addressParts[${resultKey}]`,
                      selectedAddressData[key][resultKey]
                    );
                }
            } else {
                data.append(key, selectedAddressData[key]);
            }
        }

        if (addressId) data.append('id', addressId)

        postData('/forms/edit-address.php', {
            headers: {},
            body: data,
        })
            .then(res => {
                if (res.success && res.canReloadPage) window.location.reload();
            })
            .catch(e => {
                console.log(e);
            })
            .finally(() => {
                Modal.closeModal('addAddressModal');
            });
    });
}

/**
 *
 * @param {String} type
 */
function toggleDeliveryTip(type) {
    //console.log(type);
    const activeTip = document.querySelector('.add-address-modal__tip.active');
    const targetTip = document.querySelector(
        `.add-address-modal__tip[data-type='${type}']`
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

        let address = [area, secondArea, city, street, house];
        address = [...new Set(address.filter(Boolean))];

        const result = { area, secondArea, city, street, house };

        const addressParts = {
            area,
            secondArea,
            city,
            street,
            house
        }

        document.dispatchEvent(
            new CustomEvent('address-added', {
                detail: {
                    addressParts,
                    address,
                    zoneName,
                    coords,
                    result,
                },
            })
        );

        return address.join(', ');

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

    let address = [area, city, street, house];
    address = [...new Set(address.filter(Boolean))];

    const result = { area, secondArea, city, street, house };

    const addressParts = {
        area,
        secondArea,
        city,
        street,
        house
    }

    document.dispatchEvent(
        new CustomEvent('address-added', {
            detail: {
                addressParts,
                address,
                zoneName,
                coords,
                result,
            },
        })
    );

    return address.join(', ');
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
