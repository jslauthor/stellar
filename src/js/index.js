var React = require('react');
var Main = require("./views/Main.jsx");
var gui = window.require('nw.gui');
var alt = require('./alt')
var LocalStorageUtil = require('./utils/LocalStorageUtil')
var reviewAction = require('./actions/ReviewAction')
var _ = require('lodash')

var tray;
var win = gui.Window.get();

win.on("loaded",
    () => {

        var altStore = LocalStorageUtil.restore()
        if (altStore != "")
            alt.bootstrap(altStore)

        setInterval(function() {
            if (alt.stores.ReviewStore.getState().isMonitoring)
                reviewAction.updateAll();
        }, 60000)

        // Bootstrap this biatch
        React.render(<Main tray={tray} style={{width: "100%", height: "100%", position:"relative"}} />, document.getElementById('mainApp'));
    }
);

win.on("blur", function() {
    win.hide();
})

win.on("close", function() {
    this.hide();
    LocalStorageUtil.saveAll();
    this.close(true);
})

// Fix for copy/paste on mac
var nativeMenuBar = new gui.Menu({ type: "menubar" });
try {
    nativeMenuBar.createMacBuiltin("Stellar");
    win.menu = nativeMenuBar;
} catch (ex) {
    console.log(ex.message);
}

tray = new gui.Tray({
    title: '',
    tooltip: 'stellar',
    icon: 'img/tray_icon@2x.png',
    iconsAreTemplates: false
});

tray.on('click', function(evt) {
    win.moveTo((evt.x - (win.width/2)) + 8, evt.y);
    win.show();
    win.showDevTools();
    win.focus();
});