import deliveryZones from '@/data/deliveryZones';
import { loadYandexMap } from '@/js/common/ajax';
import { deviceType } from '@/js/common/plugins';
import { mapIconParams } from '@/data/mapIconConfig';

const pushkinPolygon = deliveryZones.pushkinZone;
const petergofPolygon = deliveryZones.petergofZone;

(function () {
    const section = document.querySelector('.location-contacts');
    if (!section) return;
    const mapWrapper = section.querySelector('.location-contacts__map');
    const mapType = mapWrapper.dataset.map;

    const settings = mapType === 'pickup' ? '': '&coordorder=longlat';
    loadYandexMap(settings).then(() => {
        mapInit(mapType);
    });
})();

function mapInit(type) {
    ymaps.ready(() => {
        let map;

        switch (type) {
            case 'delivery-pushkin':
                map = deliveryMapInit(pushkinPolygon);
                break;
            case 'delivery-petergof':
                map = deliveryMapInit(petergofPolygon);
                break;
            case 'pickup':
                map = pickupMapInit();
                break;
            default:
                console.warn('no map initialized');
        }

        if (deviceType.isMobile || deviceType.isTablet) {
            map.behaviors.disable('drag');
            // pickupPointsMap.behaviors.disable('multiTouch');
        }
    });
}

function deliveryMapInit(data) {
    const scheme = data.features[0];
    const map = new ymaps.Map(
        'map',
        {
            center: data.center,
            zoom: 11,
            controls: ['zoomControl'],
        },
        {
            searchControlProvider: 'yandex#search',
        }
    );

    const polygon = new ymaps.GeoObject(
        {
            geometry: scheme.geometry,
        },
        scheme.properties
    );

    console.log(scheme)

    map.geoObjects.add(polygon);

    return map;
}

function pickupMapInit() {
    const map = new ymaps.Map(
        'map',
        {
            center: [30.312449, 59.938395],
            zoom: 10,
            controls: ['zoomControl'],
        },
        {
            searchControlProvider: 'yandex#search',
        }
    );

    let placemarks = window.pickUpInnerPoints.features;

    const objectManager = new ymaps.ObjectManager({
        clusterize: true,
        hasHint: true,
    });
    objectManager.objects.options.set(mapIconParams);
    objectManager.add(placemarks);
    map.geoObjects.add(objectManager);
    return map;
}
