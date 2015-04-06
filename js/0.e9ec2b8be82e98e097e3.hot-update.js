webpackHotUpdate(0,{

/***/ 12:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10);
	var MainBackground = __webpack_require__(24);
	var ReviewList = __webpack_require__(25);
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
		"./js/views/ReviewList.jsx": 72,
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


/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var reviewStore = __webpack_require__(28);
	var ListenerMixin = __webpack_require__(23)
	var _ = __webpack_require__(11)
	var ReviewItem = __webpack_require__(57)
	var reviewAction = __webpack_require__(4)
	var TimeoutTransitionGroup = __webpack_require__(74)

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

	        var noItemsMessage;
	        if (reviewItems.length == 0)
	            noItemsMessage = React.createElement("div", {className: "no-item-msg"}, React.createElement("p", null, "Add a starlet with the + below!"))

	        return (
	            React.createElement("section", {ref: "listRef", className: "reviewList"}, 
	                React.createElement(TimeoutTransitionGroup, {
	                    enterTimeout: 0, 
	                    leaveTimeout: 0, 
	                    transitionName: "list-animation"}, 
	                    reviewItems
	                ), 

	                noItemsMessage

	            )
	        )
	    }
	});

	module.exports = ReviewList;

/***/ },

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

/***/ },

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar React = require('react')\nvar reviewStore = require('../stores/ReviewStore');\nvar ListenerMixin = require('alt/mixins/ListenerMixin')\nvar _ = require('lodash')\nvar ReviewItem = require('./ReviewItem.jsx')\nvar reviewAction = require('../actions/ReviewAction')\nvar TimeoutTransitionGroup = require('../addons/TimeoutTransitionGroup')\n\nvar ReviewList = React.createClass({displayName: \"ReviewList\",\n    mixins: [ListenerMixin],\n    getInitialState: function() {\n        return reviewStore.getState()\n    },\n    componentDidMount:function() {\n        this.listenTo(reviewStore, this.onChange)\n    },\n\n    onChange:function() {\n        this.setState(this.getInitialState())\n    },\n    componentDidUpdate: function() {\n        if (this.state.shouldScrollToBottom)\n        {\n            var list = this.refs.listRef.getDOMNode();\n            list.scrollTop = list.scrollHeight;\n            reviewAction.resetScrollToBottom();\n        }\n    },\n    render: function () {\n\n        var reviewItems = [];\n        var self = this;\n        _.forEach(this.state.reviews, function (item) {\n            reviewItems.push(\n                React.createElement(ReviewItem, {\n                    key: item.id, \n                    reviewID: item.id, \n                    title: item.title, \n                    url: item.url, \n                    stars: item.stars, \n                    type: item.type, \n                    numReviews: item.numReviews, \n                    hasNew: item.hasNew, \n                    loading: item.loading, \n                    error: item.error, \n                    isEditing: self.state.isEditing})\n            )\n        })\n\n        var noItemsMessage;\n        if (reviewItems.length == 0)\n            noItemsMessage = React.createElement(\"div\", {className: \"no-item-msg\"}, React.createElement(\"p\", null, \"Add a starlet with the + below!\"))\n\n        return (\n            React.createElement(\"section\", {ref: \"listRef\", className: \"reviewList\"}, \n                React.createElement(TimeoutTransitionGroup, {\n                    enterTimeout: 0, \n                    leaveTimeout: 0, \n                    transitionName: \"list-animation\"}, \n                    reviewItems\n                ), \n\n                noItemsMessage\n\n            )\n        )\n    }\n});\n\nmodule.exports = ReviewList;"

/***/ },

/***/ 74:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/**
	 * The CSSTransitionGroup component uses the 'transitionend' event, which
	 * browsers will not send for any number of reasons, including the
	 * transitioning node not being painted or in an unfocused tab.
	 *
	 * This TimeoutTransitionGroup instead uses a user-defined timeout to determine
	 * when it is a good time to remove the component. Currently there is only one
	 * timeout specified, but in the future it would be nice to be able to specify
	 * separate timeouts for enter and leave, in case the timeouts for those
	 * animations differ. Even nicer would be some sort of inspection of the CSS to
	 * automatically determine the duration of the animation or transition.
	 *
	 * This is adapted from Facebook's CSSTransitionGroup which is in the React
	 * addons and under the Apache 2.0 License.
	 */

	var React = __webpack_require__(170);

	var ReactTransitionGroup = React.addons.TransitionGroup;

	var TICK = 17;

	/**
	 * EVENT_NAME_MAP is used to determine which event fired when a
	 * transition/animation ends, based on the style property used to
	 * define that event.
	 */
	var EVENT_NAME_MAP = {
	    transitionend: {
	        transition: "transitionend",
	        WebkitTransition: "webkitTransitionEnd",
	        MozTransition: "mozTransitionEnd",
	        OTransition: "oTransitionEnd",
	        msTransition: "MSTransitionEnd"
	    },

	    animationend: {
	        animation: "animationend",
	        WebkitAnimation: "webkitAnimationEnd",
	        MozAnimation: "mozAnimationEnd",
	        OAnimation: "oAnimationEnd",
	        msAnimation: "MSAnimationEnd"
	    }
	};

	var endEvents = [];

	(function detectEvents() {
	    if (typeof window === "undefined") {
	        return;
	    }

	    var testEl = document.createElement("div");
	    var style = testEl.style;

	    // On some platforms, in particular some releases of Android 4.x, the
	    // un-prefixed "animation" and "transition" properties are defined on the
	    // style object but the events that fire will still be prefixed, so we need
	    // to check if the un-prefixed events are useable, and if not remove them
	    // from the map
	    if (!("AnimationEvent" in window)) {
	        delete EVENT_NAME_MAP.animationend.animation;
	    }

	    if (!("TransitionEvent" in window)) {
	        delete EVENT_NAME_MAP.transitionend.transition;
	    }

	    for (var baseEventName in EVENT_NAME_MAP) {
	        if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
	            var baseEvents = EVENT_NAME_MAP[baseEventName];
	            for (var styleName in baseEvents) {
	                if (styleName in style) {
	                    endEvents.push(baseEvents[styleName]);
	                    break;
	                }
	            }
	        }
	    }
	})();

	function animationSupported() {
	    return endEvents.length !== 0;
	}

	/**
	 * Functions for element class management to replace dependency on jQuery
	 * addClass, removeClass and hasClass
	 */
	function addClass(element, className) {
	    if (element.classList) {
	        element.classList.add(className);
	    } else if (!hasClass(element, className)) {
	        element.className = element.className + " " + className;
	    }
	    return element;
	}
	function removeClass(element, className) {
	    if (hasClass(className)) {
	        if (element.classList) {
	            element.classList.remove(className);
	        } else {
	            element.className = (" " + element.className + " ").replace(" " + className + " ", " ").trim();
	        }
	    }
	    return element;
	}
	function hasClass(element, className) {
	    if (element.classList) {
	        return element.classList.contains(className);
	    } else {
	        return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
	    }
	}

	var TimeoutTransitionGroupChild = React.createClass({
	    displayName: "TimeoutTransitionGroupChild",

	    transition: function transition(animationType, finishCallback) {
	        var node = this.getDOMNode();
	        var className = this.props.name + "-" + animationType;
	        var activeClassName = className + "-active";

	        var endListener = function endListener() {
	            removeClass(node, className);
	            removeClass(node, activeClassName);

	            // Usually this optional callback is used for informing an owner of
	            // a leave animation and telling it to remove the child.
	            finishCallback && finishCallback();
	        };

	        if (!animationSupported()) {
	            endListener();
	        } else {
	            if (animationType === "enter") {
	                this.animationTimeout = setTimeout(endListener, this.props.enterTimeout);
	            } else if (animationType === "leave") {
	                this.animationTimeout = setTimeout(endListener, this.props.leaveTimeout);
	            }
	        }

	        addClass(node, className);

	        // Need to do this to actually trigger a transition.
	        this.queueClass(activeClassName);
	    },

	    queueClass: function queueClass(className) {
	        this.classNameQueue.push(className);

	        if (!this.timeout) {
	            this.timeout = setTimeout(this.flushClassNameQueue, TICK);
	        }
	    },

	    flushClassNameQueue: function flushClassNameQueue() {
	        if (this.isMounted()) {
	            this.classNameQueue.forEach((function (name) {
	                addClass(this.getDOMNode(), name);
	            }).bind(this));
	        }
	        this.classNameQueue.length = 0;
	        this.timeout = null;
	    },

	    componentWillMount: function componentWillMount() {
	        this.classNameQueue = [];
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        if (this.timeout) {
	            clearTimeout(this.timeout);
	        }
	        if (this.animationTimeout) {
	            clearTimeout(this.animationTimeout);
	        }
	    },

	    componentWillEnter: function componentWillEnter(done) {
	        if (this.props.enter) {
	            this.transition("enter", done);
	        } else {
	            done();
	        }
	    },

	    componentWillLeave: function componentWillLeave(done) {
	        if (this.props.leave) {
	            this.transition("leave", done);
	        } else {
	            done();
	        }
	    },

	    render: function render() {
	        return React.Children.only(this.props.children);
	    }
	});

	var TimeoutTransitionGroup = React.createClass({
	    displayName: "TimeoutTransitionGroup",

	    propTypes: {
	        enterTimeout: React.PropTypes.number.isRequired,
	        leaveTimeout: React.PropTypes.number.isRequired,
	        transitionName: React.PropTypes.string.isRequired,
	        transitionEnter: React.PropTypes.bool,
	        transitionLeave: React.PropTypes.bool },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            transitionEnter: true,
	            transitionLeave: true
	        };
	    },

	    _wrapChild: function _wrapChild(child) {
	        return React.createElement(
	            TimeoutTransitionGroupChild,
	            {
	                enterTimeout: this.props.enterTimeout,
	                leaveTimeout: this.props.leaveTimeout,
	                name: this.props.transitionName,
	                enter: this.props.transitionEnter,
	                leave: this.props.transitionLeave },
	            child
	        );
	    },

	    render: function render() {
	        return React.createElement(ReactTransitionGroup, _extends({}, this.props, {
	            childFactory: this._wrapChild }));
	    }
	});

	module.exports = TimeoutTransitionGroup;

/***/ },

