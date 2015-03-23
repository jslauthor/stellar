var alt = require('../alt')
var ReviewAction = require('../actions/ReviewAction')

class ReviewStore {
    constructor() {
        this.bindActions(ReviewAction)
        this.reviews = {}
    }

    onAddReview(review) {
        this.reviews[review.id] = review;
    }

    onReviewComplete(review) {
        this.reviews[review.id] = review;
    }

}

module.exports = alt.createStore(ReviewStore, 'ReviewStore')