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
            title: "Modern Rituals: The Wayward Three, #1 (A Science Fiction Thriller)",
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
            review.numReviews = InterpreterUtil.getNumberOfReviews($('.crAvgStars').first().children("a").text())
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