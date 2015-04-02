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
	
	var win = gui.Window.get();
	
	win.on("loaded", function () {
	
	    var altStore = LocalStorageUtil.restore();
	    if (altStore != "") alt.bootstrap(altStore);
	
	    var iconPath;
	    if (alt.stores.ReviewStore.getState().hasNewReviews) iconPath = "img/tray_icon_alert@2x.png";else iconPath = "img/tray_icon@2x.png";
	
	    var tray = new gui.Tray({
	        title: "",
	        tooltip: "stellar",
	        icon: iconPath,
	        iconsAreTemplates: false
	    });
	
	    tray.on("click", function (evt) {
	        win.moveTo(evt.x - win.width / 2 + 8, evt.y);
	        win.show();
	        win.showDevTools();
	        win.focus();
	    });
	
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

/***/ }
])
//# sourceMappingURL=0.f612ea34cdeb198f0a11.hot-update.js.map