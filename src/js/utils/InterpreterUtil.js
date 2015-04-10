"use strict"

var cheerio = require('cheerio')

class InterpreterUtil {

    interpretGoodreads(body, review) {
        var $ = cheerio.load(body)

        review.requiresValidation = false

        var reviewData = $('#bookMeta').text()
        var title = $('#bookMeta').find(".fn").first().text()

        var numReviews = this._getNumberOfGoodreadsReviews($('#bookMeta').find('.value-title').first().text())
        var stars = this._getGoodreadsReviewAverage(reviewData)

        review.hasTitle = title != ""

        if (!review.hasBeenFound && review.hasTitle)
            review.hasBeenFound = true

        review.numReviews = numReviews != -1 ? numReviews : review.numReviews
        review.stars = stars != -1 ? stars : review.stars
        review.title = review.hasTitle ? title : (review.hasBeenFound ? review.title : "Error finding starlet")

        return review
    }

    _getNumberOfGoodreadsReviews(data) {
        var matches = /([,\d]+) ratings/gi.exec(data)
        return !matches || matches.length < 1 ? -1 : matches[1]
    }

    _getGoodreadsReviewAverage(data) {
        var matches = /([.\d]+) of [.\d]+ stars/gi.exec(data)
        return !matches || matches.length < 1 ? -1 : matches[1]
    }

    interpretAmazon(body, review) {
        var $ = cheerio.load(body)
        var reviewData

        review.requiresValidation = this._hasAmazonRobotWarning(body)

        var rootNode = $('span:contains("See all reviews")');
        rootNode.each(function (i, el) {
            if ($(this).text() == "See all reviews") {
                reviewData = $(this).parents(".crAvgStars").first().text()
                return false;
            }
        })

        var title = $("#btAsinTitle").text()
        title = title == "" ? $("#productTitle").text() : title

        var numReviews = this._getNumberOfAmazonReviews(reviewData)
        var stars = this._getAmazonReviewAverage(reviewData)

        review.hasTitle = title != ""

        if (!review.hasBeenFound && review.hasTitle)
            review.hasBeenFound = true

        review.numReviews = numReviews != -1 ? numReviews : review.numReviews
        review.stars = stars != -1 ? stars : review.stars
        review.title = review.hasTitle ? title : (review.hasBeenFound ? review.title : "Error finding starlet")

        return review
    }

    _getNumberOfAmazonReviews(data) {
        var matches = /([,\d]+) customer review/gi.exec(data);
        return !matches || matches.length < 1 ? -1 : matches[1];
    }

    _getAmazonReviewAverage(data) {
        var matches = /([.\d]+) out of [.\d]+ stars/gi.exec(data);
        return !matches || matches.length < 1 ? -1 : matches[1];
    }

    _hasAmazonRobotWarning(data) {
        var matches = /Sorry, we just need to make sure you're not a robot./gi.exec(data);
        return !matches || matches.length < 1 ? false : true;
    }

}

module.exports = new InterpreterUtil();