/***/ 107:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var ConfigStore = __webpack_require__(106)

	var Stars = React.createClass({displayName: "Stars",
	    getDefaultProps: function() {
	        return {
	            stars: 0
	        }
	    },
	    render: function() {

	        var percent = ((this.props.stars > 0 ? Math.min(this.props.stars, 5) / 5 : 0) * 100) + "%";

	        return (
	            React.createElement("svg", {viewBox: "0 0 73 12", width: "73", height: "12"}, 

	                React.createElement("path", {x: "0", y: "0", fill: "#"+ConfigStore.getDarkGreen(), d: "M8.6,3.8L6.5,0L4.4,3.8L0,4.6l3,3.1L2.5,12l4-1.8l4,1.8L10,7.7" + ' ' +
				"l3-3.1L8.6,3.8z M23.6,3.8L21.5,0l-2.1,3.8L15,4.6l3,3.1L17.5,12l4-1.8l4,1.8L25,7.7l3-3.1L23.6,3.8z M38.6,3.8L36.5,0l-2.1,3.8" + ' ' +
				"L30,4.6l3,3.1L32.5,12l4-1.8l4,1.8L40,7.7l3-3.1L38.6,3.8z M53.6,3.8L51.5,0l-2.1,3.8L45,4.6l3,3.1L47.5,12l4-1.8l4,1.8L55,7.7" + ' ' +
				"l3-3.1L53.6,3.8z M73,4.6l-4.4-0.8L66.5,0l-2.1,3.8L60,4.6l3,3.1L62.5,12l4-1.8l4,1.8L70,7.7L73,4.6z"}), 

	                React.createElement("svg", {width: percent, height: "100%", style: {overflow:"hidden"}}, 
	                    React.createElement("path", {x: "0", y: "0", fill: "#"+ConfigStore.getGreen(), d: "M8.6,3.8L6.5,0L4.4,3.8L0,4.6l3,3.1L2.5,12l4-1.8l4,1.8L10,7.7" + ' ' +
				"l3-3.1L8.6,3.8z M23.6,3.8L21.5,0l-2.1,3.8L15,4.6l3,3.1L17.5,12l4-1.8l4,1.8L25,7.7l3-3.1L23.6,3.8z M38.6,3.8L36.5,0l-2.1,3.8" + ' ' +
				"L30,4.6l3,3.1L32.5,12l4-1.8l4,1.8L40,7.7l3-3.1L38.6,3.8z M53.6,3.8L51.5,0l-2.1,3.8L45,4.6l3,3.1L47.5,12l4-1.8l4,1.8L55,7.7" + ' ' +
				"l3-3.1L53.6,3.8z M73,4.6l-4.4-0.8L66.5,0l-2.1,3.8L60,4.6l3,3.1L62.5,12l4-1.8l4,1.8L70,7.7L73,4.6z"})
	                )

	            )
	        )
	    }
	})

	module.exports = Stars;


/***/ },

/***/ 108:
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	var React = __webpack_require__(10)
	var reviewAction = __webpack_require__(4)

	var DeleteButton = React.createClass({displayName: "DeleteButton",
	    onDelete: function(event) {
	        reviewAction.deleteReview(this.props.reviewID)
	    },
	    render: function() {
	        return (
	            React.createElement("svg", {className: "pointer", onClick: this.onDelete, 
	                viewBox: "0 0 20 20", width: "20", height: "20"}, 
	                React.createElement("path", {"fill-rule": "evenodd", "clip-rule": "evenodd", fill: "#E12147", d: "M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10c5.5,0,10-4.5,10-10" + ' ' +
		"C20,4.5,15.5,0,10,0z M16.6,12.5H3.4v-5h13.1V12.5z"})
	            )
	        )
	    }
	})

	module.exports = DeleteButton;

/***/ },

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(229);


/***/ },

