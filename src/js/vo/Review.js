"use strict"

var uuid = require('node-uuid')

class Review {
    constructor(url, type) {
        this.id = uuid.v1()
        this.title = "Retrieving starlet..."
        this.hasTitle
        this.url = url
        this.type = type
        this.stars = 0
        this.numReviews = 0
        this.hasNew = false
        this.lastUpdate = new Date()
        this.lastStatus = {stars: 0, numReviews: 0}
        this.loading = true
        this.error = false
        this.edit = false
        this.isDeleted = false
    }
}

module.exports = Review