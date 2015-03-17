var React = require('react');
var App = require("./views/App");
var gui = window.require('nw.gui');
var tray;

var win = gui.Window.get();
win.on("loaded",
    function()
    {
        console.log("**** LOADED");
        // Bootstrap this biatch
        React.render(<App />, document.getElementById('App'));
    }
);


tray = new gui.Tray({
    title: '',
    tooltip: 'stellar',
    icon: 'img/tray_icon.png',
    iconsAreTemplates: false
});

tray.on('click', function(evt) {
    win.moveTo(evt.x - (win.width/2), evt.y);
    win.show();
});