/***/ 225:
/***/ function(module, exports, __webpack_require__) {

	/*global module:true*/
	/*jslint nomen:true*/
	/**
	 * @module Utility
	 */
	(function (context, undefined) {
	    'use strict';

	    /**
	     * Truncate HTML string and keep tag safe.
	     *
	     * @method truncate
	     * @param {String} string string needs to be truncated
	     * @param {Number} maxLength length of truncated string
	     * @param {Object} options (optional)
	     * @param {Boolean} [options.keepImageTag] flag to specify if keep image tag, false by default
	     * @param {Boolean} [options.truncateLastWord] truncates last word, true by default
	     * @param {Number} [options.slop] tolerance when options.truncateLastWord is false before we give up and just truncate at the maxLength position, 10 by default (but not greater than maxLength)
	     * @param {Boolean|String} [options.ellipsis] omission symbol for truncated string, '...' by default
	     * @return {String} truncated string
	     */
	    function truncate(string, maxLength, options) {
	        var EMPTY_OBJECT = {},
	            EMPTY_STRING = '',
	            DEFAULT_TRUNCATE_SYMBOL = '...',
	            DEFAULT_SLOP = 10 > maxLength ? maxLength : 10,
	            EXCLUDE_TAGS = ['img'],         // non-closed tags
	            items = [],                     // stack for saving tags
	            total = 0,                      // record how many characters we traced so far
	            content = EMPTY_STRING,         // truncated text storage
	            KEY_VALUE_REGEX = '([\\w|-]+\\s*=\\s*"[^"]*"\\s*)*',
	            IS_CLOSE_REGEX = '\\s*\\/?\\s*',
	            CLOSE_REGEX = '\\s*\\/\\s*',
	            SELF_CLOSE_REGEX = new RegExp('<\\/?\\w+\\s*' + KEY_VALUE_REGEX + CLOSE_REGEX + '>'),
	            HTML_TAG_REGEX = new RegExp('<\\/?\\w+\\s*' + KEY_VALUE_REGEX + IS_CLOSE_REGEX + '>'),
	            URL_REGEX = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w\-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g, // Simple regexp
	            IMAGE_TAG_REGEX = new RegExp('<img\\s*' + KEY_VALUE_REGEX + IS_CLOSE_REGEX + '>'),
	            WORD_BREAK_REGEX = new RegExp('\\W+', 'g'),
	            matches = true,
	            result,
	            index,
	            tail,
	            tag,
	            selfClose;

	        /**
	         * Remove image tag
	         *
	         * @private
	         * @method _removeImageTag
	         * @param {String} string not-yet-processed string
	         * @return {String} string without image tags
	         */
	        function _removeImageTag(string) {
	            var match = IMAGE_TAG_REGEX.exec(string),
	                index,
	                len;

	            if (!match) {
	                return string;
	            }

	            index = match.index;
	            len = match[0].length;

	            return string.substring(0, index) + string.substring(index + len);
	        }

	        /**
	         * Dump all close tags and append to truncated content while reaching upperbound
	         *
	         * @private
	         * @method _dumpCloseTag
	         * @param {String[]} tags a list of tags which should be closed
	         * @return {String} well-formatted html
	         */
	        function _dumpCloseTag(tags) {
	            var html = '';

	            tags.reverse().forEach(function (tag, index) {
	                // dump non-excluded tags only
	                if (-1 === EXCLUDE_TAGS.indexOf(tag)) {
	                    html += '</' + tag + '>';
	                }
	            });

	            return html;
	        }

	        /**
	         * Process tag string to get pure tag name
	         *
	         * @private
	         * @method _getTag
	         * @param {String} string original html
	         * @return {String} tag name
	         */
	        function _getTag(string) {
	            var tail = string.indexOf(' ');

	            // TODO:
	            // we have to figure out how to handle non-well-formatted HTML case
	            if (-1 === tail) {
	                tail = string.indexOf('>');
	                if (-1 === tail) {
	                    throw new Error('HTML tag is not well-formed : ' + string);
	                }
	            }

	            return string.substring(1, tail);
	        }


	        /**
	         * Get the end position for String#substring()
	         *
	         * If options.truncateLastWord is FALSE, we try to the end position up to
	         * options.slop characters to avoid breaking in the middle of a word.
	         *
	         * @private
	         * @method _getEndPosition
	         * @param {String} string original html
	         * @param {Number} tailPos (optional) provided to avoid extending the slop into trailing HTML tag
	         * @return {Number} maxLength
	         */
	        function _getEndPosition (string, tailPos) {
	            var defaultPos = maxLength - total,
	                position = defaultPos,
	                isShort = defaultPos < options.slop,
	                slopPos = isShort ? defaultPos : options.slop - 1,
	                substr,
	                startSlice = isShort ? 0 : defaultPos - options.slop,
	                endSlice = tailPos || (defaultPos + options.slop),
	                result;

	            if (!options.truncateLastWord) {

	                substr = string.slice(startSlice, endSlice);

	                if (tailPos && substr.length <= tailPos) {
	                    position = substr.length;
	                }
	                else {
	                    while ((result = WORD_BREAK_REGEX.exec(substr)) !== null) {
	                        // a natural break position before the hard break position
	                        if (result.index < slopPos) {
	                            position = defaultPos - (slopPos - result.index);
	                            // keep seeking closer to the hard break position
	                            // unless a natural break is at position 0
	                            if (result.index === 0 && defaultPos <= 1) break;
	                        }
	                        // a natural break position exactly at the hard break position
	                        else if (result.index === slopPos) {
	                            position = defaultPos;
	                            break; // seek no more
	                        }
	                        // a natural break position after the hard break position
	                        else {
	                            position = defaultPos + (result.index - slopPos);
	                            break;  // seek no more
	                        }
	                    }
	                }
	                if (string.charAt(position - 1).match(/\s$/)) position--;
	            }
	            return position;
	        }

	        options = options || EMPTY_OBJECT;
	        options.ellipsis = (undefined !== options.ellipsis) ? options.ellipsis : DEFAULT_TRUNCATE_SYMBOL;
	        options.truncateLastWord = (undefined !== options.truncateLastWord) ? options.truncateLastWord : true;
	        options.slop = (undefined !== options.slop) ? options.slop : DEFAULT_SLOP;

	        while (matches) {
	            matches = HTML_TAG_REGEX.exec(string);

	            if (!matches) {
	                if (total >= maxLength) { break; }

	                matches = URL_REGEX.exec(string);
	                if (!matches || matches.index >= maxLength) {
	                    content += string.substring(0, _getEndPosition(string));
	                    break;
	                }

	                while (matches) {
	                    result = matches[0];
	                    index = matches.index;
	                    content += string.substring(0, (index + result.length) - total);
	                    string = string.substring(index + result.length);
	                    matches = URL_REGEX.exec(string);
	                }
	                break;
	            }

	            result = matches[0];
	            index = matches.index;

	            if (total + index > maxLength) {
	                // exceed given `maxLength`, dump everything to clear stack
	                content += string.substring(0, _getEndPosition(string, index));
	                break;
	            } else {
	                total += index;
	                content += string.substring(0, index);
	            }

	            if ('/' === result[1]) {
	                // move out open tag
	                items.pop();
	                selfClose=null;
	            } else {
	                selfClose = SELF_CLOSE_REGEX.exec(result);
	                if (!selfClose) {
	                    tag = _getTag(result);

	                    items.push(tag);
	                }
	            }

	            if (selfClose) {
	                content += selfClose[0];
	            } else {
	                content += result;
	            }
	            string = string.substring(index + result.length);
	        }

	        if (string.length > maxLength - total && options.ellipsis) {
	            content += options.ellipsis;
	        }
	        content += _dumpCloseTag(items);

	        if (!options.keepImageTag) {
	            content = _removeImageTag(content);
	        }

	        return content;
	    }

	    if ('undefined' !== typeof module && module.exports) {
	        module.exports = truncate;
	    } else {
	        context.truncate = truncate;
	    }
	}(this));


/***/ },

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

	(function (root, pluralize) {
	  /* istanbul ignore else */
	  if (true) {
	    // Node.
	    module.exports = pluralize();
	  } else if (typeof define === 'function' && define.amd) {
	    // AMD, registers as an anonymous module.
	    define(function () {
	      return pluralize();
	    });
	  } else {
	    // Browser global.
	    root.pluralize = pluralize();
	  }
	})(this, function () {
	  // Rule storage - pluralize and singularize need to be run sequentially,
	  // while other rules can be optimized using an object for instant lookups.
	  var pluralRules      = [];
	  var singularRules    = [];
	  var uncountables     = {};
	  var irregularPlurals = {};
	  var irregularSingles = {};

	  /**
	   * Title case a string.
	   *
	   * @param  {string} str
	   * @return {string}
	   */
	  function toTitleCase (str) {
	    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
	  }

	  /**
	   * Sanitize a pluralization rule to a usable regular expression.
	   *
	   * @param  {(RegExp|string)} rule
	   * @return {RegExp}
	   */
	  function sanitizeRule (rule) {
	    if (typeof rule === 'string') {
	      return new RegExp('^' + rule + '$', 'i');
	    }

	    return rule;
	  }

	  /**
	   * Pass in a word token to produce a function that can replicate the case on
	   * another word.
	   *
	   * @param  {string}   word
	   * @param  {string}   token
	   * @return {Function}
	   */
	  function restoreCase (word, token) {
	    // Upper cased words. E.g. "HELLO".
	    if (word === word.toUpperCase()) {
	      return token.toUpperCase();
	    }

	    // Title cased words. E.g. "Title".
	    if (word[0] === word[0].toUpperCase()) {
	      return toTitleCase(token);
	    }

	    // Lower cased words. E.g. "test".
	    return token.toLowerCase();
	  }

	  /**
	   * Interpolate a regexp string.
	   *
	   * @param  {[type]} str  [description]
	   * @param  {[type]} args [description]
	   * @return {[type]}      [description]
	   */
	  function interpolate (str, args) {
	    return str.replace(/\$(\d{1,2})/g, function (match, index) {
	      return args[index] || '';
	    });
	  }

	  /**
	   * Sanitize a word by passing in the word and sanitization rules.
	   *
	   * @param  {String}   word
	   * @param  {Array}    collection
	   * @return {String}
	   */
	  function sanitizeWord (word, collection) {
	    // Empty string or doesn't need fixing.
	    if (!word.length || uncountables.hasOwnProperty(word)) {
	      return word;
	    }

	    var len = collection.length;

	    // Iterate over the sanitization rules and use the first one to match.
	    while (len--) {
	      var rule = collection[len];

	      // If the rule passes, return the replacement.
	      if (rule[0].test(word)) {
	        return word.replace(rule[0], function (match, index, word) {
	          var result = interpolate(rule[1], arguments);

	          if (match === '') {
	            return restoreCase(word[index - 1], result);
	          }

	          return restoreCase(match, result);
	        });
	      }
	    }

	    return word;
	  }

	  /**
	   * Replace a word with the updated word.
	   *
	   * @param  {Object}   replaceMap
	   * @param  {Object}   keepMap
	   * @param  {Array}    rules
	   * @return {Function}
	   */
	  function replaceWord (replaceMap, keepMap, rules) {
	    return function (word) {
	      // Get the correct token and case restoration functions.
	      var token = word.toLowerCase();

	      // Check against the keep object map.
	      if (keepMap.hasOwnProperty(token)) {
	        return restoreCase(word, token);
	      }

	      // Check against the replacement map for a direct word replacement.
	      if (replaceMap.hasOwnProperty(token)) {
	        return restoreCase(word, replaceMap[token]);
	      }

	      // Run all the rules against the word.
	      return sanitizeWord(word, rules);
	    };
	  }

	  /**
	   * Pluralize or singularize a word based on the passed in count.
	   *
	   * @param  {String}  word
	   * @param  {Number}  count
	   * @param  {Boolean} inclusive
	   * @return {String}
	   */
	  function pluralize (word, count, inclusive) {
	    var pluralized = count === 1 ?
	      pluralize.singular(word) : pluralize.plural(word);

	    return (inclusive ? count + ' ' : '') + pluralized;
	  }

	  /**
	   * Pluralize a word.
	   *
	   * @type {Function}
	   */
	  pluralize.plural = replaceWord(
	    irregularSingles, irregularPlurals, pluralRules
	  );

	  /**
	   * Singularize a word.
	   *
	   * @type {Function}
	   */
	  pluralize.singular = replaceWord(
	    irregularPlurals, irregularSingles, singularRules
	  );

	  /**
	   * Add a pluralization rule to the collection.
	   *
	   * @param {(string|RegExp)} rule
	   * @param {string}          replacement
	   */
	  pluralize.addPluralRule = function (rule, replacement) {
	    pluralRules.push([sanitizeRule(rule), replacement]);
	  };

	  /**
	   * Add a singularization rule to the collection.
	   *
	   * @param {(string|RegExp)} rule
	   * @param {string}          replacement
	   */
	  pluralize.addSingularRule = function (rule, replacement) {
	    singularRules.push([sanitizeRule(rule), replacement]);
	  };

	  /**
	   * Add an uncountable word rule.
	   *
	   * @param {(string|RegExp)} word
	   */
	  pluralize.addUncountableRule = function (word) {
	    if (typeof word === 'string') {
	      return uncountables[word.toLowerCase()] = true;
	    }

	    // Set singular and plural references for the word.
	    pluralize.addPluralRule(word, '$0');
	    pluralize.addSingularRule(word, '$0');
	  };

	  /**
	   * Add an irregular word definition.
	   *
	   * @param {String} single
	   * @param {String} plural
	   */
	  pluralize.addIrregularRule = function (single, plural) {
	    plural = plural.toLowerCase();
	    single = single.toLowerCase();

	    irregularSingles[single] = plural;
	    irregularPlurals[plural] = single;
	  };

	  /**
	   * Irregular rules.
	   */
	  [
	    // Pronouns.
	    ['I',        'we'],
	    ['me',       'us'],
	    ['he',       'they'],
	    ['she',      'they'],
	    ['them',     'them'],
	    ['myself',   'ourselves'],
	    ['yourself', 'yourselves'],
	    ['itself',   'themselves'],
	    ['herself',  'themselves'],
	    ['himself',  'themselves'],
	    ['themself', 'themselves'],
	    ['this',     'these'],
	    ['that',     'those'],
	    // Words ending in with a consonant and `o`.
	    ['echo', 'echoes'],
	    ['dingo', 'dingoes'],
	    ['volcano', 'volcanoes'],
	    ['tornado', 'tornadoes'],
	    ['torpedo', 'torpedoes'],
	    // Ends with `us`.
	    ['genus',  'genera'],
	    ['viscus', 'viscera'],
	    // Ends with `ma`.
	    ['stigma',   'stigmata'],
	    ['stoma',    'stomata'],
	    ['dogma',    'dogmata'],
	    ['lemma',    'lemmata'],
	    ['schema',   'schemata'],
	    ['anathema', 'anathemata'],
	    // Other irregular rules.
	    ['ox',      'oxen'],
	    ['axe',     'axes'],
	    ['die',     'dice'],
	    ['yes',     'yeses'],
	    ['foot',    'feet'],
	    ['eave',    'eaves'],
	    ['goose',   'geese'],
	    ['tooth',   'teeth'],
	    ['quiz',    'quizzes'],
	    ['human',   'humans'],
	    ['proof',   'proofs'],
	    ['carve',   'carves'],
	    ['valve',   'valves'],
	    ['thief',   'thieves'],
	    ['genie',   'genies'],
	    ['groove',  'grooves'],
	    ['pickaxe', 'pickaxes'],
	    ['whiskey', 'whiskies']
	  ].forEach(function (rule) {
	    return pluralize.addIrregularRule(rule[0], rule[1]);
	  });

	  /**
	   * Pluralization rules.
	   */
	  [
	    [/s?$/i, 's'],
	    [/([^aeiou]ese)$/i, '$1'],
	    [/(ax|test)is$/i, '$1es'],
	    [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
	    [/(e[mn]u)s?$/i, '$1s'],
	    [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
	    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
	    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
	    [/(seraph|cherub)(?:im)?$/i, '$1im'],
	    [/(her|at|gr)o$/i, '$1oes'],
	    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
	    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)(?:a|on)$/i, '$1a'],
	    [/sis$/i, 'ses'],
	    [/(?:(i)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
	    [/([^aeiouy]|qu)y$/i, '$1ies'],
	    [/([^ch][ieo][ln])ey$/i, '$1ies'],
	    [/(x|ch|ss|sh|zz)$/i, '$1es'],
	    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
	    [/(m|l)(?:ice|ouse)$/i, '$1ice'],
	    [/(pe)(?:rson|ople)$/i, '$1ople'],
	    [/(child)(?:ren)?$/i, '$1ren'],
	    [/eaux$/i, '$0'],
	    [/m[ae]n$/i, 'men']
	  ].forEach(function (rule) {
	    return pluralize.addPluralRule(rule[0], rule[1]);
	  });

	  /**
	   * Singularization rules.
	   */
	  [
	    [/s$/i, ''],
	    [/(ss)$/i, '$1'],
	    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(?:sis|ses)$/i, '$1sis'],
	    [/(^analy)(?:sis|ses)$/i, '$1sis'],
	    [/([^aeflor])ves$/i, '$1fe'],
	    [/(hive|tive|dr?ive)s$/i, '$1'],
	    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
	    [/([^aeiouy]|qu)ies$/i, '$1y'],
	    [/(^[pl]|zomb|^(?:neck)?t|[aeo][lt]|cut)ies$/i, '$1ie'],
	    [/([^c][eor]n|smil)ies$/i, '$1ey'],
	    [/(m|l)ice$/i, '$1ouse'],
	    [/(seraph|cherub)im$/i, '$1'],
	    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
	    [/(e[mn]u)s?$/i, '$1'],
	    [/(movie|twelve)s$/i, '$1'],
	    [/(cris|test|diagnos)(?:is|es)$/i, '$1is'],
	    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
	    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)a$/i, '$1um'],
	    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)a$/i, '$1on'],
	    [/(alumn|alg|vertebr)ae$/i, '$1a'],
	    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
	    [/(matr|append)ices$/i, '$1ix'],
	    [/(pe)(rson|ople)$/i, '$1rson'],
	    [/(child)ren$/i, '$1'],
	    [/(eau)x?$/i, '$1'],
	    [/men$/i, 'man']
	  ].forEach(function (rule) {
	    return pluralize.addSingularRule(rule[0], rule[1]);
	  });

	  /**
	   * Uncountable rules.
	   */
	  [
	    // Singular words with no plurals.
	    'advice',
	    'agenda',
	    'bison',
	    'bream',
	    'buffalo',
	    'carp',
	    'chassis',
	    'cod',
	    'cooperation',
	    'corps',
	    'digestion',
	    'debris',
	    'diabetes',
	    'energy',
	    'equipment',
	    'elk',
	    'excretion',
	    'expertise',
	    'flounder',
	    'gallows',
	    'graffiti',
	    'headquarters',
	    'health',
	    'herpes',
	    'highjinks',
	    'homework',
	    'information',
	    'jeans',
	    'justice',
	    'kudos',
	    'labour',
	    'machinery',
	    'mackerel',
	    'media',
	    'mews',
	    'moose',
	    'news',
	    'pike',
	    'plankton',
	    'pliers',
	    'pollution',
	    'premises',
	    'rain',
	    'rice',
	    'salmon',
	    'scissors',
	    'series',
	    'sewage',
	    'shambles',
	    'shrimp',
	    'species',
	    'staff',
	    'swine',
	    'trout',
	    'tuna',
	    'whiting',
	    'wildebeest',
	    'wildlife',
	    // Regexes.
	    /pox$/i, // "chickpox", "smallpox"
	    /ois$/i,
	    /deer$/i, // "deer", "reindeer"
	    /fish$/i, // "fish", "blowfish", "angelfish"
	    /sheep$/i,
	    /measles$/i,
	    /[^aeiou]ese$/i // "chinese", "japanese"
	  ].forEach(pluralize.addUncountableRule);

	  return pluralize;
	});


