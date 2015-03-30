var alt = require("../alt")
var request = require('browser-request')
var uuid = require('node-uuid')
var InterpreterUtil = require('../utils/InterpreterUtil')
var _ = require('lodash')
var Review = require('../vo/Review')

class ReviewAction {

    constructor() {
        this.generateActions(
            'showAddReviewPopup',
            'hideAddReviewPopup',
            'toggleEditing',
            'resetScrollToBottom'
        )
    }

    setTray(tray) {
        this.dispatch(tray)
    }

    toggleMonitoring() {
        if (!this.alt.stores.ReviewStore.getState().isMonitoring)
            this.actions.updateAll()

        this.dispatch();
    }

    addReview(url) {

        var type
        if (url.indexOf('amazon.com') != -1)
            type = this.alt.stores.ConfigStore.getAmazonType()
        else if (url.indexOf('goodreads.com') != -1)
            type = this.alt.stores.ConfigStore.getGoodreadsType()

        var review = new Review(url, type);

        this.actions.requestReview(review)
        this.dispatch(review)
    }

    requestReview(review) {

        if (review.isDeleted)
            return false;

        var self = this
        request(review.url, function(er, response, body) {

            review.loading = false

            if (review.isDeleted || _.isUndefined(body))
                return false;

            review.lastUpdate = new Date()
            review.lastStatus = {stars: review.stars, numReviews: review.numReviews}

            switch (review.type) {
                case self.alt.stores.ConfigStore.getGoodreadsType():
                    review = InterpreterUtil.interpretGoodreads(body, er, review)
                    break;
                case self.alt.stores.ConfigStore.getAmazonType():
                default:
                    review = InterpreterUtil.interpretAmazon(body, er, review)
            }

            if (!review.hasNew)
                review.hasNew = !review.error && (review.lastStatus.numReviews != review.numReviews) || (review.lastStatus.stars != review.stars)

            self.actions.reviewComplete(review)
        });

        this.dispatch(review)
    }

    allComplete() {
        this.dispatch();
    }

    reviewComplete(review) {
        this.dispatch(review)

        let reviews = this.alt.stores.ReviewStore.getState().reviews;
        let hasLoading = false;

        _.each(reviews, function(review) {
            if (review.loading)
                hasLoading = true

            if (hasLoading)
                return false
        })

        if (!hasLoading)
            this.actions.allComplete()
    }

    updateReview(review) {
        var elapsedTime = new Date().getTime() - ((review.lastUpdate && Date.parse(review.lastUpdate)) || 0)
        if (!review.loading || elapsedTime >= 60000)
        {
            review.loading = true
            review.error = false
            this.actions.requestReview(review)
            this.dispatch()
        }
    }

    deleteReview(id) {
        let reviews = this.alt.stores.ReviewStore.getState().reviews;

        if (reviews[id]) {
            reviews[id].isDeleted = true
            delete reviews[id]
        }

        this.dispatch(reviews)
    }

    updateAll() {
        let self = this
        let reviews = this.alt.stores.ReviewStore.getState().reviews;

        _.each(reviews, function(review) {
            self.actions.updateReview(review)
        })

        this.dispatch()
    }

    markAsSeen(reviewID) {
        this.dispatch(reviewID)
    }

}

module.exports = alt.createActions(ReviewAction)