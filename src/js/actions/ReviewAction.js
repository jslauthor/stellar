var alt = require("../alt")
var cheerio = require('cheerio');
var request = require('browser-request');
var uuid = require('node-uuid');
var ConfigStore = require('../stores/ConfigStore');
var InterpreterUtil = require('../utils/InterpreterUtil')

class ReviewAction {

    addReview(url) {
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
            lastFive:[]
        }

        // Amazon only now

        var self = this;
        request(review.url, function(er, response, body) {
            var $ = cheerio.load(body)
            review.loading = false

            var reviewData;
            var pleaseWork = $('span:contains("See all reviews")');
            pleaseWork.each(function (i, el) {
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

        this.dispatch(review);
    }

    reviewComplete(review) {
        this.dispatch(review);
    }

    updateReview(review) {

    }

    deleteReview(review) {

    }

    updateAll() {

    }

}

module.exports = alt.createActions(ReviewAction)