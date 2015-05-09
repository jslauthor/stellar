"use strict"

var React = require('react')
var _ = require('lodash')
var classnames = require('classnames')

var ContinueButton = React.createClass({
    getDefaultProps: function() {
        return {
            label: "",
            isVerifying: false,
            onClick: null
        }
    },
    handleClick: function(e) {
        if (_.isFunction(this.props.onClick)) {
            this.props.onClick(e)
        }
    },
    render: function() {

        var classes = classnames({
            "sign-up-btn": true,
            "pointer": true
        })

        var loadingClass = classnames({
            verificationLoading: this.props.isVerifying
        })

        return (
            <button className={classes} onClick={this.handleClick}>
                <div className={loadingClass}></div>
                {this.props.label}
            </button>
        )
    }
})

module.exports = ContinueButton