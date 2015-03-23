class InterpreterUtil {

    getNumberOfReviews(page) {
        console.log(page);
        var matches = /(\d+).*/gi.exec(page);
        return !matches || matches.length < 1 ? 0 : matches[1];
    }

}

module.exports = new InterpreterUtil();