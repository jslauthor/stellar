webpackHotUpdate(0,{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(4);
	var Main = __webpack_require__(5);
	var gui = __webpack_require__(368);
	var alt = __webpack_require__(1);
	var LocalStorageUtil = __webpack_require__(2);
	var reviewAction = __webpack_require__(3);
	var _ = __webpack_require__(6);
	
	var tray;
	var win = gui.Window.get();
	
	win.on("loaded", function () {
	
	    var altStore = LocalStorageUtil.restore();
	    if (altStore != "") alt.bootstrap(altStore);
	
	    setInterval(function () {
	        if (alt.stores.ReviewStore.getState().isMonitoring) reviewAction.updateAll();
	    }, 60000);
	
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
	
	// Fix for copy/paste on mac
	var nativeMenuBar = new gui.Menu({ type: "menubar" });
	try {
	    nativeMenuBar.createMacBuiltin("Stellar");
	    win.menu = nativeMenuBar;
	} catch (ex) {
	    console.log(ex.message);
	}
	
	tray = new gui.Tray({
	    title: "",
	    tooltip: "stellar",
	    icon: "img/tray_icon@2x.png",
	    iconsAreTemplates: false
	});
	
	tray.on("click", function (evt) {
	    win.moveTo(evt.x - win.width / 2 + 8, evt.y);
	    win.show();
	    win.showDevTools();
	    win.focus();
	});

/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("nw.gui");

/***/ }

})
//# sourceMappingURL=0.5c56067ffd98ee49be2f.hot-update.js.map