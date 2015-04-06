webpackHotUpdate(0,{

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(170)
	var ReactTransitionGroup = React.addons.CSSTransitionGroup;
	var reviewStore = __webpack_require__(28);
	var ListenerMixin = __webpack_require__(23)
	var _ = __webpack_require__(11)
	var ReviewItem = __webpack_require__(57)
	var reviewAction = __webpack_require__(4)
	var AddButton = __webpack_require__ (82)

	var ReviewList = React.createClass({displayName: "ReviewList",
	    mixins: [ListenerMixin],
	    getInitialState: function() {
	        return reviewStore.getState()
	    },
	    componentDidMount:function() {
	        this.listenTo(reviewStore, this.onChange)
	    },

	    onChange:function() {
	        this.setState(this.getInitialState())
	    },
	    componentDidUpdate: function() {
	        if (this.state.shouldScrollToBottom)
	        {
	            var list = this.refs.listRef.getDOMNode();
	            list.scrollTop = list.scrollHeight;
	            reviewAction.resetScrollToBottom();
	        }
	    },
	    render: function () {

	        var reviewItems = [];
	        var self = this;
	        _.forEach(this.state.reviews, function (item) {
	            reviewItems.push(
	                React.createElement(ReviewItem, {
	                    key: item.id, 
	                    reviewID: item.id, 
	                    title: item.title, 
	                    url: item.url, 
	                    stars: item.stars, 
	                    type: item.type, 
	                    numReviews: item.numReviews, 
	                    hasNew: item.hasNew, 
	                    loading: item.loading, 
	                    error: item.error, 
	                    isEditing: self.state.isEditing})
	            )
	        })

	        if (reviewItems.length == 0)
	            reviewItems.push(
	                React.createElement("div", {key: "noItemMsg", className: "no-item-msg"}, 
	                    React.createElement("p", null, "Add a starlet with the ", React.createElement(AddButton, null), " button!")
	                )
	            )

	        return (
	            React.createElement("section", {ref: "listRef", className: "reviewList"}, 
	                React.createElement(ReactTransitionGroup, {transitionName: "list-animation"}, 
	                    reviewItems
	                )
	            )
	        )
	    }
	});

	module.exports = ReviewList;

/***/ },

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar React = require('react/addons')\nvar ReactTransitionGroup = React.addons.CSSTransitionGroup;\nvar reviewStore = require('../stores/ReviewStore');\nvar ListenerMixin = require('alt/mixins/ListenerMixin')\nvar _ = require('lodash')\nvar ReviewItem = require('./ReviewItem.jsx')\nvar reviewAction = require('../actions/ReviewAction')\nvar AddButton = require ('./controls/AddButton.jsx')\n\nvar ReviewList = React.createClass({displayName: \"ReviewList\",\n    mixins: [ListenerMixin],\n    getInitialState: function() {\n        return reviewStore.getState()\n    },\n    componentDidMount:function() {\n        this.listenTo(reviewStore, this.onChange)\n    },\n\n    onChange:function() {\n        this.setState(this.getInitialState())\n    },\n    componentDidUpdate: function() {\n        if (this.state.shouldScrollToBottom)\n        {\n            var list = this.refs.listRef.getDOMNode();\n            list.scrollTop = list.scrollHeight;\n            reviewAction.resetScrollToBottom();\n        }\n    },\n    render: function () {\n\n        var reviewItems = [];\n        var self = this;\n        _.forEach(this.state.reviews, function (item) {\n            reviewItems.push(\n                React.createElement(ReviewItem, {\n                    key: item.id, \n                    reviewID: item.id, \n                    title: item.title, \n                    url: item.url, \n                    stars: item.stars, \n                    type: item.type, \n                    numReviews: item.numReviews, \n                    hasNew: item.hasNew, \n                    loading: item.loading, \n                    error: item.error, \n                    isEditing: self.state.isEditing})\n            )\n        })\n\n        if (reviewItems.length == 0)\n            reviewItems.push(\n                React.createElement(\"div\", {key: \"noItemMsg\", className: \"no-item-msg\"}, \n                    React.createElement(\"p\", null, \"Add a starlet with the \", React.createElement(AddButton, null), \" button!\")\n                )\n            )\n\n        return (\n            React.createElement(\"section\", {ref: \"listRef\", className: \"reviewList\"}, \n                React.createElement(ReactTransitionGroup, {transitionName: \"list-animation\"}, \n                    reviewItems\n                )\n            )\n        )\n    }\n});\n\nmodule.exports = ReviewList;"

/***/ }

})