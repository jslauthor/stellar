"use strict"

var React = require('react')
var reviewAction = require('../actions/ReviewAction')
var validator = require('validator')
var classnames = require('classnames')
var reviewAction = require('../actions/ReviewAction')
var CloseButton = require('./controls/CloseButton.jsx')

var urlOptions = { protocols: ['http','https'], require_protocol: true }

var AddItem = React.createClass({
    getInitialState: function() {
      return { formError: false }
    },
    handleClick: function(event) {
        this.setState({formError: false}, function() {
            // lame hack to reset css animation
            this.refs.urlInput.getDOMNode().offsetWidth = this.refs.urlInput.getDOMNode().offsetWidth;

            var inputValue = this.refs.urlInput.getDOMNode().value;
            if (validator.isURL(inputValue, urlOptions)
                && (inputValue.indexOf("amazon.com") != -1 || inputValue.indexOf("goodreads.com") != -1)) {
                reviewAction.addReview(inputValue)
                reviewAction.hideAddReviewPopup()
            }
            else
                this.setState({formError: true})
        })
    },
    handleKeyUp: function(event) {
        if (event.keyCode == 13) // enter
            this.handleClick()
        else if (event.keyCode ==27) // escape
            this.handleClose()
    },
    handleClose: function(event) {
        reviewAction.hideAddReviewPopup()
    },
    render: function() {

        var inputClasses = classnames({error: this.state.formError})
        var containerClasses = classnames({
            shake: this.state.formError,
            "add-item-container": true
        })

        return (
            <section className={containerClasses}>
                <main>
                    <h1>CREATE STARLET</h1>
                    <div>Amazon or Goodreads product URL (with http://)</div>
                    <input ref="urlInput" defaultValue="Enter URL" type="url"
                        className={inputClasses} onKeyUp={this.handleKeyUp} />
                    <div className="help-text">Need help? <a href="">Head here</a></div>
                </main>
                <button className="add-btn pointer" onClick={this.handleClick}>ADD IT!</button>
                <button className="close-btn pointer" onClick={this.handleClose}>
                    <CloseButton />
                </button>
            </section>
        )
    }
})

module.exports = AddItem;