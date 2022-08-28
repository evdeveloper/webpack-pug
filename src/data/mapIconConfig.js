const mapIcon = require('@/assets/images/map-icon.svg');

const mapIconParams = {
    draggable: true,
    iconLayout: 'default#image',
    iconImageHref: mapIcon,
    iconImageSize: [27, 36],
    iconImageOffset: [-13, -36],
    hasBalloon: false,
};

module.exports = {
    mapIcon,
    mapIconParams,
};
