webpackHotUpdate(0,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var alt = __webpack_require__(2);
	var request = __webpack_require__(17);
	var uuid = __webpack_require__(19);
	var InterpreterUtil = __webpack_require__(13);
	var _ = __webpack_require__(12);
	var Review = __webpack_require__(14);
	var NotificationUtil = __webpack_require__(15);
	var OSXUtil = __webpack_require__(5);

	var ReviewAction = (function () {
	    function ReviewAction() {
	        _classCallCheck(this, ReviewAction);

	        this.generateActions("showAddReviewPopup", "hideAddReviewPopup", "toggleEditing", "toggleNotifications", "resetScrollToBottom");
	    }

	    _createClass(ReviewAction, {
	        toggleRunOnLogin: {
	            value: function toggleRunOnLogin() {

	                OSXUtil.checkIfRunOnLoginEnabled((function (arg, enabled) {

	                    function enableResult(enabled) {
	                        this.actions.updateRunOnLogin(enabled == null);
	                    }

	                    function disableResult(enabled) {
	                        this.actions.updateRunOnLogin(!(enabled == null));
	                    }

	                    if (!enabled) OSXUtil.enableRunOnLogin(enableResult.bind(this));else OSXUtil.disableRunOnLogin(disableResult.bind(this));
	                }).bind(this));

	                this.dispatch();
	            }
	        },
	        checkRunOnLogin: {
	            value: function checkRunOnLogin() {

	                OSXUtil.checkIfRunOnLoginEnabled((function (arg, enabled) {
	                    this.actions.updateRunOnLogin(enabled);
	                }).bind(this));

	                this.dispatch();
	            }
	        },
	        updateRunOnLogin: {
	            value: function updateRunOnLogin(enabled) {
	                this.dispatch(enabled);
	            }
	        },
	        toggleMonitoring: {
	            value: function toggleMonitoring() {
	                if (!this.alt.stores.ReviewStore.getState().isMonitoring) this.actions.updateAll();

	                this.dispatch();
	            }
	        },
	        addReview: {
	            value: function addReview(url) {

	                var type;
	                if (url.indexOf("amazon.com") != -1) type = this.alt.stores.ConfigStore.getAmazonType();else if (url.indexOf("goodreads.com") != -1) type = this.alt.stores.ConfigStore.getGoodreadsType();

	                var review = new Review(url, type);

	                this.actions.requestReview(review);
	                this.dispatch(review);
	            }
	        },
	        requestReview: {
	            value: function requestReview(review) {

	                if (review.isDeleted) {
	                    return false;
	                }var self = this;
	                request(review.url, function (er, response, body) {

	                    console.log(response);
	                    review.loading = false;

	                    if (review.isDeleted || _.isUndefined(body)) return false;

	                    review.lastUpdate = new Date();
	                    review.lastStatus = { stars: review.stars, numReviews: review.numReviews };

	                    if (er == null) {
	                        switch (review.type) {
	                            case self.alt.stores.ConfigStore.getGoodreadsType():
	                                review = InterpreterUtil.interpretGoodreads(body, review);
	                                break;
	                            case self.alt.stores.ConfigStore.getAmazonType():
	                            default:
	                                review = InterpreterUtil.interpretAmazon(body, review);
	                        }

	                        if (!review.hasNew) {
	                            review.hasNew = review.hasTitle && !review.error && (review.lastStatus.numReviews != review.numReviews || review.lastStatus.stars != review.stars);

	                            // create notification
	                            if (review.hasNew && review.hasTitle) NotificationUtil.createNotification(review.title + " now has " + review.numReviews + " reviews!");
	                        }
	                    }

	                    review.error = er != null || !review.hasTitle;

	                    self.actions.reviewComplete(review);
	                });

	                this.dispatch(review);
	            }
	        },
	        allComplete: {
	            value: function allComplete() {
	                this.dispatch();
	            }
	        },
	        reviewComplete: {
	            value: function reviewComplete(review) {
	                this.dispatch(review);

	                var reviews = this.alt.stores.ReviewStore.getState().reviews;
	                var hasLoading = false;

	                _.each(reviews, function (review) {
	                    if (review.loading) hasLoading = true;

	                    if (hasLoading) return false;
	                });

	                if (!hasLoading) this.actions.allComplete();
	            }
	        },
	        updateReview: {
	            value: function updateReview(review) {
	                var elapsedTime = new Date().getTime() - (review.lastUpdate && Date.parse(review.lastUpdate) || 0);
	                if (!review.loading || elapsedTime >= 60000) {
	                    review.loading = true;
	                    review.error = false;
	                    this.actions.requestReview(review);
	                    this.dispatch();
	                }
	            }
	        },
	        deleteReview: {
	            value: function deleteReview(id) {
	                var reviews = this.alt.stores.ReviewStore.getState().reviews;

	                if (reviews[id]) {
	                    this.actions.markAsSeen(id);
	                    reviews[id].isDeleted = true;
	                    delete reviews[id];
	                }

	                this.dispatch(reviews);
	            }
	        },
	        updateAll: {
	            value: function updateAll() {
	                var self = this;
	                var reviews = this.alt.stores.ReviewStore.getState().reviews;

	                _.each(reviews, function (review) {
	                    self.actions.updateReview(review);
	                });

	                this.dispatch();
	            }
	        },
	        markAsSeen: {
	            value: function markAsSeen(reviewID) {
	                this.dispatch(reviewID);
	            }
	        },
	        markAllAsSeen: {
	            value: function markAllAsSeen() {
	                var self = this;
	                var reviews = this.alt.stores.ReviewStore.getState().reviews;

	                _.each(reviews, function (review) {
	                    self.actions.markAsSeen(review.id);
	                });

	                this.dispatch();
	            }
	        }
	    });

	    return ReviewAction;
	})();

	module.exports = alt.createActions(ReviewAction);

/***/ },