/***/ },

/***/ 229:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactWithAddons
	 */

	/**
	 * This module exists purely in the open source project, and is meant as a way
	 * to create a separate standalone build of React. This build has "addons", or
	 * functionality we've built and think might be useful but doesn't have a good
	 * place to live inside React core.
	 */

	"use strict";

	var LinkedStateMixin = __webpack_require__(325);
	var React = __webpack_require__(19);
	var ReactComponentWithPureRenderMixin =
	  __webpack_require__(326);
	var ReactCSSTransitionGroup = __webpack_require__(327);
	var ReactTransitionGroup = __webpack_require__(328);
	var ReactUpdates = __webpack_require__(118);

	var cx = __webpack_require__(329);
	var cloneWithProps = __webpack_require__(330);
	var update = __webpack_require__(331);

	React.addons = {
	  CSSTransitionGroup: ReactCSSTransitionGroup,
	  LinkedStateMixin: LinkedStateMixin,
	  PureRenderMixin: ReactComponentWithPureRenderMixin,
	  TransitionGroup: ReactTransitionGroup,

	  batchedUpdates: ReactUpdates.batchedUpdates,
	  classSet: cx,
	  cloneWithProps: cloneWithProps,
	  update: update
	};

	if ("production" !== process.env.NODE_ENV) {
	  React.addons.Perf = __webpack_require__(158);
	  React.addons.TestUtils = __webpack_require__(332);
	}

	module.exports = React;


/***/ },

/***/ 325:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule LinkedStateMixin
	 * @typechecks static-only
	 */

	"use strict";

	var ReactLink = __webpack_require__(339);
	var ReactStateSetters = __webpack_require__(340);

	/**
	 * A simple mixin around ReactLink.forState().
	 */
	var LinkedStateMixin = {
	  /**
	   * Create a ReactLink that's linked to part of this component's state. The
	   * ReactLink will have the current value of this.state[key] and will call
	   * setState() when a change is requested.
	   *
	   * @param {string} key state key to update. Note: you may want to use keyOf()
	   * if you're using Google Closure Compiler advanced mode.
	   * @return {ReactLink} ReactLink instance linking to the state.
	   */
	  linkState: function(key) {
	    return new ReactLink(
	      this.state[key],
	      ReactStateSetters.createStateKeySetter(this, key)
	    );
	  }
	};

	module.exports = LinkedStateMixin;


/***/ },

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	* @providesModule ReactComponentWithPureRenderMixin
	*/

	"use strict";

	var shallowEqual = __webpack_require__(211);

	/**
	 * If your React component's render function is "pure", e.g. it will render the
	 * same result given the same props and state, provide this Mixin for a
	 * considerable performance boost.
	 *
	 * Most React components have pure render functions.
	 *
	 * Example:
	 *
	 *   var ReactComponentWithPureRenderMixin =
	 *     require('ReactComponentWithPureRenderMixin');
	 *   React.createClass({
	 *     mixins: [ReactComponentWithPureRenderMixin],
	 *
	 *     render: function() {
	 *       return <div className={this.props.className}>foo</div>;
	 *     }
	 *   });
	 *
	 * Note: This only checks shallow equality for props and state. If these contain
	 * complex data structures this mixin may have false-negatives for deeper
	 * differences. Only mixin to components which have simple props and state, or
	 * use `forceUpdate()` when you know deep data structures have changed.
	 */
	var ReactComponentWithPureRenderMixin = {
	  shouldComponentUpdate: function(nextProps, nextState) {
	    return !shallowEqual(this.props, nextProps) ||
	           !shallowEqual(this.state, nextState);
	  }
	};

	module.exports = ReactComponentWithPureRenderMixin;


/***/ },

/***/ 327:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * @providesModule ReactCSSTransitionGroup
	 */

	"use strict";

	var React = __webpack_require__(19);

	var assign = __webpack_require__(53);

	var ReactTransitionGroup = React.createFactory(
	  __webpack_require__(328)
	);
	var ReactCSSTransitionGroupChild = React.createFactory(
	  __webpack_require__(341)
	);

	var ReactCSSTransitionGroup = React.createClass({
	  displayName: 'ReactCSSTransitionGroup',

	  propTypes: {
	    transitionName: React.PropTypes.string.isRequired,
	    transitionEnter: React.PropTypes.bool,
	    transitionLeave: React.PropTypes.bool
	  },

	  getDefaultProps: function() {
	    return {
	      transitionEnter: true,
	      transitionLeave: true
	    };
	  },

	  _wrapChild: function(child) {
	    // We need to provide this childFactory so that
	    // ReactCSSTransitionGroupChild can receive updates to name, enter, and
	    // leave while it is leaving.
	    return ReactCSSTransitionGroupChild(
	      {
	        name: this.props.transitionName,
	        enter: this.props.transitionEnter,
	        leave: this.props.transitionLeave
	      },
	      child
	    );
	  },

	  render: function() {
	    return (
	      ReactTransitionGroup(
	        assign({}, this.props, {childFactory: this._wrapChild})
	      )
	    );
	  }
	});

	module.exports = ReactCSSTransitionGroup;


/***/ },

