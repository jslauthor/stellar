"use strict"

var alt = require('../alt')
var AnnouncementActions = require('../actions/AnnouncementActions')
var LocalStorageUtil = require('../utils/LocalStorageUtil')

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
    }

}

module.exports = alt.createStore(AnnouncementStore, 'AnnouncementStore');