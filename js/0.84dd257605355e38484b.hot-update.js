webpackHotUpdate(0,{

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var ToggleButton = __webpack_require__ (79)
	var RefreshButton = __webpack_require__ (81)
	var AddButton = __webpack_require__ (75)
	var SettingsButton = __webpack_require__ (83)
	var reviewStore = __webpack_require__(28)
	var ListenerMixin = __webpack_require__(22)
	var classnames = __webpack_require__(29)
	var _ = __webpack_require__(12)

	var Controls = React.createClass({displayName: "Controls",
	    mixins: [ListenerMixin],
	    getInitialState: function() {
	        return {
	            lastUpdate: reviewStore.getState().lastUpdate,
	            reviews: reviewStore.getState().reviews
	        }
	    },
	    onChange: function() {
	        this.setState(this.getInitialState())
	    },
	    componentDidMount: function() {
	        this.listenTo(reviewStore, this.onChange)
	    },
	    render: function() {

	        var lastUpdateClasses = classnames({
	            "last-update": true,
	            hide: _.isUndefined(this.state.reviews) || _.size(this.state.reviews) == 0
	        })

	        return (
	          React.createElement("section", {className: "mainControls"}, 
	              React.createElement(ToggleButton, null), 
	              React.createElement(RefreshButton, null), 
	              React.createElement("div", {className: lastUpdateClasses}, this.state.lastUpdate), 
	              React.createElement(AddButton, null), 
	              React.createElement(SettingsButton, null)
	          )
	        );
	    }

	});

	module.exports = Controls;



/***/ },

/***/ 68:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar React = require('react')\nvar ToggleButton = require ('./controls/ToggleButton.jsx')\nvar RefreshButton = require ('./controls/RefreshButton.jsx')\nvar AddButton = require ('./controls/AddButton.jsx')\nvar SettingsButton = require ('./controls/SettingsButton.jsx')\nvar reviewStore = require('../stores/ReviewStore')\nvar ListenerMixin = require('alt/mixins/ListenerMixin')\nvar classnames = require('classnames')\nvar _ = require('lodash')\n\nvar Controls = React.createClass({displayName: \"Controls\",\n    mixins: [ListenerMixin],\n    getInitialState: function() {\n        return {\n            lastUpdate: reviewStore.getState().lastUpdate,\n            reviews: reviewStore.getState().reviews\n        }\n    },\n    onChange: function() {\n        this.setState(this.getInitialState())\n    },\n    componentDidMount: function() {\n        this.listenTo(reviewStore, this.onChange)\n    },\n    render: function() {\n\n        var lastUpdateClasses = classnames({\n            \"last-update\": true,\n            hide: _.isUndefined(this.state.reviews) || _.size(this.state.reviews) == 0\n        })\n\n        return (\n          React.createElement(\"section\", {className: \"mainControls\"}, \n              React.createElement(ToggleButton, null), \n              React.createElement(RefreshButton, null), \n              React.createElement(\"div\", {className: lastUpdateClasses}, this.state.lastUpdate), \n              React.createElement(AddButton, null), \n              React.createElement(SettingsButton, null)\n          )\n        );\n    }\n\n});\n\nmodule.exports = Controls;\n\n"

/***/ }

})