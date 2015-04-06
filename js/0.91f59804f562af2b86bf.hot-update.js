webpackHotUpdate(0,{

/***/ 12:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10);
	var MainBackground = __webpack_require__(24);
	var ReviewList = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./ReviewList.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var Controls = __webpack_require__(26);
	var AddItem = __webpack_require__(27)
	var reviewStore = __webpack_require__(28)
	var classnames = __webpack_require__(29)
	var ListenerMixin = __webpack_require__(23)

	var Main = React.createClass({displayName: "Main",
	    mixins: [ListenerMixin],
	    getDefaultProps: function() {
	        return { tray: null }
	    },
	    getInitialState: function() {
	        return reviewStore.getState()
	    },
	    componentDidMount: function() {
	        this.listenTo(reviewStore, this.onChange)
	        this.checkForNew()
	    },
	    onChange: function() {
	        this.setState(this.getInitialState())
	    },
	    componentDidUpdate: function() {
	        this.checkForNew()
	    },
	    checkForNew: function() {
	        if (this.props.tray == null)
	            return

	        if (this.state.hasNewReviews)
	            this.props.tray.icon = 'img/tray_icon_alert@2x.png'
	        else
	            this.props.tray.icon = 'img/tray_icon@2x.png'
	    },
	    render: function() {

	        var popup
	        if (this.state.showReviewPopup)
	            popup = React.createElement(AddItem, {style: {position: "absolute"}})

	        var classes = classnames({
	            "main-section": true,
	            blur: this.state.showReviewPopup
	        })

	        return (
	            React.createElement("main", {style: {width: "100%", height: "100%", position:"relative"}}, 
	                React.createElement("section", {className: classes}, 
	                    React.createElement(MainBackground, null), 
	                    React.createElement(ReviewList, null), 
	                    React.createElement(Controls, null)
	                ), 
	                popup
	            )

	        );
	    }
	});

	module.exports = Main;


/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./com.jslauthor.stellarApp.plist": 86,
		"./img/stellar.icns": 87,
		"./img/stellarBG.jpg": 98,
		"./img/stellarBG@2x.jpg": 99,
		"./img/tray_icon@2x.png": 100,
		"./img/tray_icon_alert@2x.png": 101,
		"./js/actions/ReviewAction": 59,
		"./js/actions/ReviewAction.js": 59,
		"./js/addons/TimeoutTransitionGroup": 75,
		"./js/addons/TimeoutTransitionGroup.js": 75,
		"./js/alt": 60,
		"./js/alt.js": 60,
		"./js/index": 61,
		"./js/index.js": 61,
		"./js/services/MockService": 88,
		"./js/services/MockService.js": 88,
		"./js/stores/ConfigStore": 89,
		"./js/stores/ConfigStore.js": 89,
		"./js/stores/ReviewStore": 62,
		"./js/stores/ReviewStore.js": 62,
		"./js/utils/InterpreterUtil": 63,
		"./js/utils/InterpreterUtil.js": 63,
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
		"./js/views/components/Stars.jsx": 90,
		"./js/views/controls/AddButton.jsx": 83,
		"./js/views/controls/CloseButton.jsx": 77,
		"./js/views/controls/DeleteButton.jsx": 91,
		"./js/views/controls/RefreshButton.jsx": 81,
		"./js/views/controls/SettingsButton.jsx": 85,
		"./js/views/controls/SortMenu.jsx": 92,
		"./js/views/controls/ToggleButton.jsx": 79,
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