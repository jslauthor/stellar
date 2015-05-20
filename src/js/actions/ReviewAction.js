var alt = require("../alt")
var request = require('browser-request')
var uuid = require('node-uuid')
var InterpreterUtil = require('../utils/InterpreterUtil')
var _ = require('lodash')
var Review = require('../vo/Review')
var NotificationUtil = require('../utils/NotificationUtil')
var OSXUtil = require('../utils/OSXUtil')
var mixpanel = require('../mixpanel')
var keys = require('../keys')

class ReviewAction {

    constructor() {
        this.generateActions(
            'showAddReviewPopup',
            'hideAddReviewPopup',
            'toggleEditing',
            'toggleNotifications',
            'resetScrollToBottom'
        )
    }

    toggleRunOnLogin() {

        OSXUtil.checkIfRunOnLoginEnabled(function(arg, enabled) {

            function enableResult(enabled) {
                this.actions.updateRunOnLogin(enabled == null)
            }

            function disableResult(enabled) {
                this.actions.updateRunOnLogin(!(enabled == null))
            }

            if (!enabled)
                OSXUtil.enableRunOnLogin(enableResult.bind(this))
            else
                OSXUtil.disableRunOnLogin(disableResult.bind(this))

        }.bind(this))

        this.dispatch()
    }

    checkRunOnLogin() {

        OSXUtil.checkIfRunOnLoginEnabled(function(arg, enabled) {
            this.actions.updateRunOnLogin(enabled)
        }.bind(this))

        this.dispatch()
    }

    updateRunOnLogin(enabled) {
        this.dispatch(enabled)
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
        request({url: review.url, timeout: 10000}, function(er, response, body) {

            //console.log(er)
            //console.log(response)
            review.loading = false

            if (review.isDeleted || _.isUndefined(body))
                return false;

            review.lastUpdate = new Date()
            review.lastStatus = {stars: review.stars, numReviews: review.numReviews}

            if (er == null && response.statusCode == 200) {
                switch (review.type) {
                    case self.alt.stores.ConfigStore.getGoodreadsType():
                        review = InterpreterUtil.interpretGoodreads(body, review)
                        break;
                    case self.alt.stores.ConfigStore.getAmazonType():
                    default:
                        review = InterpreterUtil.interpretAmazon(body, review)
                }

                if (!review.hasNew) {
                    review.hasNew = review.hasTitle && !review.error && (review.lastStatus.numReviews != review.numReviews || review.lastStatus.stars != review.stars)

                    // create notification
                    if (review.hasNew && review.hasTitle)
                        NotificationUtil.createNotification(review.title + " now has " + review.numReviews + " reviews!")
                }
            }

            review.error = !_.isNull(er) || response.statusCode != 200 || !review.hasTitle
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

    updateReview(review, force) {

        force = _.isUndefined(force) ? false : force

        var elapsedTime = new Date().getTime() - ((review.lastUpdate && Date.parse(review.lastUpdate)) || 0)
        if (elapsedTime >= this.alt.stores.ConfigStore.getPollingLength() || force)
        {
            review.loading = true
            review.error = false
            this.actions.requestReview(review)
        }
        this.dispatch()
    }

    deleteReview(id) {
        let reviews = this.alt.stores.ReviewStore.getState().reviews;

        if (reviews[id]) {
            var url = reviews[id].url
            var type = reviews[id].type

            this.actions.markAsSeen(id)
            reviews[id].isDeleted = true
            delete reviews[id]

            mixpanel.track(keys.REVIEW_DELETED, {
                url: url,
                type: type,
                numReviews: _.size(reviews)
            })
        }

        this.dispatch(reviews)
    }

    updateAll(force) {

        force = _.isUndefined(force) ? false : force

        let self = this
        let reviews = this.alt.stores.ReviewStore.getState().reviews;

        _.each(reviews, function(review) {
            self.actions.updateReview(review, force)
        })

        this.dispatch()
    }

    markAsSeen(reviewID) {
        this.dispatch(reviewID)
    }

    markAllAsSeen() {
        let self = this
        let reviews = this.alt.stores.ReviewStore.getState().reviews;

        _.each(reviews, function(review) {
            self.actions.markAsSeen(review.id)
        })

        this.dispatch()
    }

}

module.exports = alt.createActions(ReviewAction)