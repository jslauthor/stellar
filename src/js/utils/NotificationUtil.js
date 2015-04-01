"use strict"

class NotificationUtil {

    static createNotification(message) {

        var path = require('path')
        var gui = require('nw.gui');
        var alt = require("../alt")

        if (!alt.stores.ReviewStore.getState().notificationsEnabled)
            return

        var options = {
            //icon: path.join(path.dirname(process.execPath), '/img/tray_icon_alert@2x.png'),
            body: message
        };

        var notification = new Notification("New Review!", options);

        notification.onclick = function () {
            gui.Window.get().show()
            gui.Window.get().focus()
        }

        notification.onshow = function () {
            setTimeout(function() {notification.close();}, 20000);
        }
    }

}

module.exports = NotificationUtil