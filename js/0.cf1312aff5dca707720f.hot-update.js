webpackHotUpdate(0,{

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var cheerio = __webpack_require__(30);

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

	                var numReviews = this._getNumberOfGoodreadsReviews($("#bookMeta").find(".value-title").first().text());
	                var stars = this._getGoodreadsReviewAverage(reviewData);

	                review.numReviews = numReviews != -1 ? numReviews : review.numReviews;
	                review.stars = stars != -1 ? stars : review.stars;
	                review.hasTitle = title != "";
	                review.title = review.hasTitle ? title : review.title != "Retrieving starlet..." ? review.title : "Title unknown";

	                return review;
	            }
	        },
	        _getNumberOfGoodreadsReviews: {
	            value: function _getNumberOfGoodreadsReviews(data) {
	                var matches = /([,\d]+) ratings/gi.exec(data);
	                return !matches || matches.length < 1 ? -1 : matches[1];
	            }
	        },
	        _getGoodreadsReviewAverage: {
	            value: function _getGoodreadsReviewAverage(data) {
	                var matches = /([.\d]+) of [.\d]+ stars/gi.exec(data);
	                return !matches || matches.length < 1 ? -1 : matches[1];
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

	                var numReviews = this._getNumberOfAmazonReviews(reviewData);
	                var stars = this._getAmazonReviewAverage(reviewData);

	                review.numReviews = numReviews != -1 ? numReviews : review.numReviews;
	                review.stars = stars != -1 ? stars : review.stars;
	                review.hasTitle = title != "";
	                review.title = review.hasTitle ? title : review.title != "Retrieving starlet..." ? "Title unknown" : "Error retrieving starlet";

	                return review;
	            }
	        },
	        _getNumberOfAmazonReviews: {
	            value: function _getNumberOfAmazonReviews(data) {
	                var matches = /([,\d]+) customer review/gi.exec(data);
	                return !matches || matches.length < 1 ? -1 : matches[1];
	            }
	        },
	        _getAmazonReviewAverage: {
	            value: function _getAmazonReviewAverage(data) {
	                var matches = /([.\d]+) out of [.\d]+ stars/gi.exec(data);
	                return !matches || matches.length < 1 ? -1 : matches[1];
	            }
	        }
	    });

	    return InterpreterUtil;
	})();

	module.exports = new InterpreterUtil();

/***/ },

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var uuid = __webpack_require__(19);

	var Review = function Review(url, type) {
	    _classCallCheck(this, Review);

	    this.id = uuid.v1();
	    this.title = "Retrieving starlet...";
	    this.hasBeenFound = false;
	    this.hasTitle;
	    this.url = url;
	    this.type = type;
	    this.stars = 0;
	    this.numReviews = 0;
	    this.hasNew = false;
	    this.lastUpdate = new Date();
	    this.lastStatus = { stars: 0, numReviews: 0 };
	    this.loading = true;
	    this.error = false;
	    this.edit = false;
	    this.isDeleted = false;
	};

	module.exports = Review;

/***/ },

/***/ 63:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nvar _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } };\n\nvar cheerio = require(\"cheerio\");\n\nvar InterpreterUtil = (function () {\n    function InterpreterUtil() {\n        _classCallCheck(this, InterpreterUtil);\n    }\n\n    _createClass(InterpreterUtil, {\n        interpretGoodreads: {\n            value: function interpretGoodreads(body, review) {\n                var $ = cheerio.load(body);\n\n                var reviewData = $(\"#bookMeta\").text();\n                var title = $(\"#bookMeta\").find(\".fn\").first().text();\n\n                var numReviews = this._getNumberOfGoodreadsReviews($(\"#bookMeta\").find(\".value-title\").first().text());\n                var stars = this._getGoodreadsReviewAverage(reviewData);\n\n                review.numReviews = numReviews != -1 ? numReviews : review.numReviews;\n                review.stars = stars != -1 ? stars : review.stars;\n                review.hasTitle = title != \"\";\n                review.title = review.hasTitle ? title : review.title != \"Retrieving starlet...\" ? review.title : \"Title unknown\";\n\n                return review;\n            }\n        },\n        _getNumberOfGoodreadsReviews: {\n            value: function _getNumberOfGoodreadsReviews(data) {\n                var matches = /([,\\d]+) ratings/gi.exec(data);\n                return !matches || matches.length < 1 ? -1 : matches[1];\n            }\n        },\n        _getGoodreadsReviewAverage: {\n            value: function _getGoodreadsReviewAverage(data) {\n                var matches = /([.\\d]+) of [.\\d]+ stars/gi.exec(data);\n                return !matches || matches.length < 1 ? -1 : matches[1];\n            }\n        },\n        interpretAmazon: {\n            value: function interpretAmazon(body, review) {\n                var $ = cheerio.load(body);\n                var reviewData;\n\n                var rootNode = $(\"span:contains(\\\"See all reviews\\\")\");\n                rootNode.each(function (i, el) {\n                    if ($(this).text() == \"See all reviews\") {\n                        reviewData = $(this).parents(\".crAvgStars\").first().text();\n                        return false;\n                    }\n                });\n\n                var title = $(\"#btAsinTitle\").text();\n                title = title == \"\" ? $(\"#productTitle\").text() : title;\n\n                var numReviews = this._getNumberOfAmazonReviews(reviewData);\n                var stars = this._getAmazonReviewAverage(reviewData);\n\n                review.numReviews = numReviews != -1 ? numReviews : review.numReviews;\n                review.stars = stars != -1 ? stars : review.stars;\n                review.hasTitle = title != \"\";\n                review.title = review.hasTitle ? title : review.title != \"Retrieving starlet...\" ? \"Title unknown\" : \"Error retrieving starlet\";\n\n                return review;\n            }\n        },\n        _getNumberOfAmazonReviews: {\n            value: function _getNumberOfAmazonReviews(data) {\n                var matches = /([,\\d]+) customer review/gi.exec(data);\n                return !matches || matches.length < 1 ? -1 : matches[1];\n            }\n        },\n        _getAmazonReviewAverage: {\n            value: function _getAmazonReviewAverage(data) {\n                var matches = /([.\\d]+) out of [.\\d]+ stars/gi.exec(data);\n                return !matches || matches.length < 1 ? -1 : matches[1];\n            }\n        }\n    });\n\n    return InterpreterUtil;\n})();\n\nmodule.exports = new InterpreterUtil();"

/***/ },

/***/ 73:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } };\n\nvar uuid = require(\"node-uuid\");\n\nvar Review = function Review(url, type) {\n    _classCallCheck(this, Review);\n\n    this.id = uuid.v1();\n    this.title = \"Retrieving starlet...\";\n    this.hasBeenFound = false;\n    this.hasTitle;\n    this.url = url;\n    this.type = type;\n    this.stars = 0;\n    this.numReviews = 0;\n    this.hasNew = false;\n    this.lastUpdate = new Date();\n    this.lastStatus = { stars: 0, numReviews: 0 };\n    this.loading = true;\n    this.error = false;\n    this.edit = false;\n    this.isDeleted = false;\n};\n\nmodule.exports = Review;"

/***/ }

})