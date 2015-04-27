var alt = require("../alt")
var pkginfo = require('../../../package.json')
var request = require('browser-request')
var OSUtil = require('../utils/OSUtil')

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
            else if (!OSUtil.isWindows() && firstRun)
                var win = gui.Window.open('/firstRunMac.html', {
                    position: 'center',
                    width: 400,
                    height: 200,
                    "always-on-top": true,
                    "visible-on-all-workspaces": true,
                    "transparent": false,
                    "resizable": false,
                    "toolbar": false,
                    "frame": true
                })
        }

        this.dispatch()
    }

    newVersionAvailable() {
        this.dispatch()
    }

}

module.exports = alt.createActions(ConfigAction)