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

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var ToggleButton = __webpack_require__ (78)
	var RefreshButton = __webpack_require__ (80)
	var AddButton = __webpack_require__ (82)
	var SettingsButton = __webpack_require__ (84)
	var reviewStore = __webpack_require__(28)
	var ListenerMixin = __webpack_require__(23)
	var classnames = __webpack_require__(29)

	var Controls = React.createClass({displayName: "Controls",
	    mixins: [ListenerMixin],
	    getInitialState: function() {
	        return {
	            lastUpdate: reviewStore.getState().lastUpdate
	        }
	    },
	    onChange: function() {
	        this.setState({lastUpdate: reviewStore.getState().lastUpdate})
	    },
	    componentDidMount: function() {
	        this.listenTo(reviewStore, this.onChange)
	    },
	    render: function() {

	        var classNames = classname({
	            "last-update": true,
	            hide: !this.state.reviews || this.state.reviews.length == 0
	        })

	        return (
	          React.createElement("section", {className: "mainControls"}, 
	              React.createElement(ToggleButton, null), 
	              React.createElement(RefreshButton, null), 
	              React.createElement("div", {className: classNames}, this.state.lastUpdate), 
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

	module.exports = "\"use strict\";\n\nvar React = require('react')\nvar ToggleButton = require ('./controls/ToggleButton.jsx')\nvar RefreshButton = require ('./controls/RefreshButton.jsx')\nvar AddButton = require ('./controls/AddButton.jsx')\nvar SettingsButton = require ('./controls/SettingsButton.jsx')\nvar reviewStore = require('../stores/ReviewStore')\nvar ListenerMixin = require('alt/mixins/ListenerMixin')\nvar classnames = require('classnames')\n\nvar Controls = React.createClass({displayName: \"Controls\",\n    mixins: [ListenerMixin],\n    getInitialState: function() {\n        return {\n            lastUpdate: reviewStore.getState().lastUpdate\n        }\n    },\n    onChange: function() {\n        this.setState({lastUpdate: reviewStore.getState().lastUpdate})\n    },\n    componentDidMount: function() {\n        this.listenTo(reviewStore, this.onChange)\n    },\n    render: function() {\n\n        var classNames = classname({\n            \"last-update\": true,\n            hide: !this.state.reviews || this.state.reviews.length == 0\n        })\n\n        return (\n          React.createElement(\"section\", {className: \"mainControls\"}, \n              React.createElement(ToggleButton, null), \n              React.createElement(RefreshButton, null), \n              React.createElement(\"div\", {className: classNames}, this.state.lastUpdate), \n              React.createElement(AddButton, null), \n              React.createElement(SettingsButton, null)\n          )\n        );\n    }\n\n});\n\nmodule.exports = Controls;\n\n"

/***/ },

/***/ 78:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var tweenState = __webpack_require__(179)
	var ConfigStore = __webpack_require__(106)
	var reviewAction = __webpack_require__(4)
	var reviewStore = __webpack_require__(28)
	var ListenerMixin = __webpack_require__(23)

	var ToggleButton = React.createClass({displayName: "ToggleButton",
	    mixins: [ListenerMixin, tweenState.Mixin],
	    getInitialState: function() {
	        var bg = ConfigStore.getRGBForToggle(true);
	        return {
	            toggled: reviewStore.getState().isMonitoring,
	            circleX: 41,
	            redBG: bg[0],
	            greenBG: bg[1],
	            blueBG: bg[2]
	        }
	    },
	    onChange: function() {
	        this.setState({toggled: reviewStore.getState().isMonitoring}, this.initiateTween)
	    },
	    initiateTween: function() {
	        var bg = ConfigStore.getRGBForToggle(this.state.toggled)
	        this.createTween('redBG', bg[0])
	        this.createTween('greenBG', bg[1])
	        this.createTween('blueBG', bg[2])
	        this.createTween('circleX', !this.state.toggled ? 15 : 41)
	    },
	    componentDidMount: function() {
	        this.listenTo(reviewStore, this.onChange)
	        this.initiateTween()
	    },
	    handleClick: function(event) {
	        reviewAction.toggleMonitoring()
	    },
	    createTween: function(name, value) {
	        this.tweenState(name, {
	            easing: tweenState.easingTypes.easeInOutQuad,
	            duration: 250,
	            endValue: value
	        });
	    },
	    getToggleFill: function() {
	        return "rgb(" +
	            Math.round(this.getTweeningValue('redBG')) + ", " +
	            Math.round(this.getTweeningValue('greenBG')) + ", " +
	            Math.round(this.getTweeningValue('blueBG')) + ")";
	    },
	    render: function() {
	        return (
	            React.createElement("svg", {className: "pointer", onClick: this.handleClick, viewBox: "0 0 56 30", width: "56", height: "25"}, 
	                React.createElement("rect", {rx: "15", ry: "15", fill: this.getToggleFill(), width: "100%", height: "100%"}), 
	                React.createElement("circle", {cx: this.getTweeningValue('circleX'), cy: "15", r: "13", fill: "white"})
	            )
	        );
	    }
	});

	module.exports = ToggleButton;

/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var ConfigStore = __webpack_require__(106)
	var reviewAction = __webpack_require__(4)
	var ListenerMixin = __webpack_require__(23)
	var ReviewStore = __webpack_require__(28)
	var classnames = __webpack_require__(29)

	var RefreshButton = React.createClass({displayName: "RefreshButton",
	    mixins: [ListenerMixin],
	    getInitialState: function() {
	        return {
	            loading: ReviewStore.getState().loading,
	            rotationTween: 0
	        }
	    },
	    componentDidMount:function() {
	        this.listenTo(ReviewStore, this.onChange)
	    },
	    onChange:function() {
	        this.setState({loading: ReviewStore.getState().loading})
	    },
	    handleClick: function(event) {
	        reviewAction.updateAll();
	    },
	    render: function() {

	        var classes = classnames({
	            pointer: true,
	            spin: this.state.loading,
	            stopSpin: !this.state.loading
	        })

	        return (
	            React.createElement("svg", {onClick: this.handleClick, className: classes, viewBox: "0 0 17 16", width: "23", height: "18"}, 
	                React.createElement("path", {fill: "#"+ConfigStore.getGreen(), d: "M17,11.6c-0.1-0.3-0.5-0.5-0.8-0.4l-0.9,0.3c0.5-1.1,0.8-2.3,0.8-3.5c0-4.4-3.6-8-8-8C3.6,0,0,3.6,0,8" + ' ' +
		"s3.6,8,8,8c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7c-3.7,0-6.7-3-6.7-6.7s3-6.7,6.7-6.7s6.7,3,6.7,6.7c0,1-0.2,2-0.7,2.9" + ' ' +
		"L13.8,10c-0.1-0.3-0.5-0.5-0.8-0.4c-0.3,0.1-0.5,0.5-0.4,0.8l0.8,2.4c0.1,0.3,0.3,0.5,0.6,0.5c0.1,0,0.1,0,0.2,0l2.4-0.8" + ' ' +
		"C16.9,12.3,17.1,12,17,11.6z"})
	            )
	        )
	    }
	});

	module.exports = RefreshButton;

/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(10)
	var ConfigStore = __webpack_require__(106)
	var gui = __webpack_require__(1)
	var reviewAction = __webpack_require__(4)
	var reviewStore = __webpack_require__(28)
	var ListenerMixin = __webpack_require__(23)

	var menu, editMenu, startUpMenu, notificationMenu, markSeenMenu

	var SettingsButton = React.createClass({displayName: "SettingsButton",
	    mixins: [ListenerMixin],
	    getInitialState: function() {
	        return reviewStore.getState()
	    },
	    onChange: function() {
	        this.setState(this.getInitialState())
	    },
	    componentDidMount: function() {
	        this.listenTo(reviewStore, this.onChange)

	        menu = new gui.Menu();
	        editMenu = new gui.MenuItem({
	            label: 'Edit starlets',
	            type: "checkbox",
	            checked: this.state.isEditing,
	            click: function() {
	                reviewAction.toggleEditing()
	            }
	        })
	        menu.append(editMenu);

	        markSeenMenu = new gui.MenuItem({
	            label: 'Mark all as seen',
	            click: function() {
	                reviewAction.markAllAsSeen()
	            }
	        })
	        menu.append(markSeenMenu);

	        menu.append(new gui.MenuItem({ type: 'separator' }));

	        startUpMenu = new gui.MenuItem({
	            label: 'Open at startup',
	            type: "checkbox",
	            checked: true,
	            click: function() {
	                reviewAction.toggleRunOnLogin()
	            }
	        });
	        menu.append(startUpMenu)

	        notificationMenu = new gui.MenuItem({
	            label: 'Show notifications',
	            type: "checkbox",
	            checked: true,
	            click: function() {
	                reviewAction.toggleNotifications()
	            }
	        });
	        menu.append(notificationMenu)

	        menu.append(new gui.MenuItem({ type: 'separator' }));

	        menu.append(new gui.MenuItem({
	            label: 'Join J.S.L. Newsletter',
	            click: function() {
	                gui.Shell.openExternal('http://www.jslauthor.com/sign-up');
	            }
	        }));

	        menu.append(new gui.MenuItem({
	            label: 'Help',
	            click: function() {
	                gui.Shell.openExternal('http://www.jslauthor.com/stellar');
	            }
	        }));

	        menu.append(new gui.MenuItem({ type: 'separator' }));
	        menu.append(new gui.MenuItem({
	            label: 'Exit',
	            click: function() {
	                gui.Window.get().close()
	            }
	        }));

	        this.updateMenuItems()
	    },
	    componentDidUpdate: function() {
	        this.updateMenuItems()
	    },
	    updateMenuItems: function() {
	        if (editMenu)
	            editMenu.checked = this.state.isEditing

	        if (notificationMenu)
	            notificationMenu.checked = this.state.notificationsEnabled

	        if (startUpMenu)
	            startUpMenu.checked = this.state.runOnLogin
	    },
	    handleClick: function(event) {
	        menu.popup(event.clientX+5, event.clientY+5)
	    },
	    render: function() {
	        return (
	            React.createElement("svg", {onClick: this.handleClick, className: "pointer", width: "22", height: "18", viewBox: "0 0 17 17"}, 
	                React.createElement("path", {fill: "#"+ConfigStore.getGreen(), d: "M17,8.5c0-0.6-0.5-1.3-1-1.5c-0.6-0.2-1.1-0.7-1.3-1.1c-0.2-0.4-0.1-1.1,0.1-1.7c0.3-0.5,0.1-1.3-0.3-1.8" + ' ' +
		"c-0.4-0.4-1.2-0.6-1.8-0.3c-0.5,0.3-1.3,0.3-1.7,0.1C10.7,2.1,10.2,1.6,10,1C9.8,0.5,9.1,0,8.5,0C7.9,0,7.2,0.5,7,1" + ' ' +
		"C6.8,1.6,6.3,2.1,5.9,2.3C5.5,2.4,4.8,2.4,4.3,2.1C3.7,1.9,2.9,2,2.5,2.5C2,2.9,1.9,3.7,2.1,4.3c0.3,0.5,0.3,1.3,0.1,1.7" + ' ' +
		"C2.1,6.3,1.6,6.8,1,7C0.5,7.2,0,7.9,0,8.5S0.5,9.8,1,10c0.6,0.2,1.1,0.7,1.3,1.1c0.2,0.4,0.1,1.1-0.1,1.7c-0.3,0.5-0.1,1.3,0.3,1.8" + ' ' +
		"c0.4,0.4,1.2,0.6,1.8,0.3c0.5-0.3,1.3-0.3,1.7-0.1C6.3,14.9,6.8,15.4,7,16c0.2,0.6,0.9,1,1.5,1c0.6,0,1.3-0.5,1.5-1" + ' ' +
		"c0.2-0.6,0.7-1.1,1.1-1.3c0.4-0.2,1.1-0.1,1.7,0.1c0.5,0.3,1.3,0.1,1.8-0.3c0.4-0.4,0.6-1.2,0.3-1.8c-0.3-0.5-0.3-1.3-0.1-1.7" + ' ' +
		"c0.2-0.4,0.7-0.9,1.3-1.1C16.6,9.8,17,9.1,17,8.5z M8.5,11.6c-1.7,0-3.1-1.4-3.1-3.1c0-1.7,1.4-3.1,3.1-3.1c1.7,0,3.1,1.4,3.1,3.1" + ' ' +
		"C11.6,10.2,10.2,11.6,8.5,11.6z"})
	            )
	        )
	    }
	});

	module.exports = SettingsButton;













/***/ },

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var easingTypes = __webpack_require__(311);

	// additive is the new iOS 8 default. In most cases it simulates a physics-
	// looking overshoot behavior (especially with easeInOut. You can test that in
	// the example
	var DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
	var DEFAULT_EASING = easingTypes.easeInOutQuad;
	var DEFAULT_DURATION = 300;
	var DEFAULT_DELAY = 0;

	function shallowClone(obj) {
	  var ret = {};
	  for (var key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = obj[key];
	  }
	  return ret;
	}

	// see usage below
	function returnState(state) {
	  return state;
	}

	var tweenState = {
	  easingTypes: easingTypes,
	  stackBehavior: {
	    ADDITIVE: 'ADDITIVE',
	    DESTRUCTIVE: 'DESTRUCTIVE',
	  }
	};

	tweenState.Mixin = {
	  getInitialState: function() {
	    return {
	      tweenQueue: [],
	    };
	  },

	  tweenState: function(a, b, c) {
	    // tweenState(stateNameString, config)
	    // tweenState(stateRefFunc, stateNameString, config)

	    // passing a state name string and retrieving it later from this.state
	    // doesn't work for values in deeply nested collections (unless you design
	    // the API to be able to parse 'this.state.my.nested[1]', meh). Passing a
	    // direct, resolved reference wouldn't work either, since that reference
	    // points to the old state rather than the subsequent new ones.
	    if (typeof a === 'string') {
	      c = b;
	      b = a;
	      a = returnState;
	    }
	    this._tweenState(a, b, c);
	  },

	  _tweenState: function(stateRefFunc, stateName, config) {
	    config = shallowClone(config);

	    var state = this._pendingState || this.state;
	    var stateRef = stateRefFunc(state);

	    // see the reasoning for these defaults at the top
	    config.stackBehavior = config.stackBehavior || DEFAULT_STACK_BEHAVIOR;
	    config.easing = config.easing || DEFAULT_EASING;
	    config.duration = config.duration == null ? DEFAULT_DURATION : config.duration;
	    config.beginValue = config.beginValue == null ? stateRef[stateName] : config.beginValue;
	    config.delay = config.delay == null ? DEFAULT_DELAY : config.delay;

	    var newTweenQueue = state.tweenQueue;
	    if (config.stackBehavior === tweenState.stackBehavior.DESTRUCTIVE) {
	      newTweenQueue = state.tweenQueue.filter(function(item) {
	        return item.stateName !== stateName || item.stateRefFunc(state) !== stateRef;
	      });
	    }

	    newTweenQueue.push({
	      stateRefFunc: stateRefFunc,
	      stateName: stateName,
	      config: config,
	      initTime: Date.now() + config.delay,
	    });

	    // tweenState calls setState
	    // sorry for mutating. No idea where in the state the value is
	    stateRef[stateName] = config.endValue;
	    // this will also include the above update
	    this.setState({tweenQueue: newTweenQueue});

	    if (newTweenQueue.length === 1) {
	      this.startRaf();
	    }
	  },

	  getTweeningValue: function(a, b) {
	    // see tweenState API
	    if (typeof a === 'string') {
	      b = a;
	      a = returnState;
	    }
	    return this._getTweeningValue(a, b);
	  },

	  _getTweeningValue: function(stateRefFunc, stateName) {
	    var state = this.state;
	    var stateRef = stateRefFunc(state);
	    var tweeningValue = stateRef[stateName];
	    var now = Date.now();

	    for (var i = 0; i < state.tweenQueue.length; i++) {
	      var item = state.tweenQueue[i];
	      var itemStateRef = item.stateRefFunc(state);
	      if (item.stateName !== stateName || itemStateRef !== stateRef) {
	        continue;
	      }

	      var progressTime = now - item.initTime > item.config.duration ?
	        item.config.duration :
	        Math.max(0, now - item.initTime);
	      // `now - item.initTime` can be negative if initTime is scheduled in the
	      // future by a delay. In this case we take 0

	      var contrib = -item.config.endValue + item.config.easing(
	        progressTime,
	        item.config.beginValue,
	        item.config.endValue,
	        item.config.duration
	        // TODO: some funcs accept a 5th param
	      );
	      tweeningValue += contrib;
	    }

	    return tweeningValue;
	  },

	  _rafCb: function() {
	    if (!this.isMounted()) {
	      return;
	    }

	    var state = this.state;
	    if (state.tweenQueue.length === 0) {
	      return;
	    }

	    var now = Date.now();
	    state.tweenQueue.forEach(function(item) {
	      if (now - item.initTime >= item.config.duration) {
	        item.config.onEnd && item.config.onEnd();
	      }
	    });

	    var newTweenQueue = state.tweenQueue.filter(function(item) {
	      return now - item.initTime < item.config.duration;
	    });

	    this.setState({
	      tweenQueue: newTweenQueue,
	    });

	    requestAnimationFrame(this._rafCb);
	  },

	  startRaf: function() {
	    requestAnimationFrame(this._rafCb);
	  },

	};

	module.exports = tweenState;


/***/ },

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var easingTypes = {
	  // t: current time, b: beginning value, c: change in value, d: duration

	  // new note: I much prefer specifying the final value rather than the change
	  // in value this is what the repo's interpolation plugin api will use. Here,
	  // c will stand for final value

	  linear: function(t, b, _c, d) {
	    var c = _c - b;
	    return t*c/d + b;
	  },
	  easeInQuad: function (t, b, _c, d) {
	    var c = _c - b;
	    return c*(t/=d)*t + b;
	  },
	  easeOutQuad: function (t, b, _c, d) {
	    var c = _c - b;
	    return -c *(t/=d)*(t-2) + b;
	  },
	  easeInOutQuad: function (t, b, _c, d) {
	    var c = _c - b;
	    if ((t/=d/2) < 1) return c/2*t*t + b;
	    return -c/2 * ((--t)*(t-2) - 1) + b;
	  },
	  easeInElastic: function (t, b, _c, d) {
	    var c = _c - b;
	    var s=1.70158;var p=0;var a=c;
	    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	    if (a < Math.abs(c)) { a=c; var s=p/4; }
	    else var s = p/(2*Math.PI) * Math.asin (c/a);
	    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	  },
	  easeOutElastic: function (t, b, _c, d) {
	    var c = _c - b;
	    var s=1.70158;var p=0;var a=c;
	    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	    if (a < Math.abs(c)) { a=c; var s=p/4; }
	    else var s = p/(2*Math.PI) * Math.asin (c/a);
	    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	  },
	  easeInOutElastic: function (t, b, _c, d) {
	    var c = _c - b;
	    var s=1.70158;var p=0;var a=c;
	    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	    if (a < Math.abs(c)) { a=c; var s=p/4; }
	    else var s = p/(2*Math.PI) * Math.asin (c/a);
	    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	  },
	  easeInBack: function (t, b, _c, d, s) {
	    var c = _c - b;
	    if (s == undefined) s = 1.70158;
	    return c*(t/=d)*t*((s+1)*t - s) + b;
	  },
	  easeOutBack: function (t, b, _c, d, s) {
	    var c = _c - b;
	    if (s == undefined) s = 1.70158;
	    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	  },
	  easeInOutBack: function (t, b, _c, d, s) {
	    var c = _c - b;
	    if (s == undefined) s = 1.70158;
	    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	  },
	  easeInBounce: function (t, b, _c, d) {
	    var c = _c - b;
	    return c - easingTypes.easeOutBounce (d-t, 0, c, d) + b;
	  },
	  easeOutBounce: function (t, b, _c, d) {
	    var c = _c - b;
	    if ((t/=d) < (1/2.75)) {
	      return c*(7.5625*t*t) + b;
	    } else if (t < (2/2.75)) {
	      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	    } else if (t < (2.5/2.75)) {
	      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	    } else {
	      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	    }
	  },
	  easeInOutBounce: function (t, b, _c, d) {
	    var c = _c - b;
	    if (t < d/2) return easingTypes.easeInBounce (t*2, 0, c, d) * .5 + b;
	    return easingTypes.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	  }
	};

	module.exports = easingTypes;

	/*
	 *
	 * TERMS OF USE - EASING EQUATIONS
	 *
	 * Open source under the BSD License.
	 *
	 * Copyright © 2001 Robert Penner
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 * are permitted provided that the following conditions are met:
	 *
	 * Redistributions of source code must retain the above copyright notice, this list of
	 * conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright notice, this list
	 * of conditions and the following disclaimer in the documentation and/or other materials
	 * provided with the distribution.
	 *
	 * Neither the name of the author nor the names of contributors may be used to endorse
	 * or promote products derived from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
	 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
	 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
	 * OF THE POSSIBILITY OF SUCH DAMAGE.
	 *
	 */


/***/ }

})