/***/ 328:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactTransitionGroup
	 */

	"use strict";

	var React = __webpack_require__(19);
	var ReactTransitionChildMapping = __webpack_require__(342);

	var assign = __webpack_require__(53);
	var cloneWithProps = __webpack_require__(330);
	var emptyFunction = __webpack_require__(164);

	var ReactTransitionGroup = React.createClass({
	  displayName: 'ReactTransitionGroup',

	  propTypes: {
	    component: React.PropTypes.any,
	    childFactory: React.PropTypes.func
	  },

	  getDefaultProps: function() {
	    return {
	      component: 'span',
	      childFactory: emptyFunction.thatReturnsArgument
	    };
	  },

	  getInitialState: function() {
	    return {
	      children: ReactTransitionChildMapping.getChildMapping(this.props.children)
	    };
	  },

	  componentWillReceiveProps: function(nextProps) {
	    var nextChildMapping = ReactTransitionChildMapping.getChildMapping(
	      nextProps.children
	    );
	    var prevChildMapping = this.state.children;

	    this.setState({
	      children: ReactTransitionChildMapping.mergeChildMappings(
	        prevChildMapping,
	        nextChildMapping
	      )
	    });

	    var key;

	    for (key in nextChildMapping) {
	      var hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
	      if (nextChildMapping[key] && !hasPrev &&
	          !this.currentlyTransitioningKeys[key]) {
	        this.keysToEnter.push(key);
	      }
	    }

	    for (key in prevChildMapping) {
	      var hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);
	      if (prevChildMapping[key] && !hasNext &&
	          !this.currentlyTransitioningKeys[key]) {
	        this.keysToLeave.push(key);
	      }
	    }

	    // If we want to someday check for reordering, we could do it here.
	  },

	  componentWillMount: function() {
	    this.currentlyTransitioningKeys = {};
	    this.keysToEnter = [];
	    this.keysToLeave = [];
	  },

	  componentDidUpdate: function() {
	    var keysToEnter = this.keysToEnter;
	    this.keysToEnter = [];
	    keysToEnter.forEach(this.performEnter);

	    var keysToLeave = this.keysToLeave;
	    this.keysToLeave = [];
	    keysToLeave.forEach(this.performLeave);
	  },

	  performEnter: function(key) {
	    this.currentlyTransitioningKeys[key] = true;

	    var component = this.refs[key];

	    if (component.componentWillEnter) {
	      component.componentWillEnter(
	        this._handleDoneEntering.bind(this, key)
	      );
	    } else {
	      this._handleDoneEntering(key);
	    }
	  },

	  _handleDoneEntering: function(key) {
	    var component = this.refs[key];
	    if (component.componentDidEnter) {
	      component.componentDidEnter();
	    }

	    delete this.currentlyTransitioningKeys[key];

	    var currentChildMapping = ReactTransitionChildMapping.getChildMapping(
	      this.props.children
	    );

	    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
	      // This was removed before it had fully entered. Remove it.
	      this.performLeave(key);
	    }
	  },

	  performLeave: function(key) {
	    this.currentlyTransitioningKeys[key] = true;

	    var component = this.refs[key];
	    if (component.componentWillLeave) {
	      component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
	    } else {
	      // Note that this is somewhat dangerous b/c it calls setState()
	      // again, effectively mutating the component before all the work
	      // is done.
	      this._handleDoneLeaving(key);
	    }
	  },

	  _handleDoneLeaving: function(key) {
	    var component = this.refs[key];

	    if (component.componentDidLeave) {
	      component.componentDidLeave();
	    }

	    delete this.currentlyTransitioningKeys[key];

	    var currentChildMapping = ReactTransitionChildMapping.getChildMapping(
	      this.props.children
	    );

	    if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
	      // This entered again before it fully left. Add it again.
	      this.performEnter(key);
	    } else {
	      var newChildren = assign({}, this.state.children);
	      delete newChildren[key];
	      this.setState({children: newChildren});
	    }
	  },

	  render: function() {
	    // TODO: we could get rid of the need for the wrapper node
	    // by cloning a single child
	    var childrenToRender = {};
	    for (var key in this.state.children) {
	      var child = this.state.children[key];
	      if (child) {
	        // You may need to apply reactive updates to a child as it is leaving.
	        // The normal React way to do it won't work since the child will have
	        // already been removed. In case you need this behavior you can provide
	        // a childFactory function to wrap every child, even the ones that are
	        // leaving.
	        childrenToRender[key] = cloneWithProps(
	          this.props.childFactory(child),
	          {ref: key}
	        );
	      }
	    }
	    return React.createElement(
	      this.props.component,
	      this.props,
	      childrenToRender
	    );
	  }
	});

	module.exports = ReactTransitionGroup;


/***/ },

/***/ 329:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule cx
	 */

	/**
	 * This function is used to mark string literals representing CSS class names
	 * so that they can be transformed statically. This allows for modularization
	 * and minification of CSS class names.
	 *
	 * In static_upstream, this function is actually implemented, but it should
	 * eventually be replaced with something more descriptive, and the transform
	 * that is used in the main stack should be ported for use elsewhere.
	 *
	 * @param string|object className to modularize, or an object of key/values.
	 *                      In the object case, the values are conditions that
	 *                      determine if the className keys should be included.
	 * @param [string ...]  Variable list of classNames in the string case.
	 * @return string       Renderable space-separated CSS className.
	 */
	function cx(classNames) {
	  if (typeof classNames == 'object') {
	    return Object.keys(classNames).filter(function(className) {
	      return classNames[className];
	    }).join(' ');
	  } else {
	    return Array.prototype.join.call(arguments, ' ');
	  }
	}

	module.exports = cx;


/***/ },

/***/ 330:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * @providesModule cloneWithProps
	 */

	"use strict";

	var ReactElement = __webpack_require__(40);
	var ReactPropTransferer = __webpack_require__(122);

	var keyOf = __webpack_require__(126);
	var warning = __webpack_require__(112);

	var CHILDREN_PROP = keyOf({children: null});

	/**
	 * Sometimes you want to change the props of a child passed to you. Usually
	 * this is to add a CSS class.
	 *
	 * @param {object} child child component you'd like to clone
	 * @param {object} props props you'd like to modify. They will be merged
	 * as if you used `transferPropsTo()`.
	 * @return {object} a clone of child with props merged in.
	 */
	function cloneWithProps(child, props) {
	  if ("production" !== process.env.NODE_ENV) {
	    ("production" !== process.env.NODE_ENV ? warning(
	      !child.ref,
	      'You are calling cloneWithProps() on a child with a ref. This is ' +
	      'dangerous because you\'re creating a new child which will not be ' +
	      'added as a ref to its parent.'
	    ) : null);
	  }

	  var newProps = ReactPropTransferer.mergeProps(props, child.props);

	  // Use `child.props.children` if it is provided.
	  if (!newProps.hasOwnProperty(CHILDREN_PROP) &&
	      child.props.hasOwnProperty(CHILDREN_PROP)) {
	    newProps.children = child.props.children;
	  }

	  // The current API doesn't retain _owner and _context, which is why this
	  // doesn't use ReactElement.cloneAndReplaceProps.
	  return ReactElement.createElement(child.type, newProps);
	}

	module.exports = cloneWithProps;


/***/ },

/***/ 331:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule update
	 */

	"use strict";

	var assign = __webpack_require__(53);
	var keyOf = __webpack_require__(126);
	var invariant = __webpack_require__(114);

	function shallowCopy(x) {
	  if (Array.isArray(x)) {
	    return x.concat();
	  } else if (x && typeof x === 'object') {
	    return assign(new x.constructor(), x);
	  } else {
	    return x;
	  }
	}

	var COMMAND_PUSH = keyOf({$push: null});
	var COMMAND_UNSHIFT = keyOf({$unshift: null});
	var COMMAND_SPLICE = keyOf({$splice: null});
	var COMMAND_SET = keyOf({$set: null});
	var COMMAND_MERGE = keyOf({$merge: null});
	var COMMAND_APPLY = keyOf({$apply: null});

	var ALL_COMMANDS_LIST = [
	  COMMAND_PUSH,
	  COMMAND_UNSHIFT,
	  COMMAND_SPLICE,
	  COMMAND_SET,
	  COMMAND_MERGE,
	  COMMAND_APPLY
	];

	var ALL_COMMANDS_SET = {};

	ALL_COMMANDS_LIST.forEach(function(command) {
	  ALL_COMMANDS_SET[command] = true;
	});

	function invariantArrayCase(value, spec, command) {
	  ("production" !== process.env.NODE_ENV ? invariant(
	    Array.isArray(value),
	    'update(): expected target of %s to be an array; got %s.',
	    command,
	    value
	  ) : invariant(Array.isArray(value)));
	  var specValue = spec[command];
	  ("production" !== process.env.NODE_ENV ? invariant(
	    Array.isArray(specValue),
	    'update(): expected spec of %s to be an array; got %s. ' +
	    'Did you forget to wrap your parameter in an array?',
	    command,
	    specValue
	  ) : invariant(Array.isArray(specValue)));
	}

	function update(value, spec) {
	  ("production" !== process.env.NODE_ENV ? invariant(
	    typeof spec === 'object',
	    'update(): You provided a key path to update() that did not contain one ' +
	    'of %s. Did you forget to include {%s: ...}?',
	    ALL_COMMANDS_LIST.join(', '),
	    COMMAND_SET
	  ) : invariant(typeof spec === 'object'));

	  if (spec.hasOwnProperty(COMMAND_SET)) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      Object.keys(spec).length === 1,
	      'Cannot have more than one key in an object with %s',
	      COMMAND_SET
	    ) : invariant(Object.keys(spec).length === 1));

	    return spec[COMMAND_SET];
	  }

	  var nextValue = shallowCopy(value);

	  if (spec.hasOwnProperty(COMMAND_MERGE)) {
	    var mergeObj = spec[COMMAND_MERGE];
	    ("production" !== process.env.NODE_ENV ? invariant(
	      mergeObj && typeof mergeObj === 'object',
	      'update(): %s expects a spec of type \'object\'; got %s',
	      COMMAND_MERGE,
	      mergeObj
	    ) : invariant(mergeObj && typeof mergeObj === 'object'));
	    ("production" !== process.env.NODE_ENV ? invariant(
	      nextValue && typeof nextValue === 'object',
	      'update(): %s expects a target of type \'object\'; got %s',
	      COMMAND_MERGE,
	      nextValue
	    ) : invariant(nextValue && typeof nextValue === 'object'));
	    assign(nextValue, spec[COMMAND_MERGE]);
	  }

	  if (spec.hasOwnProperty(COMMAND_PUSH)) {
	    invariantArrayCase(value, spec, COMMAND_PUSH);
	    spec[COMMAND_PUSH].forEach(function(item) {
	      nextValue.push(item);
	    });
	  }

	  if (spec.hasOwnProperty(COMMAND_UNSHIFT)) {
	    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
	    spec[COMMAND_UNSHIFT].forEach(function(item) {
	      nextValue.unshift(item);
	    });
	  }

	  if (spec.hasOwnProperty(COMMAND_SPLICE)) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      Array.isArray(value),
	      'Expected %s target to be an array; got %s',
	      COMMAND_SPLICE,
	      value
	    ) : invariant(Array.isArray(value)));
	    ("production" !== process.env.NODE_ENV ? invariant(
	      Array.isArray(spec[COMMAND_SPLICE]),
	      'update(): expected spec of %s to be an array of arrays; got %s. ' +
	      'Did you forget to wrap your parameters in an array?',
	      COMMAND_SPLICE,
	      spec[COMMAND_SPLICE]
	    ) : invariant(Array.isArray(spec[COMMAND_SPLICE])));
	    spec[COMMAND_SPLICE].forEach(function(args) {
	      ("production" !== process.env.NODE_ENV ? invariant(
	        Array.isArray(args),
	        'update(): expected spec of %s to be an array of arrays; got %s. ' +
	        'Did you forget to wrap your parameters in an array?',
	        COMMAND_SPLICE,
	        spec[COMMAND_SPLICE]
	      ) : invariant(Array.isArray(args)));
	      nextValue.splice.apply(nextValue, args);
	    });
	  }

	  if (spec.hasOwnProperty(COMMAND_APPLY)) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      typeof spec[COMMAND_APPLY] === 'function',
	      'update(): expected spec of %s to be a function; got %s.',
	      COMMAND_APPLY,
	      spec[COMMAND_APPLY]
	    ) : invariant(typeof spec[COMMAND_APPLY] === 'function'));
	    nextValue = spec[COMMAND_APPLY](nextValue);
	  }

	  for (var k in spec) {
	    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
	      nextValue[k] = update(value[k], spec[k]);
	    }
	  }

	  return nextValue;
	}

	module.exports = update;


