"use strict"

var cheerio = require('cheerio')

class InterpreterUtil {

    interpretGoodreads(review) {

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

        review.numReviews = this.getNumberOfReviews(reviewData)
        review.stars = this.getReviewAverage(reviewData)
        review.title = title != "" ? title : "Title unknown"

        review.error = title == "" || er != null

        if (!review.hasNew)
            review.hasNew = !review.error && (review.lastStatus.numReviews != review.numReviews) || (review.lastStatus.stars != review.stars)

        return review
    }

    getNumberOfReviews(data) {
        var matches = /([,\d]+) customer review/gi.exec(data);
        return !matches || matches.length < 1 ? 0 : matches[1];
    }

    getReviewAverage(data) {
        var matches = /([.\d]+) out of [.\d]+ stars/gi.exec(data);
        return !matches || matches.length < 1 ? 0 : matches[1];
    }

    getTitle(data) {
        var matches = /([.\d]+) out of [.\d]+ stars/gi.exec(data);
        return !matches || matches.length < 1 ? 0 : matches[1];
    }

}

module.exports = new InterpreterUtil();