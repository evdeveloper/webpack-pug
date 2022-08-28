const devNav = require('./common/navigation').devNav;
const mainNav = require('./common/navigation').mainNav;
const footerNav = require('./common/navigation').footerNav;

const savedAddresses = require('./common/addresses');
const pickupAddresses = require('./common/pickupAddresses');
const testimonials = require('./common/testimonials');

module.exports = {
    devNav,
    mainNav,
    footerNav,
    savedAddresses,
    pickupAddresses,
    testimonials,
};
