"use strict";

var React = require('react');
var tweenState = require('react-tween-state');
var ConfigStore = require('../../stores/ConfigStore');

var RefreshButton = React.createClass({
    mixins: [tweenState.Mixin],
    getInitialState: function() {
        return {
            loading: false,
            rotationTween: 0
        }
    },
    handleClick: function(event) {
        this.setState({loading: !this.state.loading}, function() {
            if (this.state.loading)
                this.createTween();
            else
                this.tweenState("rotationTween", {
                    easing: tweenState.easingTypes.easeOutQuad,
                    duration: 500,
                    beginValue: Math.round(this.getTweeningValue('rotationTween')),
                    endValue: Math.round(this.getTweeningValue('rotationTween')) + 180,
                    stackBehavior: tweenState.stackBehavior.DESTRUCTIVE
                });
        });
    },
    createTween: function() {
        if (!this.state.loading)
            return;

        this.tweenState("rotationTween", {
            easing: tweenState.easingTypes.linear,
            duration: 500,
            beginValue: Math.round(this.getTweeningValue('rotationTween')),
            endValue: Math.round(this.getTweeningValue('rotationTween')) + 360,
            onEnd: this.createTween
        });
    },
    getRotationTween: function() {
        return "rotate(" +
            Math.round(this.getTweeningValue('rotationTween'))
            + " 8 8)"
    },
    render: function() {
        return (
            <svg onClick={this.handleClick} className="pointer" viewBox="0 0 17 16" width="23" height="22">
                <path fill={"#"+ConfigStore.getGreen()} d="M17,11.6c-0.1-0.3-0.5-0.5-0.8-0.4l-0.9,0.3c0.5-1.1,0.8-2.3,0.8-3.5c0-4.4-3.6-8-8-8C3.6,0,0,3.6,0,8
	s3.6,8,8,8c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7c-3.7,0-6.7-3-6.7-6.7s3-6.7,6.7-6.7s6.7,3,6.7,6.7c0,1-0.2,2-0.7,2.9
	L13.8,10c-0.1-0.3-0.5-0.5-0.8-0.4c-0.3,0.1-0.5,0.5-0.4,0.8l0.8,2.4c0.1,0.3,0.3,0.5,0.6,0.5c0.1,0,0.1,0,0.2,0l2.4-0.8
	C16.9,12.3,17.1,12,17,11.6z"
                    transform={this.getRotationTween()} />
            </svg>
        )
    }
});

module.exports = RefreshButton;