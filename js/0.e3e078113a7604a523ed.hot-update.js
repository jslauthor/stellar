webpackHotUpdate(0,{

/***/ 20:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var alt = __webpack_require__(1);
	var ReviewAction = __webpack_require__(3);
	var LocalStorageUtil = __webpack_require__(2);
	var _ = __webpack_require__(6);
	var moment = __webpack_require__(120);
	var AutoLaunch = __webpack_require__(369);
	
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
	
	        this.nwAppLauncher = new AutoLaunch({
	            name: "stellarApp",
	            isHidden: false
	        });
	
	        this.on("serialize", function () {
	            var state = _.cloneDeep(_this.alt.stores.ReviewStore.getState());
	            state.isEditing = false;
	            state.loading = false;
	            state.showReviewPopup = false;
	            delete state.nwAppLauncher;
	
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
	        onCheckRunOnLogin: {
	            value: function onCheckRunOnLogin(error) {
	                console.log(error);
	                this.nwAppLauncher.isEnabled((function (enabled) {
	                    this.runOnLogin = enabled;
	                }).bind(this));
	            }
	        },
	        onToggleRunOnLogin: {
	            value: function onToggleRunOnLogin() {
	                this.runOnLogin = !this.runOnLogin;
	                if (this.runOnLogin) this.nwAppLauncher.enable(this.onCheckRunOnLogin.bind(this));else this.nwAppLauncher.disable(this.onCheckRunOnLogin.bind(this));
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

/***/ }

})
//# sourceMappingURL=0.e3e078113a7604a523ed.hot-update.js.map