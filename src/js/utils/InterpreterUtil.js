"use strict"

var cheerio = require('cheerio')

class InterpreterUtil {

    interpretGoodreads(body, review) {
        var $ = cheerio.load(body)

        var reviewData = $('#bookMeta').text()
        var title = $('#bookMeta').find(".fn").first().text()

        review.numReviews = this._getNumberOfGoodreadsReviews($('#bookMeta').find('.value-title').first().text())
        review.stars = this._getGoodreadsReviewAverage(reviewData)
        review.hasTitle = title != ""
        review.title = title != "" ? title : "Title unknown"

        return review
    }

    _getNumberOfGoodreadsReviews(data) {
        var matches = /([,\d]+) ratings/gi.exec(data)
        return !matches || matches.length < 1 ? 0 : matches[1]
    }

    _getGoodreadsReviewAverage(data) {
        var matches = /([.\d]+) of [.\d]+ stars/gi.exec(data)
        return !matches || matches.length < 1 ? 0 : matches[1]
    }

    interpretAmazon(body, review) {
        var $ = cheerio.load(body)
        var reviewData

        var rootNode = $('span:contains("See all reviews")');
        rootNode.each(function (i, el) {
            if ($(this).text() == "See all reviews") {
                reviewData = $(this).parents(".crAvgStars").first().text()
                return false;
            }
        })

        var title = $("#btAsinTitle").text()
        title = title == "" ? $("#productTitle").text() : title

        review.numReviews = this._getNumberOfAmazonReviews(reviewData)
        review.stars = this._getAmazonReviewAverage(reviewData)
        review.hasTitle = title != ""
        review.title = title != "" ? title : "Title unknown"

        return review
    }

    _getNumberOfAmazonReviews(data) {
        var matches = /([,\d]+) customer review/gi.exec(data);
        return !matches || matches.length < 1 ? 0 : matches[1];
    }

    _getAmazonReviewAverage(data) {
        var matches = /([.\d]+) out of [.\d]+ stars/gi.exec(data);
        return !matches || matches.length < 1 ? 0 : matches[1];
    }

}

module.exports = new InterpreterUtil();