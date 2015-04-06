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
	var StellarIcon = __webpack_require__(418)

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
	                    React.createElement(StellarIcon, null), 
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

	module.exports = "\"use strict\";\n\nvar React = require('react/addons')\nvar ReactTransitionGroup = React.addons.CSSTransitionGroup;\nvar reviewStore = require('../stores/ReviewStore');\nvar ListenerMixin = require('alt/mixins/ListenerMixin')\nvar _ = require('lodash')\nvar ReviewItem = require('./ReviewItem.jsx')\nvar reviewAction = require('../actions/ReviewAction')\nvar AddButton = require ('./controls/AddButton.jsx')\nvar StellarIcon = require('./components/StellarIcon.jsx')\n\nvar ReviewList = React.createClass({displayName: \"ReviewList\",\n    mixins: [ListenerMixin],\n    getInitialState: function() {\n        return reviewStore.getState()\n    },\n    componentDidMount:function() {\n        this.listenTo(reviewStore, this.onChange)\n    },\n\n    onChange:function() {\n        this.setState(this.getInitialState())\n    },\n    componentDidUpdate: function() {\n        if (this.state.shouldScrollToBottom)\n        {\n            var list = this.refs.listRef.getDOMNode();\n            list.scrollTop = list.scrollHeight;\n            reviewAction.resetScrollToBottom();\n        }\n    },\n    render: function () {\n\n        var reviewItems = [];\n        var self = this;\n        _.forEach(this.state.reviews, function (item) {\n            reviewItems.push(\n                React.createElement(ReviewItem, {\n                    key: item.id, \n                    reviewID: item.id, \n                    title: item.title, \n                    url: item.url, \n                    stars: item.stars, \n                    type: item.type, \n                    numReviews: item.numReviews, \n                    hasNew: item.hasNew, \n                    loading: item.loading, \n                    error: item.error, \n                    isEditing: self.state.isEditing})\n            )\n        })\n\n        if (reviewItems.length == 0)\n            reviewItems.push(\n                React.createElement(\"div\", {key: \"noItemMsg\", className: \"no-item-msg\"}, \n                    React.createElement(StellarIcon, null), \n                    React.createElement(\"p\", null, \"Add a starlet with the \", React.createElement(AddButton, null), \" button!\")\n                )\n            )\n\n        return (\n            React.createElement(\"section\", {ref: \"listRef\", className: \"reviewList\"}, \n                React.createElement(ReactTransitionGroup, {transitionName: \"list-animation\"}, \n                    reviewItems\n                )\n            )\n        )\n    }\n});\n\nmodule.exports = ReviewList;"

/***/ },

/***/ 418:
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	React = __webpack_require__(10)

	var StellarIcon = React.createClass({displayName: "StellarIcon",

	    render: function() {
	        return (
	            React.createElement("svg", {viewBox: "0 0 78.4 21.5", width: "78", height: "21.5"}, 
	                React.createElement("g", null, 
	                    React.createElement("g", null, 
	                        React.createElement("path", {fill: "#FFFFFF", d: "M26.5,9.2c-3.1,0-5,1.6-5.4,3.7c-1,4.4,5,3.2,4.5,5.3c-0.2,0.6-0.7,1-1.3,1c-0.3,0-0.6-0.1-0.7-0.4" + ' ' +
				"c-0.1-0.1-0.1-0.3-0.1-0.5s0-0.4,0.1-0.6h-3.4c-0.5,2.6,0.5,3.9,3.8,3.9c2.9,0,5-1.6,5.5-3.9c1-4.5-4.9-3.2-4.6-5.1" + ' ' +
				"c0.2-0.6,0.6-0.9,1.2-0.9c0.7,0,1,0.3,0.8,1.3h3.4C30.6,10.4,29.4,9.2,26.5,9.2z M55.8,5.7l-3.2,15.5h3.9l3.2-15.5H55.8z" + ' ' +
				 "M14.1,9.3l-2.7-0.5L10,6.3L8.7,8.8L6,9.3l1.9,2.1l-0.3,2.8L10,13l2.5,1.2l-0.3-2.8L14.1,9.3z M35,17.7l1.2-5.6h1.5l0.5-2.6h-1.5" + ' ' +
				"L37.4,6h-3.9l-0.7,3.4h-1.3l-0.5,2.6h1.3l-1.3,6.2c-0.5,2.6,0.3,3,2.7,3c0.7,0,1.4,0,2.2-0.1l0.5-2.6h-0.6" + ' ' +
				"C35.1,18.6,34.8,18.4,35,17.7z M20.1,7.4l-6.7-1.3L10,0L6.7,6.1L0,7.4l4.7,5.1l-0.9,6.9l6.2-3l6.2,3l-0.9-6.9L20.1,7.4z M10,14.8" + ' ' +
				"l-4.3,2.1L6.3,12L3,8.4l4.7-0.9L10,3.1l2.3,4.3l4.7,0.9L13.8,12l0.6,4.9L10,14.8z M50.3,5.7l-3.2,15.5H51l3.2-15.5H50.3z M68.9,13" + ' ' +
				"c0.6-3-1.1-3.8-3.9-3.8c-1.8,0-4.6,0.6-5.3,3.9h3.4c0.3-1.2,0.7-1.6,1.4-1.6c0.6,0,0.9,0.4,0.8,1.1c-0.2,0.7-0.5,1.1-1.4,1.3" + ' ' +
				"l-1.6,0.4c-2.6,0.6-3.6,1.6-4,3.8c-0.5,2,0.2,3.4,2.5,3.4c1.2,0,2.3-0.6,3-1.6h0c0,0.5-0.1,0.9,0,1.3h3.8" + ' ' +
				"c-0.2-0.6-0.1-1.4,0.2-2.5L68.9,13z M64.5,17c-0.3,1.3-0.7,1.9-1.6,1.9c-0.6,0-0.8-0.5-0.7-1.3c0.2-0.8,0.5-1.2,1.1-1.5" + ' ' +
				"c0.6-0.3,1.1-0.2,1.4-0.5h0L64.5,17z M41.2,16H47l0.3-1.2c0.9-4.2-0.4-5.6-3.5-5.6c-3.5,0-5.3,1.7-6.3,6.2" + ' ' +
				"c-0.2,1.1-0.3,2.1-0.3,2.8c0,2.4,1.3,3.3,4,3.3c3.2,0,4.9-1.6,5.5-4.4h-3.5c-0.3,1.6-0.8,2-1.5,2c-0.5,0-1-0.3-0.7-1.6L41.2,16z" + ' ' +
				 "M41.8,13.4c0.3-1.2,0.6-1.8,1.4-1.8c0.8,0,1,0.6,0.7,1.8l-0.1,0.5h-2.1L41.8,13.4z M77.8,9.2c-1.1,0-2.3,0.8-3.1,2.2h0L75,9.5" + ' ' +
				"h-3.8l-2.4,11.7h3.9l1.3-6.4c0.3-1.6,1.2-2.1,2.6-2.1c0.3,0,0.7,0,1,0.1l0.8-3.6H77.8z"})
	                    )
	                )
	            )
	        )
	    }

	})

	module.exports = StellarIcon

/***/ }

})