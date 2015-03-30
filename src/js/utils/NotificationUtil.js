"use strict"

var path = require('path')
var gui = window.require('nw.gui');

class NotificationUtil {

    static createNotification(message) {
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
            setTimeout(function() {notification.close();}, 10000);
        }
    }

}

module.exports = NotificationUtil