webpackHotUpdate(0,{

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var ToggleButton = __webpack_require__ (81)
	var RefreshButton = __webpack_require__ (83)
	var AddButton = __webpack_require__ (77)
	var SettingsButton = __webpack_require__ (85)
	var reviewStore = __webpack_require__(28)
	var ListenerMixin = __webpack_require__(23)
	var classnames = __webpack_require__(29)
	var _ = __webpack_require__(12)
	var moment = __webpack_require__(172)

	var Controls = React.createClass({displayName: "Controls",
	    mixins: [ListenerMixin],
	    getInitialState: function() {
	        return {
	            lastUpdate: reviewStore.getState().lastUpdate,
	            reviews: reviewStore.getState().reviews,
	            isMonitoring: reviewStore.getState().isMonitoring,
	            nextUpdate: reviewStore.getState().nextUpdateTime
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

	        var nextUpdateLabel
	        if (!this.state.isMonitoring)
	            nextUpdateLabel = "Monitoring Off"
	        else if (this.state.nextUpdate > 0)
	            nextUpdateLabel = moment(this.state.nextUpdate).format("mm:ss")
	        else
	            nextUpdateLabel = "Loading"

	        return (
	          React.createElement("section", {className: "mainControls"}, 
	              React.createElement(ToggleButton, null), 
	              React.createElement("div", {className: lastUpdateClasses}, 
	                  React.createElement("p", {className: "next-update"}, React.createElement("i", null, "Next Update:"), " ", nextUpdateLabel), 
	                  React.createElement("p", null, React.createElement("i", null, "Last Updated:"), " ", this.state.lastUpdate)
	              ), 
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

	module.exports = "\"use strict\";\n\nvar React = require('react')\nvar ToggleButton = require ('./controls/ToggleButton.jsx')\nvar RefreshButton = require ('./controls/RefreshButton.jsx')\nvar AddButton = require ('./controls/AddButton.jsx')\nvar SettingsButton = require ('./controls/SettingsButton.jsx')\nvar reviewStore = require('../stores/ReviewStore')\nvar ListenerMixin = require('alt/mixins/ListenerMixin')\nvar classnames = require('classnames')\nvar _ = require('lodash')\nvar moment = require('moment')\n\nvar Controls = React.createClass({displayName: \"Controls\",\n    mixins: [ListenerMixin],\n    getInitialState: function() {\n        return {\n            lastUpdate: reviewStore.getState().lastUpdate,\n            reviews: reviewStore.getState().reviews,\n            isMonitoring: reviewStore.getState().isMonitoring,\n            nextUpdate: reviewStore.getState().nextUpdateTime\n        }\n    },\n    onChange: function() {\n        this.setState(this.getInitialState())\n    },\n    componentDidMount: function() {\n        this.listenTo(reviewStore, this.onChange)\n    },\n    render: function() {\n\n        var lastUpdateClasses = classnames({\n            \"last-update\": true,\n            hide: _.isUndefined(this.state.reviews) || _.size(this.state.reviews) == 0\n        })\n\n        var nextUpdateLabel\n        if (!this.state.isMonitoring)\n            nextUpdateLabel = \"Monitoring Off\"\n        else if (this.state.nextUpdate > 0)\n            nextUpdateLabel = moment(this.state.nextUpdate).format(\"mm:ss\")\n        else\n            nextUpdateLabel = \"Loading\"\n\n        return (\n          React.createElement(\"section\", {className: \"mainControls\"}, \n              React.createElement(ToggleButton, null), \n              React.createElement(\"div\", {className: lastUpdateClasses}, \n                  React.createElement(\"p\", {className: \"next-update\"}, React.createElement(\"i\", null, \"Next Update:\"), \" \", nextUpdateLabel), \n                  React.createElement(\"p\", null, React.createElement(\"i\", null, \"Last Updated:\"), \" \", this.state.lastUpdate)\n              ), \n              React.createElement(AddButton, null), \n              React.createElement(SettingsButton, null)\n          )\n        );\n    }\n\n});\n\nmodule.exports = Controls;\n\n"

/***/ }

})