/***/ 59:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nvar _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } };\n\nvar alt = require(\"../alt\");\nvar request = require(\"browser-request\");\nvar uuid = require(\"node-uuid\");\nvar InterpreterUtil = require(\"../utils/InterpreterUtil\");\nvar _ = require(\"lodash\");\nvar Review = require(\"../vo/Review\");\nvar NotificationUtil = require(\"../utils/NotificationUtil\");\nvar OSXUtil = require(\"../utils/OSXUtil\");\n\nvar ReviewAction = (function () {\n    function ReviewAction() {\n        _classCallCheck(this, ReviewAction);\n\n        this.generateActions(\"showAddReviewPopup\", \"hideAddReviewPopup\", \"toggleEditing\", \"toggleNotifications\", \"resetScrollToBottom\");\n    }\n\n    _createClass(ReviewAction, {\n        toggleRunOnLogin: {\n            value: function toggleRunOnLogin() {\n\n                OSXUtil.checkIfRunOnLoginEnabled((function (arg, enabled) {\n\n                    function enableResult(enabled) {\n                        this.actions.updateRunOnLogin(enabled == null);\n                    }\n\n                    function disableResult(enabled) {\n                        this.actions.updateRunOnLogin(!(enabled == null));\n                    }\n\n                    if (!enabled) OSXUtil.enableRunOnLogin(enableResult.bind(this));else OSXUtil.disableRunOnLogin(disableResult.bind(this));\n                }).bind(this));\n\n                this.dispatch();\n            }\n        },\n        checkRunOnLogin: {\n            value: function checkRunOnLogin() {\n\n                OSXUtil.checkIfRunOnLoginEnabled((function (arg, enabled) {\n                    this.actions.updateRunOnLogin(enabled);\n                }).bind(this));\n\n                this.dispatch();\n            }\n        },\n        updateRunOnLogin: {\n            value: function updateRunOnLogin(enabled) {\n                this.dispatch(enabled);\n            }\n        },\n        toggleMonitoring: {\n            value: function toggleMonitoring() {\n                if (!this.alt.stores.ReviewStore.getState().isMonitoring) this.actions.updateAll();\n\n                this.dispatch();\n            }\n        },\n        addReview: {\n            value: function addReview(url) {\n\n                var type;\n                if (url.indexOf(\"amazon.com\") != -1) type = this.alt.stores.ConfigStore.getAmazonType();else if (url.indexOf(\"goodreads.com\") != -1) type = this.alt.stores.ConfigStore.getGoodreadsType();\n\n                var review = new Review(url, type);\n\n                this.actions.requestReview(review);\n                this.dispatch(review);\n            }\n        },\n        requestReview: {\n            value: function requestReview(review) {\n\n                if (review.isDeleted) {\n                    return false;\n                }var self = this;\n                request(review.url, function (er, response, body) {\n\n                    console.log(response);\n                    review.loading = false;\n\n                    if (review.isDeleted || _.isUndefined(body)) return false;\n\n                    review.lastUpdate = new Date();\n                    review.lastStatus = { stars: review.stars, numReviews: review.numReviews };\n\n                    if (er == null) {\n                        switch (review.type) {\n                            case self.alt.stores.ConfigStore.getGoodreadsType():\n                                review = InterpreterUtil.interpretGoodreads(body, review);\n                                break;\n                            case self.alt.stores.ConfigStore.getAmazonType():\n                            default:\n                                review = InterpreterUtil.interpretAmazon(body, review);\n                        }\n\n                        if (!review.hasNew) {\n                            review.hasNew = review.hasTitle && !review.error && (review.lastStatus.numReviews != review.numReviews || review.lastStatus.stars != review.stars);\n\n                            // create notification\n                            if (review.hasNew && review.hasTitle) NotificationUtil.createNotification(review.title + \" now has \" + review.numReviews + \" reviews!\");\n                        }\n                    }\n\n                    review.error = er != null || !review.hasTitle;\n\n                    self.actions.reviewComplete(review);\n                });\n\n                this.dispatch(review);\n            }\n        },\n        allComplete: {\n            value: function allComplete() {\n                this.dispatch();\n            }\n        },\n        reviewComplete: {\n            value: function reviewComplete(review) {\n                this.dispatch(review);\n\n                var reviews = this.alt.stores.ReviewStore.getState().reviews;\n                var hasLoading = false;\n\n                _.each(reviews, function (review) {\n                    if (review.loading) hasLoading = true;\n\n                    if (hasLoading) return false;\n                });\n\n                if (!hasLoading) this.actions.allComplete();\n            }\n        },\n        updateReview: {\n            value: function updateReview(review) {\n                var elapsedTime = new Date().getTime() - (review.lastUpdate && Date.parse(review.lastUpdate) || 0);\n                if (!review.loading || elapsedTime >= 60000) {\n                    review.loading = true;\n                    review.error = false;\n                    this.actions.requestReview(review);\n                    this.dispatch();\n                }\n            }\n        },\n        deleteReview: {\n            value: function deleteReview(id) {\n                var reviews = this.alt.stores.ReviewStore.getState().reviews;\n\n                if (reviews[id]) {\n                    this.actions.markAsSeen(id);\n                    reviews[id].isDeleted = true;\n                    delete reviews[id];\n                }\n\n                this.dispatch(reviews);\n            }\n        },\n        updateAll: {\n            value: function updateAll() {\n                var self = this;\n                var reviews = this.alt.stores.ReviewStore.getState().reviews;\n\n                _.each(reviews, function (review) {\n                    self.actions.updateReview(review);\n                });\n\n                this.dispatch();\n            }\n        },\n        markAsSeen: {\n            value: function markAsSeen(reviewID) {\n                this.dispatch(reviewID);\n            }\n        },\n        markAllAsSeen: {\n            value: function markAllAsSeen() {\n                var self = this;\n                var reviews = this.alt.stores.ReviewStore.getState().reviews;\n\n                _.each(reviews, function (review) {\n                    self.actions.markAsSeen(review.id);\n                });\n\n                this.dispatch();\n            }\n        }\n    });\n\n    return ReviewAction;\n})();\n\nmodule.exports = alt.createActions(ReviewAction);"

/***/ }

})