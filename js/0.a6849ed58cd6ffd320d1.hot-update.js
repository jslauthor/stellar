webpackHotUpdate(0,{

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var alt = __webpack_require__(2);
	var request = __webpack_require__(17);
	var uuid = __webpack_require__(19);
	var InterpreterUtil = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../utils/InterpreterUtil\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./com.jslauthor.stellarApp.plist": 87,
		"./img/stellar.icns": 88,
		"./img/stellarBG.jpg": 101,
		"./img/stellarBG@2x.jpg": 102,
		"./img/tray_icon@2x.png": 103,
		"./img/tray_icon_alert@2x.png": 104,
		"./js/actions/ReviewAction": 59,
		"./js/actions/ReviewAction.js": 59,
		"./js/addons/TimeoutTransitionGroup": 89,
		"./js/addons/TimeoutTransitionGroup.js": 89,
		"./js/alt": 60,
		"./js/alt.js": 60,
		"./js/index": 61,
		"./js/index.js": 61,
		"./js/services/MockService": 90,
		"./js/services/MockService.js": 90,
		"./js/stores/ConfigStore": 91,
		"./js/stores/ConfigStore.js": 91,
		"./js/stores/ReviewStore": 62,
		"./js/stores/ReviewStore.js": 62,
		"./js/utils/LocalStorageUtil": 64,
		"./js/utils/LocalStorageUtil.js": 64,
		"./js/utils/NotificationUtil": 65,
		"./js/utils/NotificationUtil.js": 65,
		"./js/utils/OSXUtil": 66,
		"./js/utils/OSXUtil.js": 66,
		"./js/views/AddItem.jsx": 67,
		"./js/views/Controls.jsx": 68,
		"./js/views/Main.jsx": 69,
		"./js/views/MainBackground.jsx": 70,
		"./js/views/ReviewItem.jsx": 71,
		"./js/views/ReviewList.jsx": 72,
		"./js/views/components/Stars.jsx": 92,
		"./js/views/components/StellarIcon.jsx": 78,
		"./js/views/controls/AddButton.jsx": 76,
		"./js/views/controls/CloseButton.jsx": 86,
		"./js/views/controls/DeleteButton.jsx": 93,
		"./js/views/controls/RefreshButton.jsx": 82,
		"./js/views/controls/SettingsButton.jsx": 84,
		"./js/views/controls/SortMenu.jsx": 94,
		"./js/views/controls/ToggleButton.jsx": 80,
		"./js/vo/Review": 73,
		"./js/vo/Review.js": 73
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 18;


/***/ }

})