/***/ },

/***/ 332:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactTestUtils
	 */

	"use strict";

	var EventConstants = __webpack_require__(113);
	var EventPluginHub = __webpack_require__(189);
	var EventPropagators = __webpack_require__(193);
	var React = __webpack_require__(19);
	var ReactElement = __webpack_require__(40);
	var ReactBrowserEventEmitter = __webpack_require__(132);
	var ReactMount = __webpack_require__(47);
	var ReactTextComponent = __webpack_require__(52);
	var ReactUpdates = __webpack_require__(118);
	var SyntheticEvent = __webpack_require__(195);

	var assign = __webpack_require__(53);

	var topLevelTypes = EventConstants.topLevelTypes;

	function Event(suffix) {}

	/**
	 * @class ReactTestUtils
	 */

	/**
	 * Todo: Support the entire DOM.scry query syntax. For now, these simple
	 * utilities will suffice for testing purposes.
	 * @lends ReactTestUtils
	 */
	var ReactTestUtils = {
	  renderIntoDocument: function(instance) {
	    var div = document.createElement('div');
	    // None of our tests actually require attaching the container to the
	    // DOM, and doing so creates a mess that we rely on test isolation to
	    // clean up, so we're going to stop honoring the name of this method
	    // (and probably rename it eventually) if no problems arise.
	    // document.documentElement.appendChild(div);
	    return React.render(instance, div);
	  },

	  isElement: function(element) {
	    return ReactElement.isValidElement(element);
	  },

	  isElementOfType: function(inst, convenienceConstructor) {
	    return (
	      ReactElement.isValidElement(inst) &&
	      inst.type === convenienceConstructor.type
	    );
	  },

	  isDOMComponent: function(inst) {
	    return !!(inst && inst.mountComponent && inst.tagName);
	  },

	  isDOMComponentElement: function(inst) {
	    return !!(inst &&
	              ReactElement.isValidElement(inst) &&
	              !!inst.tagName);
	  },

	  isCompositeComponent: function(inst) {
	    return typeof inst.render === 'function' &&
	           typeof inst.setState === 'function';
	  },

	  isCompositeComponentWithType: function(inst, type) {
	    return !!(ReactTestUtils.isCompositeComponent(inst) &&
	             (inst.constructor === type.type));
	  },

	  isCompositeComponentElement: function(inst) {
	    if (!ReactElement.isValidElement(inst)) {
	      return false;
	    }
	    // We check the prototype of the type that will get mounted, not the
	    // instance itself. This is a future proof way of duck typing.
	    var prototype = inst.type.prototype;
	    return (
	      typeof prototype.render === 'function' &&
	      typeof prototype.setState === 'function'
	    );
	  },

	  isCompositeComponentElementWithType: function(inst, type) {
	    return !!(ReactTestUtils.isCompositeComponentElement(inst) &&
	             (inst.constructor === type));
	  },

	  isTextComponent: function(inst) {
	    return inst instanceof ReactTextComponent.type;
	  },

	  findAllInRenderedTree: function(inst, test) {
	    if (!inst) {
	      return [];
	    }
	    var ret = test(inst) ? [inst] : [];
	    if (ReactTestUtils.isDOMComponent(inst)) {
	      var renderedChildren = inst._renderedChildren;
	      var key;
	      for (key in renderedChildren) {
	        if (!renderedChildren.hasOwnProperty(key)) {
	          continue;
	        }
	        ret = ret.concat(
	          ReactTestUtils.findAllInRenderedTree(renderedChildren[key], test)
	        );
	      }
	    } else if (ReactTestUtils.isCompositeComponent(inst)) {
	      ret = ret.concat(
	        ReactTestUtils.findAllInRenderedTree(inst._renderedComponent, test)
	      );
	    }
	    return ret;
	  },

	  /**
	   * Finds all instance of components in the rendered tree that are DOM
	   * components with the class name matching `className`.
	   * @return an array of all the matches.
	   */
	  scryRenderedDOMComponentsWithClass: function(root, className) {
	    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
	      var instClassName = inst.props.className;
	      return ReactTestUtils.isDOMComponent(inst) && (
	        instClassName &&
	        (' ' + instClassName + ' ').indexOf(' ' + className + ' ') !== -1
	      );
	    });
	  },

	  /**
	   * Like scryRenderedDOMComponentsWithClass but expects there to be one result,
	   * and returns that one result, or throws exception if there is any other
	   * number of matches besides one.
	   * @return {!ReactDOMComponent} The one match.
	   */
	  findRenderedDOMComponentWithClass: function(root, className) {
	    var all =
	      ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
	    if (all.length !== 1) {
	      throw new Error('Did not find exactly one match for class:' + className);
	    }
	    return all[0];
	  },


	  /**
	   * Finds all instance of components in the rendered tree that are DOM
	   * components with the tag name matching `tagName`.
	   * @return an array of all the matches.
	   */
	  scryRenderedDOMComponentsWithTag: function(root, tagName) {
	    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
	      return ReactTestUtils.isDOMComponent(inst) &&
	            inst.tagName === tagName.toUpperCase();
	    });
	  },

	  /**
	   * Like scryRenderedDOMComponentsWithTag but expects there to be one result,
	   * and returns that one result, or throws exception if there is any other
	   * number of matches besides one.
	   * @return {!ReactDOMComponent} The one match.
	   */
	  findRenderedDOMComponentWithTag: function(root, tagName) {
	    var all = ReactTestUtils.scryRenderedDOMComponentsWithTag(root, tagName);
	    if (all.length !== 1) {
	      throw new Error('Did not find exactly one match for tag:' + tagName);
	    }
	    return all[0];
	  },


	  /**
	   * Finds all instances of components with type equal to `componentType`.
	   * @return an array of all the matches.
	   */
	  scryRenderedComponentsWithType: function(root, componentType) {
	    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
	      return ReactTestUtils.isCompositeComponentWithType(
	        inst,
	        componentType
	      );
	    });
	  },

	  /**
	   * Same as `scryRenderedComponentsWithType` but expects there to be one result
	   * and returns that one result, or throws exception if there is any other
	   * number of matches besides one.
	   * @return {!ReactComponent} The one match.
	   */
	  findRenderedComponentWithType: function(root, componentType) {
	    var all = ReactTestUtils.scryRenderedComponentsWithType(
	      root,
	      componentType
	    );
	    if (all.length !== 1) {
	      throw new Error(
	        'Did not find exactly one match for componentType:' + componentType
	      );
	    }
	    return all[0];
	  },

	  /**
	   * Pass a mocked component module to this method to augment it with
	   * useful methods that allow it to be used as a dummy React component.
	   * Instead of rendering as usual, the component will become a simple
	   * <div> containing any provided children.
	   *
	   * @param {object} module the mock function object exported from a
	   *                        module that defines the component to be mocked
	   * @param {?string} mockTagName optional dummy root tag name to return
	   *                              from render method (overrides
	   *                              module.mockTagName if provided)
	   * @return {object} the ReactTestUtils object (for chaining)
	   */
	  mockComponent: function(module, mockTagName) {
	    mockTagName = mockTagName || module.mockTagName || "div";

	    var ConvenienceConstructor = React.createClass({displayName: "ConvenienceConstructor",
	      render: function() {
	        return React.createElement(
	          mockTagName,
	          null,
	          this.props.children
	        );
	      }
	    });

	    module.mockImplementation(ConvenienceConstructor);

	    module.type = ConvenienceConstructor.type;
	    module.isReactLegacyFactory = true;

	    return this;
	  },

	  /**
	   * Simulates a top level event being dispatched from a raw event that occured
	   * on an `Element` node.
	   * @param topLevelType {Object} A type from `EventConstants.topLevelTypes`
	   * @param {!Element} node The dom to simulate an event occurring on.
	   * @param {?Event} fakeNativeEvent Fake native event to use in SyntheticEvent.
	   */
	  simulateNativeEventOnNode: function(topLevelType, node, fakeNativeEvent) {
	    fakeNativeEvent.target = node;
	    ReactBrowserEventEmitter.ReactEventListener.dispatchEvent(
	      topLevelType,
	      fakeNativeEvent
	    );
	  },

	  /**
	   * Simulates a top level event being dispatched from a raw event that occured
	   * on the `ReactDOMComponent` `comp`.
	   * @param topLevelType {Object} A type from `EventConstants.topLevelTypes`.
	   * @param comp {!ReactDOMComponent}
	   * @param {?Event} fakeNativeEvent Fake native event to use in SyntheticEvent.
	   */
	  simulateNativeEventOnDOMComponent: function(
	      topLevelType,
	      comp,
	      fakeNativeEvent) {
	    ReactTestUtils.simulateNativeEventOnNode(
	      topLevelType,
	      comp.getDOMNode(),
	      fakeNativeEvent
	    );
	  },

	  nativeTouchData: function(x, y) {
	    return {
	      touches: [
	        {pageX: x, pageY: y}
	      ]
	    };
	  },

	  Simulate: null,
	  SimulateNative: {}
	};

	/**
	 * Exports:
	 *
	 * - `ReactTestUtils.Simulate.click(Element/ReactDOMComponent)`
	 * - `ReactTestUtils.Simulate.mouseMove(Element/ReactDOMComponent)`
	 * - `ReactTestUtils.Simulate.change(Element/ReactDOMComponent)`
	 * - ... (All keys from event plugin `eventTypes` objects)
	 */
	function makeSimulator(eventType) {
	  return function(domComponentOrNode, eventData) {
	    var node;
	    if (ReactTestUtils.isDOMComponent(domComponentOrNode)) {
	      node = domComponentOrNode.getDOMNode();
	    } else if (domComponentOrNode.tagName) {
	      node = domComponentOrNode;
	    }

	    var fakeNativeEvent = new Event();
	    fakeNativeEvent.target = node;
	    // We don't use SyntheticEvent.getPooled in order to not have to worry about
	    // properly destroying any properties assigned from `eventData` upon release
	    var event = new SyntheticEvent(
	      ReactBrowserEventEmitter.eventNameDispatchConfigs[eventType],
	      ReactMount.getID(node),
	      fakeNativeEvent
	    );
	    assign(event, eventData);
	    EventPropagators.accumulateTwoPhaseDispatches(event);

	    ReactUpdates.batchedUpdates(function() {
	      EventPluginHub.enqueueEvents(event);
	      EventPluginHub.processEventQueue();
	    });
	  };
	}

	function buildSimulators() {
	  ReactTestUtils.Simulate = {};

	  var eventType;
	  for (eventType in ReactBrowserEventEmitter.eventNameDispatchConfigs) {
	    /**
	     * @param {!Element || ReactDOMComponent} domComponentOrNode
	     * @param {?object} eventData Fake event data to use in SyntheticEvent.
	     */
	    ReactTestUtils.Simulate[eventType] = makeSimulator(eventType);
	  }
	}

	// Rebuild ReactTestUtils.Simulate whenever event plugins are injected
	var oldInjectEventPluginOrder = EventPluginHub.injection.injectEventPluginOrder;
	EventPluginHub.injection.injectEventPluginOrder = function() {
	  oldInjectEventPluginOrder.apply(this, arguments);
	  buildSimulators();
	};
	var oldInjectEventPlugins = EventPluginHub.injection.injectEventPluginsByName;
	EventPluginHub.injection.injectEventPluginsByName = function() {
	  oldInjectEventPlugins.apply(this, arguments);
	  buildSimulators();
	};

	buildSimulators();

	/**
	 * Exports:
	 *
	 * - `ReactTestUtils.SimulateNative.click(Element/ReactDOMComponent)`
	 * - `ReactTestUtils.SimulateNative.mouseMove(Element/ReactDOMComponent)`
	 * - `ReactTestUtils.SimulateNative.mouseIn/ReactDOMComponent)`
	 * - `ReactTestUtils.SimulateNative.mouseOut(Element/ReactDOMComponent)`
	 * - ... (All keys from `EventConstants.topLevelTypes`)
	 *
	 * Note: Top level event types are a subset of the entire set of handler types
	 * (which include a broader set of "synthetic" events). For example, onDragDone
	 * is a synthetic event. Except when testing an event plugin or React's event
	 * handling code specifically, you probably want to use ReactTestUtils.Simulate
	 * to dispatch synthetic events.
	 */

	function makeNativeSimulator(eventType) {
	  return function(domComponentOrNode, nativeEventData) {
	    var fakeNativeEvent = new Event(eventType);
	    assign(fakeNativeEvent, nativeEventData);
	    if (ReactTestUtils.isDOMComponent(domComponentOrNode)) {
	      ReactTestUtils.simulateNativeEventOnDOMComponent(
	        eventType,
	        domComponentOrNode,
	        fakeNativeEvent
	      );
	    } else if (!!domComponentOrNode.tagName) {
	      // Will allow on actual dom nodes.
	      ReactTestUtils.simulateNativeEventOnNode(
	        eventType,
	        domComponentOrNode,
	        fakeNativeEvent
	      );
	    }
	  };
	}

	var eventType;
	for (eventType in topLevelTypes) {
	  // Event type is stored as 'topClick' - we transform that to 'click'
	  var convenienceName = eventType.indexOf('top') === 0 ?
	    eventType.charAt(3).toLowerCase() + eventType.substr(4) : eventType;
	  /**
	   * @param {!Element || ReactDOMComponent} domComponentOrNode
	   * @param {?Event} nativeEventData Fake native event to use in SyntheticEvent.
	   */
	  ReactTestUtils.SimulateNative[convenienceName] =
	    makeNativeSimulator(eventType);
	}

	module.exports = ReactTestUtils;


