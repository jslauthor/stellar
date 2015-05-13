"use strict"

var alt = require('../alt')
var AnnouncementActions = require('../actions/AnnouncementActions')
var LocalStorageUtil = require('../utils/LocalStorageUtil')
var mixpanel = require('../mixpanel')
var keys = require('../keys')

class AnnouncementStore {

    constructor() {
        this.bindActions(AnnouncementActions)

        this.message
        this.link
        this.isDismissed
        this.lastRefresh
    }

    onUpdateAnnouncementComplete(announcement) {
        this.message = announcement.message
        this.link = announcement.link
        this.isDismissed = false
        this.lastRefresh = new Date()
        LocalStorageUtil.saveAll()
    }

    onDismiss() {
        this.isDismissed = true
        LocalStorageUtil.saveAll()
        mixpanel.track(keys.DISMISSED_ANNOUNCEMENT, {length: new Date().getTime() - ((this.lastRefresh && Date.parse(this.lastRefresh)) || 0)})
    }

}

module.exports = alt.createStore(AnnouncementStore, 'AnnouncementStore');