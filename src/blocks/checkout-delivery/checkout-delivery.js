import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-toward.css';
import CustomSelect from '@/js/common/CustomSelect';
import { cart } from '@/data/pages/cart';
import { loadYandexMap } from '@/js/common/ajax';
import mapIcon from '@/assets/images/map-icon.svg';
import {
    slideToggle,
    deviceType,
    slideDown,
    slideUp,
    scrollTo,
    fadeIn,
    fadeOut,
    hide,
    show,
} from '@/js/common/plugins';
import { debounce, getCookie } from '@/js/common/helpers';
import deliveryZones from '@/data/deliveryZones';
import { mapIconParams } from '@/data/mapIconConfig';
import { getData, postData } from '@/js/common/ajax';
import { Cart } from '@/js/modules/Cart';
import { AlertMessages } from '@/blocks/alert-messages/alert-messages';

/**
 *
 * @param {HTMLElement} section
 * @param { import("../custom-input/methods")} inputMethods
 */
let placemark = null;

export default function checkoutDeliveryInit(section, inputMethods) {
    const deliveryRadioInputs = section.querySelectorAll(
        '.custom-radio input[data-delivery-type]'
    );
    const addressInput = section.querySelector('#checkOutAddress');
    const coordsInput = section.querySelector('#coords');
    const autocompleteDropdown = section.querySelector(
        '.autocomplete-dropdown'
    );
    const autocompleteDropdownList = autocompleteDropdown.querySelector(
        '.autocomplete-dropdown__list'
    );

    const pickupPointSelectNode = document.querySelector(
        '#deliveryPickupPoint'
    );
    const pickupPointSelect = new CustomSelect(pickupPointSelectNode, {
        valueType: 'id',
        onSelect: onPickupPointChange.bind(pickupPointSelectNode),
    });
    const scheme = deliveryZones.allZones;

    const pickPointsDropdown = section.querySelector('.js-pickup-points');
    const deliveryMapDropdown = section.querySelector('.js-delivery-map');

    const addressSelectNode = section.querySelector('#addressDropdown');

    function onPickupPointChange(pickupPointSelectNode) {
        const tipContainer = document.querySelector('#deliveryPickupPoint')?.querySelector('.tip');
        if (tipContainer)
            tooltipUpdate(tipContainer, pickupPointSelectNode.value, section);

        updatePickupIntervals(pickupPointSelectNode.el.dataset.id);
    }

    tooltipInit(section);

    checkOutMapsInit(
        section,
        pickupPointSelect,
        scheme,
        inputMethods,
        autocompleteDropdown,
        autocompleteDropdownList,
        coordsInput,
        addressInput,
        addressSelectNode
    );

    deliveryRadioInputs.forEach(input => {
        input.addEventListener('change', e => {

            const deliveryChangedEvent = new CustomEvent('deliveryChanged', {
                detail: {
                    type: e.target.dataset.delivery,
                },
            });
            slideToggle(pickPointsDropdown);
            slideToggle(deliveryMapDropdown);

            scrollTo(section);

            const deliveryDateBlock = document.querySelector('.js-courier-date');
            const pickupDateBlock = document.querySelector('.js-pickup-date');
            const deliveryBlock = document.querySelector('#deliveryCourierBlock');
            const pickupBlock = document.querySelector('#deliveryPickupBlock');

            if (e.target.dataset.deliveryType === 'self') {
                show(pickupDateBlock);
                const pickupDateInputs = pickupDateBlock.querySelectorAll('input');
                pickupDateInputs.forEach(element => {
                    element.removeAttribute('disabled');
                });
                const pickupBlockInputs = pickupBlock.querySelectorAll('input');
                pickupBlockInputs.forEach(element => {
                    element.removeAttribute('disabled');
                });
                hide(deliveryDateBlock);
                const deliveryDateInputs = deliveryDateBlock.querySelectorAll('input');
                deliveryDateInputs.forEach(element => {
                    element.setAttribute('disabled', 'disabled');
                });
                const deliveryBlockInputs = deliveryBlock.querySelectorAll('input');
                deliveryBlockInputs.forEach(element => {
                    element.setAttribute('disabled', 'disabled');
                });
            } else {
                show(deliveryDateBlock);
                const deliveryDateInputs = deliveryDateBlock.querySelectorAll('input');
                deliveryDateInputs.forEach(element => {
                    element.removeAttribute('disabled');
                });
                const deliveryBlockInputs = deliveryBlock.querySelectorAll('input');
                deliveryBlockInputs.forEach(element => {
                    element.removeAttribute('disabled');
                });
                hide(pickupDateBlock);
                const pickupDateInputs = pickupDateBlock.querySelectorAll('input');
                pickupDateInputs.forEach(element => {
                    element.setAttribute('disabled', 'disabled');
                });
                const pickupBlockInputs = pickupBlock.querySelectorAll('input');
                pickupBlockInputs.forEach(element => {
                    element.setAttribute('disabled', 'disabled');
                });
            }

            section.dispatchEvent(deliveryChangedEvent);
        });
    });

    const deliveryChoiceTogglers = section.querySelectorAll(
        '.custom-radio input[data-delivery]'
    );
    const elevationDropdown = section.querySelector('.js-elevation-inputs');

    section.addEventListener('deliveryChanged', e => {
        const form = document.querySelector('#cartCheckoutForm');
        const sideBar = document.querySelector('#cartSidebar');
        Cart.deliveryCalculate(form, sideBar);
    });

    deliveryChoiceTogglers.forEach(input => {
        input.addEventListener('change', e => {
            const type = input.dataset.delivery;
            if (type === 'elevation') {
                slideDown(elevationDropdown);
            } else {
                slideUp(elevationDropdown);
            }
        });
    });

    return {
        validate() {
            const selectedType = [...deliveryRadioInputs].find(
                input => input.checked
            ).dataset.deliveryType;

            if (selectedType === 'courier') {
                const deliveryAppartmentInput = section.querySelector('#deliveryAppartment');

                if (!addressInput.value) {
                    inputMethods.showInputError(addressInput);
                    return {
                        errors: [
                            {
                                el: addressInput,
                            },
                        ],
                    };
                } else if(!deliveryAppartmentInput.value) {
                    inputMethods.showInputError(deliveryAppartmentInput);
                    return {
                        errors: [
                            {
                                el: deliveryAppartmentInput,
                            },
                        ],
                    };
                } return {
                    errors: [],
                };
            }

            if (
                selectedType === 'self' &&
                !pickupPointSelect.valueInput.value
            ) {
                pickupPointSelect.select.classList.add('error');
                return {
                    errors: [
                        {
                            el: pickupPointSelect.select,
                            selectInstance: pickupPointSelect,
                        },
                    ],
                };
            } else {
                return {
                    errors: [],
                };
            }
        },
    };
}

