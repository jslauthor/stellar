webpackHotUpdate(0,{

/***/ 11:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var cheerio = __webpack_require__(32);
	
	var InterpreterUtil = (function () {
	    function InterpreterUtil() {
	        _classCallCheck(this, InterpreterUtil);
	    }
	
	    _createClass(InterpreterUtil, {
	        interpretGoodreads: {
	            value: function interpretGoodreads(body, review) {
	                var $ = cheerio.load(body);
	
	                var reviewData = $("#bookMeta").text();
	                var title = $("#bookMeta").find(".fn").first().text();
	
	                review.numReviews = this._getNumberOfGoodreadsReviews($("#bookMeta").find(".value-title").first().text());
	                review.stars = this._getGoodreadsReviewAverage(reviewData);
	                review.hasTitle = title != "";
	                review.title = title != "" ? title : "Title unknown";
	
	                return review;
	            }
	        },
	        _getNumberOfGoodreadsReviews: {
	            value: function _getNumberOfGoodreadsReviews(data) {
	                var matches = /([,\d]+) ratings/gi.exec(data);
	                return !matches || matches.length < 1 ? 0 : matches[1];
	            }
	        },
	        _getGoodreadsReviewAverage: {
	            value: function _getGoodreadsReviewAverage(data) {
	                var matches = /([.\d]+) of [.\d]+ stars/gi.exec(data);
	                return !matches || matches.length < 1 ? 0 : matches[1];
	            }
	        },
	        interpretAmazon: {
	            value: function interpretAmazon(body, review) {
	                var $ = cheerio.load(body);
	                var reviewData;
	
	                var rootNode = $("span:contains(\"See all reviews\")");
	                rootNode.each(function (i, el) {
	                    if ($(this).text() == "See all reviews") {
	                        reviewData = $(this).parents(".crAvgStars").first().text();
	                        return false;
	                    }
	                });
	
	                var title = $("#btAsinTitle").text();
	                title = title == "" ? $("#productTitle").text() : title;
	
	                review.numReviews = this._getNumberOfAmazonReviews(reviewData);
	                review.stars = this._getAmazonReviewAverage(reviewData);
	                review.hasTitle = title != "";
	                review.title = title != "" ? title : "Title unknown";
	
	                return review;
	            }
	        },
	        _getNumberOfAmazonReviews: {
	            value: function _getNumberOfAmazonReviews(data) {
	                var matches = /([,\d]+) customer review/gi.exec(data);
	                return !matches || matches.length < 1 ? 0 : matches[1];
	            }
	        },
	        _getAmazonReviewAverage: {
	            value: function _getAmazonReviewAverage(data) {
	                var matches = /([.\d]+) out of [.\d]+ stars/gi.exec(data);
	                return !matches || matches.length < 1 ? 0 : matches[1];
	            }
	        }
	    });
	
	    return InterpreterUtil;
	})();
	
	module.exports = new InterpreterUtil();

/***/ }

})
//# sourceMappingURL=0.5c8b6ffe6b43292504a7.hot-update.js.map