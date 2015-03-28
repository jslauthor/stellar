var React = require('react');
var Main = require("./views/Main.jsx");
var gui = window.require('nw.gui');
var alt = require('./alt')
var LocalStorageUtil = require('./utils/LocalStorageUtil')

var tray;

var win = gui.Window.get();
win.on("loaded",
    () => {
        console.log("**** LOADED");

        var altStore = LocalStorageUtil.restore()
        if (altStore != "")
            alt.bootstrap(altStore)

        // Bootstrap this biatch
        React.render(<Main style={{width: "100%", height: "100%", position:"relative"}} />, document.getElementById('mainApp'));
    }
);

win.on("blur", function() {
    win.hide();
})

win.on("close", function() {
    this.hide(); // Pretend to be closed already
    //save
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
    icon: 'img/tray_icon.png',
    iconsAreTemplates: false
});

function resetWindowPosition(x, y) {

}

tray.on('click', function(evt) {
    win.moveTo((evt.x - (win.width/2)) + 6, evt.y);
    win.show();
    win.showDevTools();
    win.focus();
});

gui.Screen.Init();
gui.Screen.on('displayBoundsChanged', function(screen) {
    console.log('screen changed');
})