function updatePickupIntervals(id) {
    postData('/pickup-intervals.php', {
        body: new URLSearchParams({id}).toString(),
    }).then(res => {
        if (res.html) {
            const pickUpTimeBlock = document.querySelector('#pickupTime');
            const pickUpTimeOptions = pickUpTimeBlock?.querySelector('.custom-select__options');
            if (pickUpTimeOptions) {
                pickUpTimeBlock.querySelector('input').value = '';
                pickUpTimeBlock.querySelector('.custom-select__selected').textContent = 'Выбрать время доставки';
                pickUpTimeOptions.innerHTML = res.html;
            }
        }
    });
}

function tooltipInit(section) {
    const tipNode = section.querySelector('.tip');
    const content = tipNode?.dataset?.content || '';

    tippy(tipNode, {
        content: content,
        allowHTML: true,
        placement: 'top-end',
        theme: 'base',
        maxWidth: 268,
        offset: [-2, 2],
        arrow: false,
        animation: 'shift-toward',
    });
}

function tooltipUpdate(tipContainer, text, section) {
    if (tipContainer) {
        tipContainer.dataset.content = text;
        tooltipInit(section);
    }
}

function fillAddressPartsInputs(section, el) {
    section.querySelector('[name="REGION"]').value = el.dataset.region;
    section.querySelector('[name="CITY"]').value = el.dataset.city || el.dataset.settlement;
    section.querySelector('[name="STREET"]').value = el.dataset.street;
    section.querySelector('[name="HOUSE"]').value = el.dataset.house;
    section.querySelector('[name="BLOCK"]').value = el.dataset.block;
}

function clearAddressPartsInputs(section) {
    section.querySelector('[name="REGION"]').value = ''
    section.querySelector('[name="CITY"]').value = '';
    section.querySelector('[name="STREET"]').value = '';
    section.querySelector('[name="HOUSE"]').value = '';
    section.querySelector('[name="BLOCK"]').value = '';
}

/**
 * @param {CustomSelect} pointsSelect
 */
