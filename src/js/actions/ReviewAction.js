var alt = require("../alt")
var cheerio = require('cheerio')
var request = require('browser-request')
var uuid = require('node-uuid')
var ConfigStore = require('../stores/ConfigStore')
var InterpreterUtil = require('../utils/InterpreterUtil')
var _ = require('lodash')

class ReviewAction {

    constructor() {
        this.generateActions('showAddReviewPopup', 'hideAddReviewPopup', 'toggleEditing')
    }

    addReview(url) {
        console.log(url);

        var review = {
            id: uuid.v1(),
            title: "Retrieving starlet...",
            url: url,
            type: ConfigStore.getAmazonType(),
            stars: 0,
            numReviews: 0,
            new: true,
            lastUpdate: new Date(),
            lastReview: {},
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
            review.loading = false

            var reviewData;
            var rootNode = $('span:contains("See all reviews")');
            rootNode.each(function (i, el) {
                if ($(this).text() == "See all reviews") {
                    reviewData = $(this).parents(".crAvgStars").first().text()
                    return false;
                }
            })

            var title = $("#btAsinTitle").text()
            title = title == "" ? $("#productTitle").text() : title

            review.numReviews = InterpreterUtil.getNumberOfReviews(reviewData)
            review.stars = InterpreterUtil.getReviewAverage(reviewData)
            review.title = title != "" ? title : "Title unknown"
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
            {
                hasLoading = true
                return false
            }
        })

        if (!hasLoading)
            this.actions.allComplete()
    }

    updateReview(review) {
        if (!review.loading)
        {
            review.loading = true
            this.actions.requestReview(review)
            this.dispatch()
        }
    }

    deleteReview(id) {
        console.log(id)
        let reviews = this.alt.stores.ReviewStore.getState().reviews;

        if (reviews[id])
            delete reviews[id]

        console.log(reviews[id])

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

}

module.exports = alt.createActions(ReviewAction)