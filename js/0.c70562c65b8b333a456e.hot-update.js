webpackHotUpdate(0,{

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nvar _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } };\n\nvar gui = require(\"nw.gui\");\nvar alt = require(\"../alt\");\nvar isWin = /^win/.test(process.platform);\n\nvar OSUtil = (function () {\n    function OSUtil() {\n        _classCallCheck(this, OSUtil);\n    }\n\n    _createClass(OSUtil, {\n        isWindows: {\n            value: function isWindows() {\n                return isWin;\n            }\n        },\n        getIconPath: {\n            value: function getIconPath() {\n                var iconPath;\n                var directory = this.isWindows() ? \"\" : \"\";\n\n                if (alt.stores.ReviewStore.getState().hasValidationRequirment) iconPath = \"img/\" + directory + \"tray_icon_error@2x.png\";else if (alt.stores.ReviewStore.getState().hasNewReviews) iconPath = \"img/\" + directory + \"tray_icon_alert@2x.png\";else iconPath = \"img/\" + directory + \"tray_icon@2x.png\";\n\n                return iconPath;\n            }\n        }\n    });\n\n    return OSUtil;\n})();\n\nmodule.exports = new OSUtil();"

/***/ },

/***/ 417:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var gui = __webpack_require__(1);
	var alt = __webpack_require__(2);
	var isWin = /^win/.test(process.platform);

	var OSUtil = (function () {
	    function OSUtil() {
	        _classCallCheck(this, OSUtil);
	    }

	    _createClass(OSUtil, {
	        isWindows: {
	            value: function isWindows() {
	                return isWin;
	            }
	        },
	        getIconPath: {
	            value: function getIconPath() {
	                var iconPath;
	                var directory = this.isWindows() ? "" : "";

	                if (alt.stores.ReviewStore.getState().hasValidationRequirment) iconPath = "img/" + directory + "tray_icon_error@2x.png";else if (alt.stores.ReviewStore.getState().hasNewReviews) iconPath = "img/" + directory + "tray_icon_alert@2x.png";else iconPath = "img/" + directory + "tray_icon@2x.png";

	                return iconPath;
	            }
	        }
	    });

	    return OSUtil;
	})();

	module.exports = new OSUtil();

/***/ }

})