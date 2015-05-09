"use strict"

var React = require('react')
var _ = require('lodash')
var listActions = require('../../actions/ListActions')

var CircleStepIndicator = React.createClass({

    getDefaultProps: function() {
      return {
          numSteps: 2,
          currentStep: 1
      }
    },
    onCircleClick: function(key) {
        //listActions.changeStep(key)
    },
    render: function() {

        var spacing = 13
        var radius = 3.5
        var circles = _.map(_.range(this.props.numSteps), (value) => {

            var styles = {
                opacity: this.props.currentStep == value+1 ? 1 : .25,
                marginRight: "10px",
                verticalAlign: "middle"
            }

            return <circle key={value} style={styles} cx={radius + (value * spacing)} cy={radius} r={radius}
                           fill="#FFFFFF" onClick={() => {this.onCircleClick(value+1)}}></circle>

        });

        return (
            <svg height="7px" width={((spacing * (this.props.numSteps-1))+(radius*2))+"px"}
                styleName="display:inline">{circles}</svg>
        )
    }

})

module.exports = CircleStepIndicator