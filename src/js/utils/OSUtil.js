"use strict"

var gui = require('nw.gui')
var alt = require('../alt')
var isWin = /^win/.test(process.platform);

class OSUtil {

    isWindows() {
        return isWin
    }

    getIconPath() {
        var iconPath;
        var directory = this.isWindows() ? '' : ''

        if (alt.stores.ReviewStore.getState().hasValidationRequirment)
            iconPath = 'img/'+directory+'tray_icon_error@2x.png'
        else if (alt.stores.ReviewStore.getState().hasNewReviews)
            iconPath = 'img/'+directory+'tray_icon_alert@2x.png'
        else
            iconPath = 'img/'+directory+'tray_icon@2x.png'

        return iconPath
    }

}

export default new OSUtil()