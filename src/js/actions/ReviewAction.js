var alt = require("../alt")
var cheerio = require('cheerio')
var request = require('browser-request')
var uuid = require('node-uuid')
var InterpreterUtil = require('../utils/InterpreterUtil')
var _ = require('lodash')

class ReviewAction {

    constructor() {
        this.generateActions('showAddReviewPopup', 'hideAddReviewPopup', 'toggleEditing', 'hasNewReview')
    }

    toggleMonitoring() {
        if (!this.alt.stores.ReviewStore.getState().isMonitoring)
            this.actions.updateAll()

        this.dispatch();
    }

    addReview(url) {
        var review = {
            id: uuid.v1(),
            title: "Retrieving starlet...",
            url: url,
            type: this.alt.stores.ConfigStore.getAmazonType(),
            stars: 0,
            numReviews: 0,
            hasNew: false,
            lastUpdate: new Date(),
            lastStatus: {stars: 0, numReviews: 0},
            loading: true,
            error: false,
            edit: false
        }

        // Amazon only now

        this.actions.requestReview(review)
        this.dispatch(review)
    }

    requestReview(review) {
        var self = this;
        request(review.url, function(er, response, body) {
            var $ = cheerio.load(body)

            review.lastUpdate = new Date()
            review.lastStatus = {stars: review.stars, numReviews: review.numReviews}
            review.loading = false

            var reviewData
            var rootNode = $('span:contains("See all reviews")');
            try {
                rootNode.each(function (i, el) {
                    if ($(this).text() == "See all reviews") {
                        reviewData = $(this).parents(".crAvgStars").first().text()
                        return false;
                    }
                })
            } catch(error) {}

            var title = $("#btAsinTitle").text()
            title = title == "" ? $("#productTitle").text() : title

            review.numReviews = InterpreterUtil.getNumberOfReviews(reviewData)
            review.stars = InterpreterUtil.getReviewAverage(reviewData)
            review.title = title != "" ? title : "Title unknown"

            review.error = title == "" || er != null

            if (!review.hasNew)
                review.hasNew = (review.lastStatus.numStars != review.numStars) || (review.lastStatus.stars != review.stars)

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
        let hasNew = false;
        _.each(reviews, function(review) {
            if (review.loading)
                hasLoading = true

            if (review.hasNew)
                hasNew = true

            if (hasNew && hasLoading)
                return false
        })

        if (hasNew)
            this.actions.hasNewReview();

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

        if (reviews[id])
            delete reviews[id]

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