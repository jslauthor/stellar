var alt = require('../alt')
var ReviewAction = require('../actions/ReviewAction')
var LocalStorageUtil = require('../utils/LocalStorageUtil')
var _ = require('lodash')
var moment = require('moment')

class ReviewStore {

    constructor() {
        this.bindActions(ReviewAction)
        this.reviews = {}
        this.loading = false
        this.showReviewPopup = false
        this.isEditing = false
        this.isMonitoring = true
        this.lastUpdate = ""
        this.shouldScrollToBottom = true;
        this.hasNewReviews = false

        this.on('serialize', () => {
            var state = _.cloneDeep(this.alt.stores.ReviewStore.getState());
            state.isEditing = false;
            state.loading = false;
            state.showReviewPopup = false;

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