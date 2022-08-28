import deliveryZones from '@/data/deliveryZones';
import { loadYandexMap } from '@/js/common/ajax';
import { deviceType } from '@/js/common/plugins';

const scheme = deliveryZones.commonZones;

(function () {
    const deliveryMap = document.querySelector('.delivery-map');
    if (!deliveryMap) return;

    loadYandexMap('&coordorder=longlat').then(() => {
        ymaps.ready(() => {
            const map = new ymaps.Map(
                'map',
                {
                    center: [30.513537, 59.908492],
                    zoom: 9,
                    controls: ['zoomControl'],
                },
                {
                    searchControlProvider: 'yandex#search',
                }
            );

            const deliveryZones = ymaps
                .geoQuery(JSON.stringify(scheme))
                .addToMap(map);

            deliveryZones.each(function (obj) {
                obj.options.set({
                    fillColor: obj.properties.get('fill'),
                    fillOpacity: obj.properties.get('fill-opacity'),
                    strokeColor: obj.properties.get('stroke'),
                    strokeWidth: obj.properties.get('stroke-width'),
                    strokeOpacity: obj.properties.get('stroke-opacity'),
                });
                obj.properties.set(
                    'balloonContent',
                    obj.properties.get('description')
                );
            });

            if (deviceType.isMobile || deviceType.isTablet) {
                map.behaviors.disable('drag');
            }
        });
    });

    // const polygon = new ymaps.GeoObject(
    //     {
    //         geometry: data.geometry,
    //     },
    //     data.properties
    // );

    // map.geoObjects.add(polygon);
})();
