webpackHotUpdate(0,{

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(4);
	var gui = __webpack_require__(368);
	
	var MainBackground = React.createClass({displayName: "MainBackground",
	    getInitialState: function() {
	      return {
	          bgHeight: 0,
	          bgWidth: 0
	      }
	    },
	    componentDidMount: function() {
	        var node = this.getDOMNode().parentNode;
	        this.setState({bgHeight: node.clientHeight});
	        this.setState({bgWidth: node.clientWidth});
	    },
	    render: function() {
	
	        var svgStyle = {
	            fill: "#FFFFFF",
	            strokeWidth: "0",
	            width: "100%",
	            height: "100%"
	        };
	
	        var tailCenter = this.state.bgWidth/2 - 5.5;
	        var backgroundFill = "url(#sunsetFill)";
	        var backgroundStyle = { mask: "url(#backgroundMask)" };
	
	        return (
	            React.createElement("svg", {className: "mainBackground", preserveAspectRatio: "xMinYMin meet"}, 
	                React.createElement("defs", null, 
	                    React.createElement("linearGradient", {id: "sunsetFill", x1: "0%", y1: "0%", x2: "100%", y2: "0%", opacity: "1", gradientTransform: "rotate(90)"}, 
	                        React.createElement("stop", {offset: "0%", stopColor: "#cc643f", stopOpacity: "1"}), 
	                        React.createElement("stop", {offset: "50%", stopColor: "#633845", stopOpacity: "1"}), 
	                        React.createElement("stop", {offset: "100%", stopColor: "#341e2c", stopOpacity: "1"})
	                    ), 
	                    React.createElement("mask", {id: "backgroundMask"}, 
	                        React.createElement("rect", {rx: "5", ry: "5", style: svgStyle, width: "100%", x: "0", y: "11", height: Math.max((this.state.bgHeight-11), 0)}), 
	                        React.createElement("svg", {x: tailCenter, y: "0"}, 
	                            React.createElement("path", {"fill-rule": "evenodd", "clip-rule": "evenodd", style: svgStyle, d: "M0,11C3.9,11,11.1,0,11.9,0c1,0,8.8,11,13.2,11H0z"})
	                        )
	                    )
	                ), 
	
	                React.createElement("rect", {width: "100%", height: "100%", style: backgroundStyle, fill: backgroundFill})
	
	            )
	        );
	    }
	});
	
	module.exports = MainBackground;

/***/ }

})
//# sourceMappingURL=0.c22f3efdcd0f28ed2425.hot-update.js.map