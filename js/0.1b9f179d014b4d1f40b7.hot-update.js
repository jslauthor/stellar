webpackHotUpdate(0,[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(5);
	
	var React = __webpack_require__(7);
	var Main = __webpack_require__(8);
	var gui = __webpack_require__(1);
	var alt = __webpack_require__(2);
	var LocalStorageUtil = __webpack_require__(3);
	var reviewAction = __webpack_require__(4);
	var _ = __webpack_require__(9);
	
	var tray;
	var win = gui.Window.get();
	
	win.on("loaded", function () {
	
	    var altStore = LocalStorageUtil.restore();
	    if (altStore != "") alt.bootstrap(altStore);
	
	    function update() {
	        if (alt.stores.ReviewStore.getState().isMonitoring) reviewAction.updateAll();
	    }
	
	    setInterval(update, 60000);
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

/***/ }
])
//# sourceMappingURL=0.1b9f179d014b4d1f40b7.hot-update.js.map