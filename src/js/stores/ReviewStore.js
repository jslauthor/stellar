var alt = require('../alt')
var ReviewAction = require('../actions/ReviewAction')

class ReviewStore {
    constructor() {
        this.bindActions(ReviewAction)
        this.reviews = {}
        this.loading = false
        this.showReviewPopup = false;
        this.isEditing = false;
    }

    onToggleEditing() {
        this.isEditing = !this.isEditing;
    }

    onShowAddReviewPopup() {
        this.showReviewPopup = true;
    }

    onHideAddReviewPopup() {
        this.showReviewPopup = false;
    }

    onAllComplete() {
        this.loading = false
    }

    onRequestReview(review) {
        this.loading = true;
    }

    onDeleteReview(reviews) {
        this.reviews = reviews
    }

    onAddReview(review) {
        this.reviews[review.id] = review;
    }

    onReviewComplete(review) {
        this.reviews[review.id] = review;
    }

}

module.exports = alt.createStore(ReviewStore, 'ReviewStore')