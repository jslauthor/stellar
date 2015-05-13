var alt = require('../alt')
var ReviewAction = require('../actions/ReviewAction')
var LocalStorageUtil = require('../utils/LocalStorageUtil')
var _ = require('lodash')
var moment = require('moment')
var OSXUtil = require('../utils/OSXUtil')
var mixpanel = require('../mixpanel')
var keys = require('../keys')

class ReviewStore {

    constructor() {
        this.bindActions(ReviewAction)
        this.reviews = {}
        this.loading = false
        this.showReviewPopup = false
        this.isEditing = false
        this.isMonitoring = true
        this.lastUpdate = ""
        this.shouldScrollToBottom = false
        this.hasNewReviews = false
        this.hasValidationRequirment = false
        this.notificationsEnabled = true
        this.runOnLogin = false
        this.nextUpdateTime

        this.on('serialize', () => {
            var state = _.cloneDeep(this.alt.stores.ReviewStore.getState());
            state.isEditing = false
            state.loading = false
            state.showReviewPopup = false 
            delete state.runOnLogin

            _.each(state.reviews, function(review){
                review.loading = false;
            })
            return state;
        });
    }

    onToggleMonitoring() {
        this.isMonitoring = !this.isMonitoring
        LocalStorageUtil.saveAll()

        mixpanel.track(keys.TOGGLE_MONITORING, {
            isMonitoring: this.isMonitoring
        })
    }

    onToggleEditing() {
        if (this.reviews && this.reviews.length == 0)
            return

        this.isEditing = !this.isEditing
    }

    onToggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled
        LocalStorageUtil.saveAll()

        mixpanel.track(keys.TOGGLE_NOTIFICATIONS, {
            isNotifying: this.notificationsEnabled
        })
    }

    onUpdateRunOnLogin(enabled) {
        this.runOnLogin = enabled
    }

    onShowAddReviewPopup() {
        this.showReviewPopup = true
    }

    onHideAddReviewPopup() {
        this.showReviewPopup = false
    }

    onAllComplete() {
        this.lastUpdate = moment().format("ddd, h:mmA")
        this.loading = false
    }

    onRequestReview(review) {
        this.loading = true
    }

    onDeleteReview(reviews) {
        this.reviews = reviews
        if (this.reviews && this.reviews.length == 0)
            this.isEditing = false

        LocalStorageUtil.saveAll()
    }

    onAddReview(review) {
        this.isEditing = false;
        this.reviews[review.id] = review
        this.shouldScrollToBottom = true
        LocalStorageUtil.saveAll()
        mixpanel.track(keys.REVIEW_ADDED, {
            url: review.url,
            type: review.type,
            numReviews: _.size(this.reviews)
        })
    }

    onReviewComplete(review) {
        this.reviews[review.id] = review
        LocalStorageUtil.saveAll()
        this._updateReviewStatuses()
    }

    onMarkAsSeen(reviewID) {
        var review = this.reviews[reviewID]
        if (!_.isUndefined(review))
            review.hasNew = false

        this._updateReviewStatuses();
        LocalStorageUtil.saveAll()
    }

    onResetScrollToBottom() {
        this.shouldScrollToBottom = false
    }

    onUpdateReview() {
        var self = this
        var nextUpdate
        _.each(this.reviews, function(review) {
            var newTime = self.alt.stores.ConfigStore.getPollingLength() - (new Date().getTime() - ((review.lastUpdate && Date.parse(review.lastUpdate)) || 0))
            nextUpdate = nextUpdate < newTime ? nextUpdate : newTime
        })
        this.nextUpdateTime = nextUpdate
    }

    _updateReviewStatuses() {
        this.hasNewReviews = false
        this.hasValidationRequirment = false;
        let self = this
        _.each(this.reviews, function(review) {
            if (review.requiresValidation) {
                self.hasValidationRequirment = true
                return false
            }

            if (review.hasNew)
                self.hasNewReviews = true
        })
    }

}

module.exports = alt.createStore(ReviewStore, 'ReviewStore')