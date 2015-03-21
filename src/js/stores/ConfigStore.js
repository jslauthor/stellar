
var color = require('hex-rgb-converter');
var alt = require('../alt');

var GREEN = "1ac57f";
var RED = "e62040";

var configStore = alt.createStore(class ConfigStore {
    constructor() {

    }

    static getRGBForToggle(toggled) {
        if (toggled)
            return color.toRGB(GREEN);
        else
            return color.toRGB(RED);
    }
});

module.exports = configStore;