function checkOutMapsInit(
    section,
    pointsSelect,
    scheme,
    inputMethods,
    autocompleteDropdown,
    autocompleteDropdownList,
    coordsInput,
    addressInput,
    addressSelectNode
) {
    loadYandexMap().then(() => {
        const { mapData } = cart;

        ymaps.ready(() => {
            const pickupPointsMap = new ymaps.Map(
                'pickupPointsMap',
                {
                    center: mapData.mapCenter.reverse(),
                    zoom: 9,
                    controls: ['zoomControl'],
                },
                {
                    searchControlProvider: 'yandex#search',
                }
            );

            const objectManager = new ymaps.ObjectManager({
                clusterize: false,
            });

            let points;
            if (
                typeof window.pickUPointsCart !== null &&
                window.pickUPointsCart !== undefined
            )
                points = window.pickUPointsCart;
            else {
                points = mapData.features;
            }

            objectManager.objects.options.set({
                iconLayout: 'default#image',
                iconImageHref: mapIcon,
                iconImageSize: [27, 36],
                iconImageOffset: [-13, -18],
                hasBalloon: false,
            });

            objectManager.add(points);

            objectManager.objects.events.add('click', markerOnClickEvent);

            pickupPointsMap.geoObjects.add(objectManager);
            pickupPointsMap.behaviors.disable('scrollZoom');

            const containerSize = [560, 330];

            const { center: boundedCenter } =
                ymaps.util.bounds.getCenterAndZoom(
                    objectManager.getBounds(),

                    containerSize,

                    pickupPointsMap.options.get('projection')
                );

            pickupPointsMap.setCenter(boundedCenter);

            if (window.matchMedia('(max-width: 1024px)').matches) {
                // pickupPointsMap.behaviors.disable('drag');
                // pickupPointsMap.behaviors.disable('multiTouch');
            }

            function markerOnClickEvent(event) {
                event.stopPropagation();
                event.get('domEvent').originalEvent.stopPropagation();

                const pointId = event.get('objectId');
                const geoObject = objectManager.objects.getById(pointId);
                const { id, name } = geoObject;

                pointsSelect.setSelected(name, id);

                const tipContainer = document.querySelector('#deliveryPickupPoint')?.querySelector('.tip');
                if (tipContainer)
                    tooltipUpdate(tipContainer, name, section);

                updatePickupIntervals(id);

                return false;
            }
        });

        ymaps.ready(() => {
            const map = new ymaps.Map(
                'checkoutZones',
                {
                    center: [30.315868, 59.939098],
                    zoom: 8,
                    controls: ['zoomControl'],
                },
                {
                    searchControlProvider: 'yandex#search',
                }
            );


            let mapZones = ymaps.geoQuery(scheme).addToMap(map);

            const savedAddressCoordinates = getCookie('addressCoordinates');

            if (savedAddressCoordinates && coordsInput) {
                coordsInput.value = savedAddressCoordinates;

                const coords = savedAddressCoordinates.split(',');
                showPlacemark(coords, map);
            }

            let addressSelect = null;
            if (addressSelectNode) {
                addressSelect = new CustomSelect(addressSelectNode, {
                    onSelect({ el }) {
                        const address = el.dataset.address;
                        const coords = el.dataset.coords;

                        coordsInput.value = coords;
                        addressInput.value = address;
                        fillAddressPartsInputs(section, el);

                        const coordsArr = coords.split(',');
                        showPlacemark(coordsArr, map);

                        const form =
                            document.querySelector('#cartCheckoutForm');
                        const sideBar = document.querySelector('#cartSidebar');

                        Cart.deliveryCalculate(form, sideBar);
                    },
                });
            }

            function highlightSelectedZone(coords) {
                const polygon = mapZones.searchContaining(coords).get(0);
                mapZones.setOptions('fillOpacity', 0.4);
                polygon.options.set('fillOpacity', 0.8);

                return polygon.properties.get('description');
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
                    let resultObj = {
                        city: city,
                        area: area,
                        secondArea: secondArea,
                        street: street,
                        house: house,
                    };

                    let result = [area, secondArea, city, street, house];
                    result = [...new Set(result.filter(Boolean))];

                    document.dispatchEvent(
                        new CustomEvent('address-selected-checkout', {
                            detail: {
                                result,
                                resultObj,
                                zoneName,
                            },
                        })
                    );

                    return result.join(', ');

                    /** or just uncomment next line */
                    // vm.selectedAddress = firstGeoObject.getAddressLine();
                });
            }

            function getAddressByGeoObject(geoObject, zoneName) {
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

                let result = [area, secondArea, city, street, house];
                let resultObj = {
                    area: area,
                    secondArea: secondArea,
                    city: city,
                    street: street,
                    house: house,
                };

                result = [...new Set(result.filter(Boolean))];

                document.dispatchEvent(
                    new CustomEvent('address-selected-checkout', {
                        detail: {
                            result,
                            resultObj,
                            zoneName,
                        },
                    })
                );
                return result.join(', ');
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
                    getAddressByCoords(
                        placemark.geometry.getCoordinates(),
                        selectedZone
                    );
                });

                placemark = newPlacemark;
            }

            function createPlacemark(coords) {
                return new ymaps.Placemark(coords, {}, mapIconParams);
            }

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
                if (coordsInput) coordsInput.value = coords;
                const selectedZone = highlightSelectedZone(coords);
                showPlacemark(coords, map);
                getAddressByCoords(coords, selectedZone);
            });

            document.addEventListener('address-selected-checkout', e => {
                if (addressSelect) {
                    addressSelect.selected.textContent =
                        addressSelect.inititalPlaceholder;
                }

                const currentSelectedAddress = e.detail.result;
                const selectedAddressObj = e.detail.resultObj;
                const zoneName = e.detail.zoneName;
                const zoneNameInput = document.querySelector('#zoneName');
                const addressString = currentSelectedAddress.join(', ');
                zoneNameInput.value = zoneName;
                addressInput.value = '';
                clearAddressPartsInputs(section);

                if (!selectedAddressObj.house) {
                    new AlertMessages().add({
                        title: 'Укажите номер дома',
                        status: '',
                        type: 'error',
                    });
                }
                if (!selectedAddressObj.street) {
                    setTimeout(() => {
                        inputMethods.showInputError(
                            addressInput,
                            'Необходимо уточнить улицу'
                        );
                    });
                } else {
                    const form = document.querySelector('#cartCheckoutForm');
                    const sideBar = document.querySelector('#cartSidebar');

                    addressInput.value = addressString;
                    addressInput.dispatchEvent(new Event('blur'));

                    const preparedObj = {
                        dataset : {
                            region: selectedAddressObj.area,
                            city: selectedAddressObj.city,
                            street: selectedAddressObj.street,
                            house: selectedAddressObj.house,
                            block: '',
                        }
                    }
                    fillAddressPartsInputs(section, preparedObj);

                    Cart.deliveryCalculate(form, sideBar);
                    inputMethods.hideInputErrors([addressInput]);
                }
            });

            const onInput = debounce(
                function () {
                    const currentValue = this.value.trim();
                    inputMethods.hideSingleInputError(addressInput);
                    if (
                        !currentValue ||
                        currentValue === '' ||
                        currentValue.length < 3
                    )
                        return;

                    slideDown(autocompleteDropdown, { toggleClass: 'active' });
                    document.addEventListener('click', closeAutocompleteDropdown);

                    getData(`/address-search.php?query=${currentValue}`).then(
                        data => {
                            if (data === null || data === undefined) {
                                inputMethods.showInputError(
                                    addressInput,
                                    'Улица не найдена'
                                );
                            } else {
                                autocompleteDropdownList.innerHTML = data.html;
                            }
                        }
                    );
                },
                500,
                false
            );
            addressInput.addEventListener('input', onInput);

            function closeAutocompleteDropdown(event) {
                const targetItem = event.target.closest(
                  '.autocomplete-dropdown__item'
                );
                if (!targetItem) {
                    addressInput.value = '';
                    clearAddressPartsInputs(section);
                    slideUp(autocompleteDropdown, {
                        toggleClass: 'active',
                    });
                } else {
                    slideUp(autocompleteDropdown, {
                        toggleClass: 'active',
                    }).promise.then(() => {
                        autocompleteDropdownList.innerHTML = '';
                        addressInput.value = targetItem.textContent;
                        fillAddressPartsInputs(section, targetItem);
                    });
                    ymaps
                      .geocode(targetItem.textContent, {
                          results: 1,
                      })
                      .then(data => {
                          const firstGeoObject = data.geoObjects.get(0);
                          const coords =
                            firstGeoObject.geometry.getCoordinates();
                          const zoneName = highlightSelectedZone(coords);
                          showPlacemark(coords, map);

                          getAddressByGeoObject(firstGeoObject, zoneName);
                      });
                }
                document.removeEventListener('click', closeAutocompleteDropdown);
            }
        });
    });
}
