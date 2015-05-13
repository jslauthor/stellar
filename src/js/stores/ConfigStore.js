"use strict"

var ConfigActions = require('../actions/ConfigAction')
var gui = require('nw.gui')

var color = require('hex-rgb-converter');
var alt = require('../alt');
var React = require('react')

var DARK_GREEN = "d2dbc6";
var GREEN = "1ac57f";
var RED = "e62040";

var AMAZON = "amazon";
var GOODREADS = "goodreads";

var mins = 10
var DELAY = (mins * 60) * 1000 // milliseconds

var refresh = 720 // 12 hours
var REFRESH_DELAY = (refresh * 60) * 1000

var announcementRefreshMins = 60 // 1 hour
var ANNOUNCEMENT_REFRESH_DELAY = (announcementRefreshMins * 60) * 1000

class ConfigStore {
    constructor() {
        this.bindActions(ConfigActions)
    }

    onNewVersionAvailable() {
        var win = gui.Window.open('/newVersion.html', {
            position: 'center',
            width: 400,
            height: 200,
            "always-on-top": true,
            "visible-on-all-workspaces": true,
            "transparent": false,
            "resizable": false,
            "toolbar": false,
            "frame": true
        })
    }

    static getAmazonType() { return AMAZON; }
    static getGoodreadsType() { return GOODREADS; }

    static getIconForType(type) {
        switch (type)
        {
            case AMAZON:
                return <svg viewBox="0 0 15 15" width="20" height="20">
                    <g>
                        <path fill="#ffba00" d="M7.1,8.3c0.4,0,0.8-0.2,1-0.6c0.3-0.5,0.3-1,0.3-1.5l0-0.3c-1,0-2.1,0.2-2.1,1.4C6.2,7.9,6.5,8.3,7.1,8.3z" />
                        <path fill="#ffba00" d="M13.7,0H1.3C0.6,0,0,0.6,0,1.3v12.5C0,14.4,0.6,15,1.3,15h12.5c0.7,0,1.3-0.6,1.3-1.3V1.3
		C15,0.6,14.4,0,13.7,0z M8.3,4.5c0-0.3,0-0.7-0.2-1C8,3.3,7.6,3.2,7.3,3.2c-0.5,0-1,0.3-1.1,0.9c0,0.1-0.1,0.3-0.2,0.3L4.6,4.1
		C4.5,4.1,4.4,4,4.4,3.9c0.3-1.7,1.8-2.2,3.1-2.2c0.7,0,1.6,0.2,2.1,0.7c0.7,0.6,0.6,1.5,0.6,2.4l0,2.2c0,0.7,0.3,0.9,0.5,1.3
		c0.1,0.1,0.1,0.3,0,0.4C10.5,8.9,10,9.4,9.8,9.6c-0.1,0.1-0.2,0.1-0.3,0C8.9,9.2,8.9,9.1,8.6,8.7c-0.8,0.8-1.3,1-2.3,1
		C5.1,9.7,4.2,9,4.2,7.5c0-1.2,0.6-1.9,1.5-2.3c0.8-0.3,1.8-0.4,2.7-0.5L8.3,4.5z M11.9,10.9c-1.1,1-2.8,1.5-4.2,1.5
		c-2,0-3.8-0.9-5.2-2.3c-0.1-0.1,0-0.3,0.1-0.2c1.5,1,3.3,1.6,5.2,1.6c1.3,0,2.7-0.3,4-1C11.9,10.5,12.1,10.7,11.9,10.9z M12.2,11.9
		c-0.1,0.1-0.2,0-0.1-0.1c0.1-0.4,0.5-1.3,0.3-1.5c-0.1-0.2-1-0.1-1.3,0c-0.1,0-0.1-0.1,0-0.2c0.7-0.5,1.7-0.4,1.9-0.2
		S12.8,11.3,12.2,11.9z"/>
                    </g>
                </svg>;
            case GOODREADS:
                return <svg viewBox="0 0 15 15" width="20" height="20">
                    <g>
                        <path fill="#beb59c" d="M7.3,2.6c-2.1,0-2.8,1.7-2.8,3.2c0,1.9,1,3.2,2.7,3.2c2,0,2.8-1.6,2.8-3.2c0-1-0.3-1.9-0.9-2.5
		C8.6,2.9,8,2.6,7.3,2.6z"/>
                        <path fill="#beb59c" d="M13.7,0H1.3C0.6,0,0,0.6,0,1.3v12.5C0,14.4,0.6,15,1.3,15h12.5c0.7,0,1.3-0.6,1.3-1.3V1.3
		C15,0.6,14.4,0,13.7,0z M10.8,9.7c0,2.1-1.2,3.3-3.4,3.3c-1.9,0-3.1-1-3.2-2.7v-0.2H5v0.2c0,1.7,1.5,2,2.4,2c1.8,0,2.7-0.8,2.7-2.6
		V8.4C9.4,9.3,8.3,9.8,7.2,9.8c-2.4,0-3.4-2-3.4-3.9c0-2.4,1.4-4,3.5-4c1.1,0,2.1,0.6,2.7,1.4V2.1h0.8V9.7z"/>
                    </g>
                </svg>;
            default:
                return <div></div>;
        }
    }

    static getDarkGreen() { return DARK_GREEN; }
    static getGreen() { return GREEN; }
    static getRed() { return RED; }

    static getRGBForToggle(toggled) {
        if (toggled)
            return color.toRGB(GREEN)
        else
            return color.toRGB(RED)
    }

    static getPollingLength() { return DELAY }
    static getRefreshLength() { return REFRESH_DELAY }
    static getAnnouncementRefreshLength() { return ANNOUNCEMENT_REFRESH_DELAY }

}

module.exports = alt.createStore(ConfigStore, 'ConfigStore');