/***/ },

/***/ 339:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactLink
	 * @typechecks static-only
	 */

	"use strict";

	/**
	 * ReactLink encapsulates a common pattern in which a component wants to modify
	 * a prop received from its parent. ReactLink allows the parent to pass down a
	 * value coupled with a callback that, when invoked, expresses an intent to
	 * modify that value. For example:
	 *
	 * React.createClass({
	 *   getInitialState: function() {
	 *     return {value: ''};
	 *   },
	 *   render: function() {
	 *     var valueLink = new ReactLink(this.state.value, this._handleValueChange);
	 *     return <input valueLink={valueLink} />;
	 *   },
	 *   this._handleValueChange: function(newValue) {
	 *     this.setState({value: newValue});
	 *   }
	 * });
	 *
	 * We have provided some sugary mixins to make the creation and
	 * consumption of ReactLink easier; see LinkedValueUtils and LinkedStateMixin.
	 */

	var React = __webpack_require__(19);

	/**
	 * @param {*} value current value of the link
	 * @param {function} requestChange callback to request a change
	 */
	function ReactLink(value, requestChange) {
	  this.value = value;
	  this.requestChange = requestChange;
	}

	/**
	 * Creates a PropType that enforces the ReactLink API and optionally checks the
	 * type of the value being passed inside the link. Example:
	 *
	 * MyComponent.propTypes = {
	 *   tabIndexLink: ReactLink.PropTypes.link(React.PropTypes.number)
	 * }
	 */
	function createLinkTypeChecker(linkType) {
	  var shapes = {
	    value: typeof linkType === 'undefined' ?
	      React.PropTypes.any.isRequired :
	      linkType.isRequired,
	    requestChange: React.PropTypes.func.isRequired
	  };
	  return React.PropTypes.shape(shapes);
	}

	ReactLink.PropTypes = {
	  link: createLinkTypeChecker
	};

	module.exports = ReactLink;


/***/ },

/***/ 340:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactStateSetters
	 */

	"use strict";

	var ReactStateSetters = {
	  /**
	   * Returns a function that calls the provided function, and uses the result
	   * of that to set the component's state.
	   *
	   * @param {ReactCompositeComponent} component
	   * @param {function} funcReturningState Returned callback uses this to
	   *                                      determine how to update state.
	   * @return {function} callback that when invoked uses funcReturningState to
	   *                    determined the object literal to setState.
	   */
	  createStateSetter: function(component, funcReturningState) {
	    return function(a, b, c, d, e, f) {
	      var partialState = funcReturningState.call(component, a, b, c, d, e, f);
	      if (partialState) {
	        component.setState(partialState);
	      }
	    };
	  },

	  /**
	   * Returns a single-argument callback that can be used to update a single
	   * key in the component's state.
	   *
	   * Note: this is memoized function, which makes it inexpensive to call.
	   *
	   * @param {ReactCompositeComponent} component
	   * @param {string} key The key in the state that you should update.
	   * @return {function} callback of 1 argument which calls setState() with
	   *                    the provided keyName and callback argument.
	   */
	  createStateKeySetter: function(component, key) {
	    // Memoize the setters.
	    var cache = component.__keySetters || (component.__keySetters = {});
	    return cache[key] || (cache[key] = createStateKeySetter(component, key));
	  }
	};

	function createStateKeySetter(component, key) {
	  // Partial state is allocated outside of the function closure so it can be
	  // reused with every call, avoiding memory allocation when this function
	  // is called.
	  var partialState = {};
	  return function stateKeySetter(value) {
	    partialState[key] = value;
	    component.setState(partialState);
	  };
	}

	ReactStateSetters.Mixin = {
	  /**
	   * Returns a function that calls the provided function, and uses the result
	   * of that to set the component's state.
	   *
	   * For example, these statements are equivalent:
	   *
	   *   this.setState({x: 1});
	   *   this.createStateSetter(function(xValue) {
	   *     return {x: xValue};
	   *   })(1);
	   *
	   * @param {function} funcReturningState Returned callback uses this to
	   *                                      determine how to update state.
	   * @return {function} callback that when invoked uses funcReturningState to
	   *                    determined the object literal to setState.
	   */
	  createStateSetter: function(funcReturningState) {
	    return ReactStateSetters.createStateSetter(this, funcReturningState);
	  },

	  /**
	   * Returns a single-argument callback that can be used to update a single
	   * key in the component's state.
	   *
	   * For example, these statements are equivalent:
	   *
	   *   this.setState({x: 1});
	   *   this.createStateKeySetter('x')(1);
	   *
	   * Note: this is memoized function, which makes it inexpensive to call.
	   *
	   * @param {string} key The key in the state that you should update.
	   * @return {function} callback of 1 argument which calls setState() with
	   *                    the provided keyName and callback argument.
	   */
	  createStateKeySetter: function(key) {
	    return ReactStateSetters.createStateKeySetter(this, key);
	  }
	};

	module.exports = ReactStateSetters;


/***/ },

/***/ 341:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * @providesModule ReactCSSTransitionGroupChild
	 */

	"use strict";

	var React = __webpack_require__(19);

	var CSSCore = __webpack_require__(365);
	var ReactTransitionEvents = __webpack_require__(366);

	var onlyChild = __webpack_require__(55);

	// We don't remove the element from the DOM until we receive an animationend or
	// transitionend event. If the user screws up and forgets to add an animation
	// their node will be stuck in the DOM forever, so we detect if an animation
	// does not start and if it doesn't, we just call the end listener immediately.
	var TICK = 17;
	var NO_EVENT_TIMEOUT = 5000;

	var noEventListener = null;


	if ("production" !== process.env.NODE_ENV) {
	  noEventListener = function() {
	    console.warn(
	      'transition(): tried to perform an animation without ' +
	      'an animationend or transitionend event after timeout (' +
	      NO_EVENT_TIMEOUT + 'ms). You should either disable this ' +
	      'transition in JS or add a CSS animation/transition.'
	    );
	  };
	}

	var ReactCSSTransitionGroupChild = React.createClass({
	  displayName: 'ReactCSSTransitionGroupChild',

	  transition: function(animationType, finishCallback) {
	    var node = this.getDOMNode();
	    var className = this.props.name + '-' + animationType;
	    var activeClassName = className + '-active';
	    var noEventTimeout = null;

	    var endListener = function(e) {
	      if (e && e.target !== node) {
	        return;
	      }
	      if ("production" !== process.env.NODE_ENV) {
	        clearTimeout(noEventTimeout);
	      }

	      CSSCore.removeClass(node, className);
	      CSSCore.removeClass(node, activeClassName);

	      ReactTransitionEvents.removeEndEventListener(node, endListener);

	      // Usually this optional callback is used for informing an owner of
	      // a leave animation and telling it to remove the child.
	      finishCallback && finishCallback();
	    };

	    ReactTransitionEvents.addEndEventListener(node, endListener);

	    CSSCore.addClass(node, className);

	    // Need to do this to actually trigger a transition.
	    this.queueClass(activeClassName);

	    if ("production" !== process.env.NODE_ENV) {
	      noEventTimeout = setTimeout(noEventListener, NO_EVENT_TIMEOUT);
	    }
	  },

	  queueClass: function(className) {
	    this.classNameQueue.push(className);

	    if (!this.timeout) {
	      this.timeout = setTimeout(this.flushClassNameQueue, TICK);
	    }
	  },

	  flushClassNameQueue: function() {
	    if (this.isMounted()) {
	      this.classNameQueue.forEach(
	        CSSCore.addClass.bind(CSSCore, this.getDOMNode())
	      );
	    }
	    this.classNameQueue.length = 0;
	    this.timeout = null;
	  },

	  componentWillMount: function() {
	    this.classNameQueue = [];
	  },

	  componentWillUnmount: function() {
	    if (this.timeout) {
	      clearTimeout(this.timeout);
	    }
	  },

	  componentWillEnter: function(done) {
	    if (this.props.enter) {
	      this.transition('enter', done);
	    } else {
	      done();
	    }
	  },

	  componentWillLeave: function(done) {
	    if (this.props.leave) {
	      this.transition('leave', done);
	    } else {
	      done();
	    }
	  },

	  render: function() {
	    return onlyChild(this.props.children);
	  }
	});

	module.exports = ReactCSSTransitionGroupChild;


