"use strict";

var React = require('react');
var gui = window.require('nw.gui');

var MainBackground = React.createClass({
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
            fill: "#FF0000",
            strokeWidth: "0",
            width: "100%",
            height: "100%"
        };

        var tailCenter = this.state.bgWidth/2 - 5.5;

        return (
            <svg className="mainBackground" preserveAspectRatio="xMinYMin meet">
                <rect rx="8" ry="8" style={svgStyle} width="100%" x="0" y="11" height={Math.max((this.state.bgHeight-11), 0)} />
                <svg x={tailCenter} y="0">
                    <path fill-rule="evenodd" clip-rule="evenodd" style={svgStyle} d="M0,11C3.9,11,11.1,0,11.9,0c1,0,8.8,11,13.2,11H0z"/>
                </svg>
            </svg>
        );
    }
});

module.exports = MainBackground;