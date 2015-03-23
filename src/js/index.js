var React = require('react');
var Main = require("./views/Main.jsx");
var gui = window.require('nw.gui');
var mockService = require('./services/MockService')

var tray;

var win = gui.Window.get();
win.on("loaded",
    () => {
        console.log("**** LOADED");
        mockService.init(); // load some fake data
        // Bootstrap this biatch
        React.render(<Main style={{width: "100%", height: "100%", position:"relative"}} />, document.getElementById('mainApp'));
    }
);

tray = new gui.Tray({
    title: '',
    tooltip: 'stellar',
    icon: 'img/tray_icon.png',
    iconsAreTemplates: false
});

tray.on('click', function(evt) {
    win.moveTo((evt.x - (win.width/2)) + 6, evt.y);
    win.show();
    win.showDevTools();
    win.focus();
});



