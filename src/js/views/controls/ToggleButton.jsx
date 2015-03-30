"use strict";

var React = require('react')
var tweenState = require('react-tween-state')
var ConfigStore = require('../../stores/ConfigStore')
var reviewAction = require('../../actions/ReviewAction')
var reviewStore = require('../../stores/ReviewStore')
var ListenerMixin = require('alt/mixins/ListenerMixin')

var ToggleButton = React.createClass({
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
            <svg className="pointer" onClick={this.handleClick} viewBox="0 0 56 30" width="56" height="25">
                <rect rx="15" ry="15" fill={this.getToggleFill()} width="100%" height="100%" />
                <circle cx={this.getTweeningValue('circleX')} cy="15" r="13" fill="white" />
            </svg>
        );
    }
});

module.exports = ToggleButton;