"use strict"

class InterpreterUtil {

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