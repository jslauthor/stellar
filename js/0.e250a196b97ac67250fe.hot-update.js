webpackHotUpdate(0,{

/***/ 57:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var ConfigStore = __webpack_require__(106)
	var classnames = __webpack_require__(29)
	var truncate = __webpack_require__(225)
	var Stars = __webpack_require__(107)
	var pluralize = __webpack_require__(226)
	var DeleteButton = __webpack_require__(108)
	var reviewAction = __webpack_require__(4)
	var gui = __webpack_require__(1);

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
	            reviewError: this.props.error && !this.props.loading,
	        })

	        var contentClasses = classnames({
	            reviewContent: true,
	            jiggle: this.props.isEditing
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
	                React.createElement("div", {className: contentClasses}, 
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

/***/ },

/***/ 71:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar React = require('react')\nvar ConfigStore = require('../stores/ConfigStore')\nvar classnames = require('classnames')\nvar truncate = require('html-truncate')\nvar Stars = require('./components/Stars.jsx')\nvar pluralize = require('pluralize')\nvar DeleteButton = require('./controls/DeleteButton.jsx')\nvar reviewAction = require('../actions/ReviewAction')\nvar gui = require('nw.gui');\n\nvar ReviewItem = React.createClass({displayName: \"ReviewItem\",\n    handleClick: function() {\n        reviewAction.markAsSeen(this.props.reviewID)\n    },\n    handleLink: function() {\n        gui.Shell.openExternal(this.props.url)\n        reviewAction.markAsSeen(this.props.reviewID)\n    },\n    render: function() {\n\n        var classNames = classnames({\n            reviewItem: true,\n            reviewLoading: this.props.loading,\n            reviewError: this.props.error && !this.props.loading,\n        })\n\n        var contentClasses = classnames({\n            reviewContent: true,\n            jiggle: this.props.isEditing\n        })\n\n        var num = this.props.numReviews ? this.props.numReviews.length : 0;\n        var numReviewClasses = classnames({\n            sm: num > 6,\n            md: num <= 6 && num > 3,\n            lg: num <= 3\n        })\n\n        var newComponent\n        if (this.props.hasNew)\n            newComponent = React.createElement(\"p\", {className: \"pointer\", onClick: this.handleClick}, React.createElement(\"span\", null, \"NEW\"))\n\n        var reviewSource\n        if (!this.props.isEditing)\n            reviewSource = ConfigStore.getIconForType(this.props.type)\n        else\n            reviewSource = React.createElement(DeleteButton, {reviewID: this.props.reviewID})\n\n        return (\n            React.createElement(\"section\", {className: classNames}, \n                React.createElement(\"div\", {className: contentClasses}, \n                    React.createElement(\"div\", {className: \"reviewSource\"}, \n                        reviewSource\n                    ), \n                    React.createElement(\"div\", {className: \"reviewInfo\"}, \n                        React.createElement(\"div\", {ref: \"reviewTitle\", className: \"reviewTitle\"}, \n                            React.createElement(\"p\", null, React.createElement(\"a\", {className: \"pointer\", onClick: this.handleLink}, truncate(this.props.title, 55)))\n                        ), \n                        React.createElement(\"div\", {className: \"reviewAvg\"}, \n                            React.createElement(Stars, {stars: this.props.stars}), \n                            React.createElement(\"span\", {className: \"review-avg-text\"}, this.props.stars), \" AVG\"\n                        )\n                    ), \n                    React.createElement(\"div\", {className: \"reviewStatus\"}, \n                        React.createElement(\"h1\", {className: numReviewClasses}, React.createElement(\"a\", {className: \"pointer\", onClick: this.handleLink}, this.props.numReviews)), \n                        React.createElement(\"h4\", null, pluralize('review', this.props.numReviews)), \n                        newComponent\n                    )\n                )\n            )\n        )\n    }\n});\n\nmodule.exports = ReviewItem;"

/***/ }

})