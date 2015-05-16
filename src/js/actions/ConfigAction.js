var alt = require("../alt")
var pkginfo = require('../../../package.json')
var request = require('browser-request')
var OSUtil = require('../utils/OSUtil')
var gui = require('nw.gui')

class ConfigAction {

    checkForNewVersion(firstRun) {

        request.get(pkginfo.manifestUrl, gotManifest.bind(this)); //get manifest from url

        function gotManifest(err, req, data) {
            if (err || req.statusCode < 200 || req.statusCode > 299) {
                return
            }

            try {
                data = JSON.parse(data);
            } catch (e) {
                return
            }

            if (data.version != pkginfo.version)
                this.actions.newVersionAvailable()
            else if (!OSUtil.isWindows() && firstRun) {
                var win = gui.Window.open('./firstRun.html', {
                    position: 'center',
                    width: 500,
                    height: 500,
                    "always-on-top": true,
                    "visible-on-all-workspaces": true,
                    "transparent": false,
                    "resizable": false,
                    "toolbar": false,
                    "frame": true
                })

                win.on("loaded", () => {
                    win.focus()
                })

                win.on("blur", () => {
                    win.hide()
                })
            }
        }

        this.dispatch()
    }

    newVersionAvailable() {
        this.dispatch()
    }

}

module.exports = alt.createActions(ConfigAction)