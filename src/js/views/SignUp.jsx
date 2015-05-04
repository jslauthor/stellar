"use strict"

var React = require('react/addons')
var ReactTransitionGroup = React.addons.CSSTransitionGroup;
var classnames = require('classnames')
var Heart = require('./components/Heart.jsx')
var CloseButton = require('./controls/CloseButton.jsx')
var CircleStepIndicator = require('./controls/CircleStepIndicator.jsx')
var validator = require('validator')
var reviewAction = require('../actions/ReviewAction')

var SignUp = React.createClass({
    getInitialState: function() {
        return {
            formError: false,
            isNew: false,
            currentStep: 1
        }
    },
    handleClick: function(event) {
        this.setState({formError: false}, function() {
            // lame hack to reset css animation
            this.refs.urlInput.getDOMNode().offsetWidth = this.refs.urlInput.getDOMNode().offsetWidth;

            var inputValue = this.refs.urlInput.getDOMNode().value;
            if (validator.isEmail(inputValue)) {

            }
            else
                this.setState({formError: true})
        })
    },
    handleClose: function(event) {
        reviewAction.hideAddReviewPopup()
    },
    handleOnNew: function() {
        this.setState({isNew:true, currentStep:2});
    },
    handleOnRegister: function() {
        this.setState({isNew:false, currentStep:2});
    },
    handleKeyUp: function(event) {
        if (event.keyCode == 13) // enter
            this.handleClick()
        else if (event.keyCode ==27) // escape
            this.handleClose()
    },
    render: function() {

        var inputClasses = classnames({error: this.state.formError})
        var containerClasses = classnames({
            shake: this.state.formError,
            "sign-up-container": true
        })

        var containerHeight = 120;

        var headerContent
        if (this.state.currentStep <= 2)
            headerContent =
                <div>
                    <h1>Do you <Heart className="heart" /> stellar?</h1>
                    <h4>(it loves you too)</h4>
                    <p>Add more than one Starlet after you register! Totally <i>FREE</i></p>

                </div>

        var content
        var continueButton
        if (this.state.currentStep == 1) {
            content =
                <div key="askNew">
                    <button className="btn pointer" onClick={this.handleOnNew}>I'M NEW</button>
                    <button className="btn mute pointer" onClick={this.handleOnRegister}>I'M REGISTERED</button>
                </div>
        }
        else if (this.state.currentStep == 2 && this.state.isNew) {
            content =
                <div key="isNew">
                    <input ref="nameInput" placeholder="First Name" type="text" maxLength="25" required pattern="[a-zA-Z0-9]+"
                        className={inputClasses} onKeyUp={this.handleKeyUp} />
                    <input ref="urlInput" placeholder="Email" type="email" required
                        className={inputClasses} onKeyUp={this.handleKeyUp} />
                </div>
            continueButton =
                <button key="closeBtn" className="sign-up-btn pointer" onClick={this.handleClick}>SIGN ME UP!</button>

            containerHeight = 100;
        }
        else if (this.state.currentStep == 2 && !this.state.isNew) {
            content =
                <div key="notNew">
                    <input ref="urlInput" placeholder="Registered Email" type="email" required
                        className={inputClasses} onKeyUp={this.handleKeyUp} />
                </div>
            continueButton =
                <button key="closeBtn" className="sign-up-btn pointer" onClick={this.handleClick}>VALIDATE ME!</button>

            containerHeight = 50;
        }

        return (
            <main className={containerClasses} style={{"paddingBottom": this.state.currentStep != 1 ? "65px" : "15px"}}>

                {headerContent}

                <div style={{height : containerHeight+"px", width: "100%", textAlign: "center", overflow: "hidden", position: "relative"}}>
                    <ReactTransitionGroup transitionName="sign-up-animation">
                        {content}
                    </ReactTransitionGroup>
                </div>

                <CircleStepIndicator numSteps="3" currentStep={this.state.currentStep} />

                <button className="close-btn pointer" onClick={this.handleClose}>
                    <CloseButton />
                </button>

                <ReactTransitionGroup transitionName="sign-btn-animation">
                    {continueButton}
                </ReactTransitionGroup>

            </main>
        )

    }

})

module.exports = SignUp;