/***/ },

/***/ 342:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks static-only
	 * @providesModule ReactTransitionChildMapping
	 */

	"use strict";

	var ReactChildren = __webpack_require__(35);

	var ReactTransitionChildMapping = {
	  /**
	   * Given `this.props.children`, return an object mapping key to child. Just
	   * simple syntactic sugar around ReactChildren.map().
	   *
	   * @param {*} children `this.props.children`
	   * @return {object} Mapping of key to child
	   */
	  getChildMapping: function(children) {
	    return ReactChildren.map(children, function(child) {
	      return child;
	    });
	  },

	  /**
	   * When you're adding or removing children some may be added or removed in the
	   * same render pass. We want to show *both* since we want to simultaneously
	   * animate elements in and out. This function takes a previous set of keys
	   * and a new set of keys and merges them with its best guess of the correct
	   * ordering. In the future we may expose some of the utilities in
	   * ReactMultiChild to make this easy, but for now React itself does not
	   * directly have this concept of the union of prevChildren and nextChildren
	   * so we implement it here.
	   *
	   * @param {object} prev prev children as returned from
	   * `ReactTransitionChildMapping.getChildMapping()`.
	   * @param {object} next next children as returned from
	   * `ReactTransitionChildMapping.getChildMapping()`.
	   * @return {object} a key set that contains all keys in `prev` and all keys
	   * in `next` in a reasonable order.
	   */
	  mergeChildMappings: function(prev, next) {
	    prev = prev || {};
	    next = next || {};

	    function getValueForKey(key) {
	      if (next.hasOwnProperty(key)) {
	        return next[key];
	      } else {
	        return prev[key];
	      }
	    }

	    // For each key of `next`, the list of keys to insert before that key in
	    // the combined list
	    var nextKeysPending = {};

	    var pendingKeys = [];
	    for (var prevKey in prev) {
	      if (next.hasOwnProperty(prevKey)) {
	        if (pendingKeys.length) {
	          nextKeysPending[prevKey] = pendingKeys;
	          pendingKeys = [];
	        }
	      } else {
	        pendingKeys.push(prevKey);
	      }
	    }

	    var i;
	    var childMapping = {};
	    for (var nextKey in next) {
	      if (nextKeysPending.hasOwnProperty(nextKey)) {
	        for (i = 0; i < nextKeysPending[nextKey].length; i++) {
	          var pendingNextKey = nextKeysPending[nextKey][i];
	          childMapping[nextKeysPending[nextKey][i]] = getValueForKey(
	            pendingNextKey
	          );
	        }
	      }
	      childMapping[nextKey] = getValueForKey(nextKey);
	    }

	    // Finally, add the keys which didn't appear before any key in `next`
	    for (i = 0; i < pendingKeys.length; i++) {
	      childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
	    }

	    return childMapping;
	  }
	};

	module.exports = ReactTransitionChildMapping;


/***/ },

/***/ 365:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule CSSCore
	 * @typechecks
	 */

	var invariant = __webpack_require__(114);

	/**
	 * The CSSCore module specifies the API (and implements most of the methods)
	 * that should be used when dealing with the display of elements (via their
	 * CSS classes and visibility on screen. It is an API focused on mutating the
	 * display and not reading it as no logical state should be encoded in the
	 * display of elements.
	 */

	var CSSCore = {

	  /**
	   * Adds the class passed in to the element if it doesn't already have it.
	   *
	   * @param {DOMElement} element the element to set the class on
	   * @param {string} className the CSS className
	   * @return {DOMElement} the element passed in
	   */
	  addClass: function(element, className) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      !/\s/.test(className),
	      'CSSCore.addClass takes only a single class name. "%s" contains ' +
	      'multiple classes.', className
	    ) : invariant(!/\s/.test(className)));

	    if (className) {
	      if (element.classList) {
	        element.classList.add(className);
	      } else if (!CSSCore.hasClass(element, className)) {
	        element.className = element.className + ' ' + className;
	      }
	    }
	    return element;
	  },

	  /**
	   * Removes the class passed in from the element
	   *
	   * @param {DOMElement} element the element to set the class on
	   * @param {string} className the CSS className
	   * @return {DOMElement} the element passed in
	   */
	  removeClass: function(element, className) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      !/\s/.test(className),
	      'CSSCore.removeClass takes only a single class name. "%s" contains ' +
	      'multiple classes.', className
	    ) : invariant(!/\s/.test(className)));

	    if (className) {
	      if (element.classList) {
	        element.classList.remove(className);
	      } else if (CSSCore.hasClass(element, className)) {
	        element.className = element.className
	          .replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), '$1')
	          .replace(/\s+/g, ' ') // multiple spaces to one
	          .replace(/^\s*|\s*$/g, ''); // trim the ends
	      }
	    }
	    return element;
	  },

	  /**
	   * Helper to add or remove a class from an element based on a condition.
	   *
	   * @param {DOMElement} element the element to set the class on
	   * @param {string} className the CSS className
	   * @param {*} bool condition to whether to add or remove the class
	   * @return {DOMElement} the element passed in
	   */
	  conditionClass: function(element, className, bool) {
	    return (bool ? CSSCore.addClass : CSSCore.removeClass)(element, className);
	  },

	  /**
	   * Tests whether the element has the class specified.
	   *
	   * @param {DOMNode|DOMWindow} element the element to set the class on
	   * @param {string} className the CSS className
	   * @return {boolean} true if the element has the class, false if not
	   */
	  hasClass: function(element, className) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      !/\s/.test(className),
	      'CSS.hasClass takes only a single class name.'
	    ) : invariant(!/\s/.test(className)));
	    if (element.classList) {
	      return !!className && element.classList.contains(className);
	    }
	    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
	  }

	};

	module.exports = CSSCore;


/***/ },

/***/ 366:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactTransitionEvents
	 */

	"use strict";

	var ExecutionEnvironment = __webpack_require__(56);

	/**
	 * EVENT_NAME_MAP is used to determine which event fired when a
	 * transition/animation ends, based on the style property used to
	 * define that event.
	 */
	var EVENT_NAME_MAP = {
	  transitionend: {
	    'transition': 'transitionend',
	    'WebkitTransition': 'webkitTransitionEnd',
	    'MozTransition': 'mozTransitionEnd',
	    'OTransition': 'oTransitionEnd',
	    'msTransition': 'MSTransitionEnd'
	  },

	  animationend: {
	    'animation': 'animationend',
	    'WebkitAnimation': 'webkitAnimationEnd',
	    'MozAnimation': 'mozAnimationEnd',
	    'OAnimation': 'oAnimationEnd',
	    'msAnimation': 'MSAnimationEnd'
	  }
	};

	var endEvents = [];

	function detectEvents() {
	  var testEl = document.createElement('div');
	  var style = testEl.style;

	  // On some platforms, in particular some releases of Android 4.x,
	  // the un-prefixed "animation" and "transition" properties are defined on the
	  // style object but the events that fire will still be prefixed, so we need
	  // to check if the un-prefixed events are useable, and if not remove them
	  // from the map
	  if (!('AnimationEvent' in window)) {
	    delete EVENT_NAME_MAP.animationend.animation;
	  }

	  if (!('TransitionEvent' in window)) {
	    delete EVENT_NAME_MAP.transitionend.transition;
	  }

	  for (var baseEventName in EVENT_NAME_MAP) {
	    var baseEvents = EVENT_NAME_MAP[baseEventName];
	    for (var styleName in baseEvents) {
	      if (styleName in style) {
	        endEvents.push(baseEvents[styleName]);
	        break;
	      }
	    }
	  }
	}

	if (ExecutionEnvironment.canUseDOM) {
	  detectEvents();
	}

	// We use the raw {add|remove}EventListener() call because EventListener
	// does not know how to remove event listeners and we really should
	// clean up. Also, these events are not triggered in older browsers
	// so we should be A-OK here.

	function addEventListener(node, eventName, eventListener) {
	  node.addEventListener(eventName, eventListener, false);
	}

	function removeEventListener(node, eventName, eventListener) {
	  node.removeEventListener(eventName, eventListener, false);
	}

	var ReactTransitionEvents = {
	  addEndEventListener: function(node, eventListener) {
	    if (endEvents.length === 0) {
	      // If CSS transitions are not supported, trigger an "end animation"
	      // event immediately.
	      window.setTimeout(eventListener, 0);
	      return;
	    }
	    endEvents.forEach(function(endEvent) {
	      addEventListener(node, endEvent, eventListener);
	    });
	  },

	  removeEndEventListener: function(node, eventListener) {
	    if (endEvents.length === 0) {
	      return;
	    }
	    endEvents.forEach(function(endEvent) {
	      removeEventListener(node, endEvent, eventListener);
	    });
	  }
	};

	module.exports = ReactTransitionEvents;


/***/ }

})