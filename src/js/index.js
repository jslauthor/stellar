require("../../scss/screen.scss")

var React = require('react');
var Main = require("./views/Main.jsx");
var gui = require('nw.gui');
var alt = require('./alt')
var LocalStorageUtil = require('./utils/LocalStorageUtil')
var reviewAction = require('./actions/ReviewAction')
var configAction = require('./actions/ConfigAction')
var _ = require('lodash')
var OSXUtil = require('./utils/OSXUtil')

var win = gui.Window.get();

win.on("loaded",
    () => {


        // Remove Cookies for robot testing
        //win.cookies.getAll({}, function(cookies) {
        //    _.each(cookies, function(cookie)
        //    {
        //        console.log("removing cookie " + cookie.name)
        //        var lurl = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
        //            cookie.path;
        //        win.cookies.remove({
        //            url: lurl,
        //            name: cookie.name
        //        })
        //    })
        //})

        var altStore = LocalStorageUtil.restore()
        if (altStore != "")
            alt.bootstrap(altStore)

        var iconPath;
        if (alt.stores.ReviewStore.getState().hasValidationRequirment)
            iconPath = 'img/tray_icon_error@2x.png'
        else if (alt.stores.ReviewStore.getState().hasNewReviews)
            iconPath = 'img/tray_icon_alert@2x.png'
        else
            iconPath = 'img/tray_icon@2x.png'

        // Fix for copy/paste on mac
        var nativeMenuBar = new gui.Menu({ type: "menubar" });
        try {
            nativeMenuBar.createMacBuiltin("Stellar");
            win.menu = nativeMenuBar;
        } catch (ex) {
            console.log(ex.message);
        }

        var tray = new gui.Tray({
            title: '',
            tooltip: 'stellar',
            icon: iconPath,
            iconsAreTemplates: false
        });

        tray.on('click', function(evt) {
            win.moveTo((evt.x - (win.width/2)) + 8, evt.y)
            //win.showDevTools()
            win.show()
            win.focus()
        });

        function checkForNewVersion() {
            configAction.checkForNewVersion()
        }
        checkForNewVersion()

        function update() {
            if (alt.stores.ReviewStore.getState().isMonitoring)
                reviewAction.updateAll()
        }

        setInterval(update, 1000)
        update();

        reviewAction.checkRunOnLogin()

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
    gui.App.quit();
})


