
var color = require('hex-rgb-converter');
var alt = require('../alt');
var React = require('react')

var GREEN = "1ac57f";
var RED = "e62040";

var AMAZON = "amazon";
var GOODREADS = "goodreads";

class ConfigStore {
    constructor() {
    }

    static getAmazonType() { return AMAZON; }
    static getGoodreadsType() { return GOODREADS; }

    static getIconForType(type) {
        switch (type)
        {
            case AMAZON:
                return <div>A</div>;
            case GOODREADS:
                return <div>G</div>;
            default:
                return <div></div>;
        }
    }

    static getGreen() { return GREEN; }
    static getRed() { return RED; }

    static getRGBForToggle(toggled) {
        if (toggled)
            return color.toRGB(GREEN);
        else
            return color.toRGB(RED);
    }
}

module.exports = alt.createStore(ConfigStore, 'ConfigStore');