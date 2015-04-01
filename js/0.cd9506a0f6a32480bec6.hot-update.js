webpackHotUpdate(0,{

/***/ 49:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(4)
	var ConfigStore = __webpack_require__(122)
	var classnames = __webpack_require__(21)
	var truncate = __webpack_require__(182)
	var Stars = __webpack_require__(123)
	var pluralize = __webpack_require__(183)
	var DeleteButton = __webpack_require__(124)
	var reviewAction = __webpack_require__(3)
	var gui = __webpack_require__(368);
	
	var ReviewItem = React.createClass({displayName: "ReviewItem",
	    handleClick: function() {
	        reviewAction.markAsSeen(this.props.reviewID)
	    },
	    handleLink: function() {
	        gui.Shell.openExternal(this.props.url)
	        reviewAction.markAsSeen(this.props.reviewID)
	    },
	    render: function() {
	
	        var classNames = classnames({
	            reviewItem: true,
	            reviewLoading: this.props.loading,
	            reviewError: this.props.error && !this.props.loading
	        })
	
	        var num = this.props.numReviews ? this.props.numReviews.length : 0;
	        var numReviewClasses = classnames({
	            sm: num > 6,
	            md: num <= 6 && num > 3,
	            lg: num <= 3
	        })
	
	        var newComponent
	        if (this.props.hasNew)
	            newComponent = React.createElement("p", {className: "pointer", onClick: this.handleClick}, React.createElement("span", null, "NEW"))
	
	        var reviewSource
	        if (!this.props.isEditing)
	            reviewSource = ConfigStore.getIconForType(this.props.type)
	        else
	            reviewSource = React.createElement(DeleteButton, {reviewID: this.props.reviewID})
	
	        return (
	            React.createElement("section", {className: classNames}, 
	                React.createElement("div", {className: "reviewContent"}, 
	                    React.createElement("div", {className: "reviewSource"}, 
	                        reviewSource
	                    ), 
	                    React.createElement("div", {className: "reviewInfo"}, 
	                        React.createElement("div", {ref: "reviewTitle", className: "reviewTitle"}, 
	                            React.createElement("p", null, React.createElement("a", {className: "pointer", onClick: this.handleLink}, truncate(this.props.title, 55)))
	                        ), 
	                        React.createElement("div", {className: "reviewAvg"}, 
	                            React.createElement(Stars, {stars: this.props.stars}), 
	                            React.createElement("span", {className: "review-avg-text"}, this.props.stars), " AVG"
	                        )
	                    ), 
	                    React.createElement("div", {className: "reviewStatus"}, 
	                        React.createElement("h1", {className: numReviewClasses}, React.createElement("a", {className: "pointer", onClick: this.handleLink}, this.props.numReviews)), 
	                        React.createElement("h4", null, pluralize('review', this.props.numReviews)), 
	                        newComponent
	                    )
	                )
	            )
	        )
	    }
	});
	
	module.exports = ReviewItem;

/***/ }

})
//# sourceMappingURL=0.cd9506a0f6a32480bec6.hot-update.js.map