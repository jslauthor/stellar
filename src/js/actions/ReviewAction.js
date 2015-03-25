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
            title: "Modern Rituals: The Wayward Three",
            url: url,
            type: ConfigStore.getAmazonType(),
            stars: 0,
            numReviews: 0,
            new: false,
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
                    console.log($(this).parents(".crAvgStars").first().html())
                }
            })


            //var items = $('.productImageGrid').next().text()
            //console.log(items);
            //var titleData = $('.productImageGrid').next().text()
            //var reviewData = $('.productImageGrid').next().next().text()
            //console.log(url);
            //console.log(reviewData);
            review.numReviews = InterpreterUtil.getNumberOfReviews(reviewData)
            review.stars = InterpreterUtil.getReviewAverage(reviewData)
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