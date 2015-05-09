"use strict"

var alt = require("../alt")
var request = require('browser-request')

class AnnouncementActions {

    constructor() {
        this.generateActions("dismiss")
    }

    updateAnnouncement() {

        var storeState = this.alt.stores.AnnouncementStore.getState()
        var elapsedTime = new Date().getTime() - ((storeState.lastRefresh && Date.parse(storeState.lastRefresh)) || 0)

        if (elapsedTime >= this.alt.stores.ConfigStore.getRefreshLength()) {

            request('http://www.jslauthor.com/notification/random', (err, response, body) => {
                if (!err && response.statusCode == 200)
                    this.actions.updateAnnouncementComplete(JSON.parse(response.response))
            })

        }

        this.dispatch()
    }

    updateAnnouncementComplete(announcement) {
        this.dispatch({message: announcement.message, link: announcement.link})
    }
}

module.exports = alt.createActions(AnnouncementActions);