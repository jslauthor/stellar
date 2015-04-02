webpackHotUpdate(0,{

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var alt = __webpack_require__(2);
	var ReviewAction = __webpack_require__(4);
	var LocalStorageUtil = __webpack_require__(3);
	var _ = __webpack_require__(12);
	var moment = __webpack_require__(107);
	var OSXUtil = __webpack_require__(5);
	
	var ReviewStore = (function () {
	    function ReviewStore() {
	        var _this = this;
	
	        _classCallCheck(this, ReviewStore);
	
	        this.bindActions(ReviewAction);
	        this.reviews = {};
	        this.loading = false;
	        this.showReviewPopup = false;
	        this.isEditing = false;
	        this.isMonitoring = true;
	        this.lastUpdate = "";
	        this.shouldScrollToBottom = true;
	        this.hasNewReviews = false;
	        this.notificationsEnabled = true;
	        this.runOnLogin = false;
	
	        this.on("serialize", function () {
	            var state = _.cloneDeep(_this.alt.stores.ReviewStore.getState());
	            state.isEditing = false;
	            state.loading = false;
	            state.showReviewPopup = false;
	            delete state.nwAppLauncher;
	            delete state.runOnLogin;
	
	            _.each(state.reviews, function (review) {
	                review.loading = false;
	            });
	            return state;
	        });
	    }
	
	    _createClass(ReviewStore, {
	        onToggleMonitoring: {
	            value: function onToggleMonitoring() {
	                this.isMonitoring = !this.isMonitoring;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onToggleEditing: {
	            value: function onToggleEditing() {
	                this.isEditing = !this.isEditing;
	            }
	        },
	        onToggleNotifications: {
	            value: function onToggleNotifications() {
	                this.notificationsEnabled = !this.notificationsEnabled;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onUpdateRunOnLogin: {
	            value: function onUpdateRunOnLogin(enabled) {
	                this.runOnLogin = enabled;
	            }
	        },
	        onShowAddReviewPopup: {
	            value: function onShowAddReviewPopup() {
	                this.showReviewPopup = true;
	            }
	        },
	        onHideAddReviewPopup: {
	            value: function onHideAddReviewPopup() {
	                this.showReviewPopup = false;
	            }
	        },
	        onAllComplete: {
	            value: function onAllComplete() {
	                this.lastUpdate = "Updated " + moment().format("ddd, h:mmA");
	                this.loading = false;
	            }
	        },
	        onRequestReview: {
	            value: function onRequestReview(review) {
	                this.loading = true;
	            }
	        },
	        onDeleteReview: {
	            value: function onDeleteReview(reviews) {
	                this.reviews = reviews;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onAddReview: {
	            value: function onAddReview(review) {
	                this.isEditing = false;
	                this.reviews[review.id] = review;
	                this.shouldScrollToBottom = true;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onReviewComplete: {
	            value: function onReviewComplete(review) {
	                this.reviews[review.id] = review;
	                LocalStorageUtil.saveAll();
	                this._updateHasNew();
	            }
	        },
	        onMarkAsSeen: {
	            value: function onMarkAsSeen(reviewID) {
	                var review = this.reviews[reviewID];
	                if (!_.isUndefined(review)) review.hasNew = false;
	
	                this._updateHasNew();
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onResetScrollToBottom: {
	            value: function onResetScrollToBottom() {
	                this.shouldScrollToBottom = false;
	            }
	        },
	        _updateHasNew: {
	            value: function _updateHasNew() {
	                this.hasNewReviews = false;
	                var self = this;
	                _.each(this.reviews, function (review) {
	                    if (review.hasNew) {
	                        self.hasNewReviews = true;
	                        return false;
	                    }
	                });
	            }
	        }
	    });
	
	    return ReviewStore;
	})();
	
	module.exports = alt.createStore(ReviewStore, "ReviewStore");

/***/ },

/***/ 62:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nvar _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } };\n\nvar alt = require(\"../alt\");\nvar ReviewAction = require(\"../actions/ReviewAction\");\nvar LocalStorageUtil = require(\"../utils/LocalStorageUtil\");\nvar _ = require(\"lodash\");\nvar moment = require(\"moment\");\nvar OSXUtil = require(\"../utils/OSXUtil\");\n\nvar ReviewStore = (function () {\n    function ReviewStore() {\n        var _this = this;\n\n        _classCallCheck(this, ReviewStore);\n\n        this.bindActions(ReviewAction);\n        this.reviews = {};\n        this.loading = false;\n        this.showReviewPopup = false;\n        this.isEditing = false;\n        this.isMonitoring = true;\n        this.lastUpdate = \"\";\n        this.shouldScrollToBottom = true;\n        this.hasNewReviews = false;\n        this.notificationsEnabled = true;\n        this.runOnLogin = false;\n\n        this.on(\"serialize\", function () {\n            var state = _.cloneDeep(_this.alt.stores.ReviewStore.getState());\n            state.isEditing = false;\n            state.loading = false;\n            state.showReviewPopup = false;\n            delete state.nwAppLauncher;\n            delete state.runOnLogin;\n\n            _.each(state.reviews, function (review) {\n                review.loading = false;\n            });\n            return state;\n        });\n    }\n\n    _createClass(ReviewStore, {\n        onToggleMonitoring: {\n            value: function onToggleMonitoring() {\n                this.isMonitoring = !this.isMonitoring;\n                LocalStorageUtil.saveAll();\n            }\n        },\n        onToggleEditing: {\n            value: function onToggleEditing() {\n                this.isEditing = !this.isEditing;\n            }\n        },\n        onToggleNotifications: {\n            value: function onToggleNotifications() {\n                this.notificationsEnabled = !this.notificationsEnabled;\n                LocalStorageUtil.saveAll();\n            }\n        },\n        onUpdateRunOnLogin: {\n            value: function onUpdateRunOnLogin(enabled) {\n                this.runOnLogin = enabled;\n            }\n        },\n        onShowAddReviewPopup: {\n            value: function onShowAddReviewPopup() {\n                this.showReviewPopup = true;\n            }\n        },\n        onHideAddReviewPopup: {\n            value: function onHideAddReviewPopup() {\n                this.showReviewPopup = false;\n            }\n        },\n        onAllComplete: {\n            value: function onAllComplete() {\n                this.lastUpdate = \"Updated \" + moment().format(\"ddd, h:mmA\");\n                this.loading = false;\n            }\n        },\n        onRequestReview: {\n            value: function onRequestReview(review) {\n                this.loading = true;\n            }\n        },\n        onDeleteReview: {\n            value: function onDeleteReview(reviews) {\n                this.reviews = reviews;\n                LocalStorageUtil.saveAll();\n            }\n        },\n        onAddReview: {\n            value: function onAddReview(review) {\n                this.isEditing = false;\n                this.reviews[review.id] = review;\n                this.shouldScrollToBottom = true;\n                LocalStorageUtil.saveAll();\n            }\n        },\n        onReviewComplete: {\n            value: function onReviewComplete(review) {\n                this.reviews[review.id] = review;\n                LocalStorageUtil.saveAll();\n                this._updateHasNew();\n            }\n        },\n        onMarkAsSeen: {\n            value: function onMarkAsSeen(reviewID) {\n                var review = this.reviews[reviewID];\n                if (!_.isUndefined(review)) review.hasNew = false;\n\n                this._updateHasNew();\n                LocalStorageUtil.saveAll();\n            }\n        },\n        onResetScrollToBottom: {\n            value: function onResetScrollToBottom() {\n                this.shouldScrollToBottom = false;\n            }\n        },\n        _updateHasNew: {\n            value: function _updateHasNew() {\n                this.hasNewReviews = false;\n                var self = this;\n                _.each(this.reviews, function (review) {\n                    if (review.hasNew) {\n                        self.hasNewReviews = true;\n                        return false;\n                    }\n                });\n            }\n        }\n    });\n\n    return ReviewStore;\n})();\n\nmodule.exports = alt.createStore(ReviewStore, \"ReviewStore\");"

/***/ }

})
//# sourceMappingURL=0.9789948fdb16a22978b9.hot-update.js.map