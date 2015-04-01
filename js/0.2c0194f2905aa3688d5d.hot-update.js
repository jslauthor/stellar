webpackHotUpdate(0,{

/***/ 9:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var NotificationUtil = (function () {
	    function NotificationUtil() {
	        _classCallCheck(this, NotificationUtil);
	    }
	
	    _createClass(NotificationUtil, null, {
	        createNotification: {
	            value: function createNotification(message) {
	
	                var path = __webpack_require__(12);
	                var gui = __webpack_require__(368);
	                var alt = __webpack_require__(1);
	
	                if (!alt.stores.ReviewStore.getState().notificationsEnabled) {
	                    return;
	                }var options = {
	                    //icon: path.join(path.dirname(process.execPath), '/img/tray_icon_alert@2x.png'),
	                    body: message
	                };
	
	                var notification = new Notification("New Review!", options);
	
	                notification.onclick = function () {
	                    gui.Window.get().show();
	                    gui.Window.get().focus();
	                };
	
	                notification.onshow = function () {
	                    setTimeout(function () {
	                        notification.close();
	                    }, 20000);
	                };
	            }
	        }
	    });
	
	    return NotificationUtil;
	})();
	
	module.exports = NotificationUtil;

/***/ }

})
//# sourceMappingURL=0.2c0194f2905aa3688d5d.hot-update.js.map