var alt = require('../alt')
var ReviewAction = require('../actions/ReviewAction')
var LocalStorageUtil = require('../utils/LocalStorageUtil')
var _ = require('lodash')
var moment = require('moment')
var AutoLaunch = require('auto-launch')

class ReviewStore {

    constructor() {
        this.bindActions(ReviewAction)
        this.reviews = {}
        this.loading = false
        this.showReviewPopup = false
        this.isEditing = false
        this.isMonitoring = true
        this.lastUpdate = ""
        this.shouldScrollToBottom = true
        this.hasNewReviews = false
        this.notificationsEnabled = true
        this.runOnLogin = false

        this.nwAppLauncher = new AutoLaunch({
            name: 'stellarApp',
            isHidden: false
        });

        this.on('serialize', () => {
            var state = _.cloneDeep(this.alt.stores.ReviewStore.getState());
            state.isEditing = false
            state.loading = false
            state.showReviewPopup = false
            delete state.nwAppLauncher

            _.each(state.reviews, function(review){
                review.loading = false;
            })
            return state;
        });
    }

    onToggleMonitoring() {
        this.isMonitoring = !this.isMonitoring
        LocalStorageUtil.saveAll()
    }

    onToggleEditing() {
        this.isEditing = !this.isEditing
    }

    onToggleNotifications() {
        this.notificationsEnabled = !this.notificationsEnabled
        LocalStorageUtil.saveAll()
    }

    onCheckRunOnLogin(error) {
        console.log(error)
        this.nwAppLauncher.isEnabled(function(enabled) {
            this.runOnLogin = enabled
        }.bind(this))
    }

    onToggleRunOnLogin() {
        console.log(this.runOnLogin)
        this.runOnLogin = !this.runOnLogin
        if (this.runOnLogin)
            this.nwAppLauncher.enable(this.onCheckRunOnLogin.bind(this))
        else
            this.nwAppLauncher.disable(this.onCheckRunOnLogin.bind(this))
    }

    onShowAddReviewPopup() {
        this.showReviewPopup = true
    }

    onHideAddReviewPopup() {
        this.showReviewPopup = false
    }

    onAllComplete() {
        this.lastUpdate = "Updated " + moment().format("ddd, h:mmA")
        this.loading = false
    }

    onRequestReview(review) {
        this.loading = true
    }

    onDeleteReview(reviews) {
        this.reviews = reviews
        LocalStorageUtil.saveAll()
    }

    onAddReview(review) {
        this.isEditing = false;
        this.reviews[review.id] = review;
        this.shouldScrollToBottom = true;
        LocalStorageUtil.saveAll()
    }

    onReviewComplete(review) {
        this.reviews[review.id] = review;
        LocalStorageUtil.saveAll()
        this._updateHasNew();
    }

    onMarkAsSeen(reviewID) {
        var review = this.reviews[reviewID]
        if (!_.isUndefined(review))
            review.hasNew = false;

        this._updateHasNew();
        LocalStorageUtil.saveAll()
    }

    onResetScrollToBottom() {
        this.shouldScrollToBottom = false;
    }

    _updateHasNew() {
        this.hasNewReviews = false;
        let self = this
        _.each(this.reviews, function(review) {
            if (review.hasNew) {
                self.hasNewReviews = true
                return false
            }
        })
    }

}

module.exports = alt.createStore(ReviewStore, 'ReviewStore')