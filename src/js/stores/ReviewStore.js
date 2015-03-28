var alt = require('../alt')
var ReviewAction = require('../actions/ReviewAction')
var LocalStorageUtil = require('../utils/LocalStorageUtil')
var _ = require('lodash')

class ReviewStore {
    constructor() {
        this.bindActions(ReviewAction)
        this.reviews = {}
        this.loading = false
        this.showReviewPopup = false
        this.isEditing = false
        this.isMonitoring = true

        this.on('serialize', () => {
            var state = this.alt.stores.ReviewStore.getState();
            state.isEditing = false;
            state.loading = false;
            state.showReviewPopup = false;
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
        LocalStorageUtil.saveAll()
    }

    onReviewComplete(review) {
        this.reviews[review.id] = review;
        LocalStorageUtil.saveAll()
    }

    onMarkAsSeen(reviewID) {
        var review = this.reviews[reviewID]
        if (!_.isUndefined(review))
            review.hasNew = false;
    }

}

module.exports = alt.createStore(ReviewStore, 'ReviewStore')