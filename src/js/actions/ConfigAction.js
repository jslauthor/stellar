var alt = require("../alt")
var pkginfo = require('../../../package.json')
var request = require('browser-request')

class ConfigAction {

    checkForNewVersion() {

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
        }

        this.dispatch()
    }

    newVersionAvailable() {
        this.dispatch()
    }

}

module.exports = alt.createActions(ConfigAction)