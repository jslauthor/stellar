webpackHotUpdate(0,{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(8);

	var React = __webpack_require__(10);
	var Main = __webpack_require__(11);
	var gui = __webpack_require__(1);
	var alt = __webpack_require__(2);
	var LocalStorageUtil = __webpack_require__(3);
	var reviewAction = __webpack_require__(4);
	var _ = __webpack_require__(12);
	var OSXUtil = __webpack_require__(5);

	var win = gui.Window.get();

	win.on("loaded", function () {

	    var altStore = LocalStorageUtil.restore();
	    if (altStore != "") alt.bootstrap(altStore);

	    var iconPath;
	    if (alt.stores.ReviewStore.getState().hasNewReviews) iconPath = "img/tray_icon_alert@2x.png";else iconPath = "img/tray_icon@2x.png";

	    // Fix for copy/paste on mac
	    var nativeMenuBar = new gui.Menu({ type: "menubar" });
	    try {
	        nativeMenuBar.createMacBuiltin("Stellar");
	        win.menu = nativeMenuBar;
	    } catch (ex) {
	        console.log(ex.message);
	    }

	    var tray = new gui.Tray({
	        title: "",
	        tooltip: "stellar",
	        icon: iconPath,
	        iconsAreTemplates: false
	    });

	    tray.on("click", function (evt) {
	        win.moveTo(evt.x - win.width / 2 + 8, evt.y);
	        //win.showDevTools()
	        win.show();
	        win.focus();
	    });

	    function update() {
	        if (alt.stores.ReviewStore.getState().isMonitoring) reviewAction.updateAll();
	    }

	    setInterval(update, 300000);
	    update();

	    reviewAction.checkRunOnLogin();

	    // Bootstrap this biatch
	    React.render(React.createElement(Main, { tray: tray, style: { width: "100%", height: "100%", position: "relative" } }), document.getElementById("mainApp"));
	});

	win.on("blur", function () {
	    win.hide();
	});

	win.on("close", function () {
	    this.hide();
	    LocalStorageUtil.saveAll();
	    this.close(true);
	});

/***/ },

/***/ 61:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nrequire(\"../../scss/screen.scss\");\n\nvar React = require(\"react\");\nvar Main = require(\"./views/Main.jsx\");\nvar gui = require(\"nw.gui\");\nvar alt = require(\"./alt\");\nvar LocalStorageUtil = require(\"./utils/LocalStorageUtil\");\nvar reviewAction = require(\"./actions/ReviewAction\");\nvar _ = require(\"lodash\");\nvar OSXUtil = require(\"./utils/OSXUtil\");\n\nvar win = gui.Window.get();\n\nwin.on(\"loaded\", function () {\n\n    var altStore = LocalStorageUtil.restore();\n    if (altStore != \"\") alt.bootstrap(altStore);\n\n    var iconPath;\n    if (alt.stores.ReviewStore.getState().hasNewReviews) iconPath = \"img/tray_icon_alert@2x.png\";else iconPath = \"img/tray_icon@2x.png\";\n\n    // Fix for copy/paste on mac\n    var nativeMenuBar = new gui.Menu({ type: \"menubar\" });\n    try {\n        nativeMenuBar.createMacBuiltin(\"Stellar\");\n        win.menu = nativeMenuBar;\n    } catch (ex) {\n        console.log(ex.message);\n    }\n\n    var tray = new gui.Tray({\n        title: \"\",\n        tooltip: \"stellar\",\n        icon: iconPath,\n        iconsAreTemplates: false\n    });\n\n    tray.on(\"click\", function (evt) {\n        win.moveTo(evt.x - win.width / 2 + 8, evt.y);\n        //win.showDevTools()\n        win.show();\n        win.focus();\n    });\n\n    function update() {\n        if (alt.stores.ReviewStore.getState().isMonitoring) reviewAction.updateAll();\n    }\n\n    setInterval(update, 300000);\n    update();\n\n    reviewAction.checkRunOnLogin();\n\n    // Bootstrap this biatch\n    React.render(React.createElement(Main, { tray: tray, style: { width: \"100%\", height: \"100%\", position: \"relative\" } }), document.getElementById(\"mainApp\"));\n});\n\nwin.on(\"blur\", function () {\n    win.hide();\n});\n\nwin.on(\"close\", function () {\n    this.hide();\n    LocalStorageUtil.saveAll();\n    this.close(true);\n});"

/***/ }

})