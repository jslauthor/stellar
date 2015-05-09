"use strict"

var React = require('react/addons')
var ReactTransitionGroup = require('../addons/TimeoutTransitionGroup');
var classnames = require('classnames')
var Heart = require('./components/Heart.jsx')
var ContinueButton = require('./controls/ContinueButton.jsx')
var CloseButton = require('./controls/CloseButton.jsx')
var CircleStepIndicator = require('./controls/CircleStepIndicator.jsx')
var validator = require('validator')
var reviewAction = require('../actions/ReviewAction')
var listActions = require('../actions/ListActions')
var ListenerMixin = require('alt/mixins/ListenerMixin')
var _ = require('lodash')
var listStore = require('../stores/ListStore')

var SignUp = React.createClass({
    mixins: [ListenerMixin],
    getInitialState: function() {
        return _.merge(listStore.getState(), {urlError:false, nameError:false});
    },
    componentDidMount: function() {
        this.listenTo(listStore, this.onChange)
    },
    componentWillMount: function() {
        //listActions.reset()
    },
    onChange() {
        this.setState(listStore.getState())
    },
    handleClick: function(event) {
        this.setState({urlError: false, nameError: false}, function() {
            // lame hack to reset css animation
            if (!_.isUndefined(this.refs.urlInput))
                this.refs.urlInput.getDOMNode().offsetWidth = this.refs.urlInput.getDOMNode().offsetWidth

            var nameValue = !_.isUndefined(this.refs.nameInput) ? this.refs.nameInput.getDOMNode().value : this.state.firstName
            var inputValue = !_.isUndefined(this.refs.urlInput) ? this.refs.urlInput.getDOMNode().value : this.state.email

            var isURLError = !validator.isEmail(inputValue)
            var isNameError = !validator.isAlpha(nameValue)

            this.setState({urlError: isURLError, nameError: isNameError})

            if (!isURLError && (!isNameError || !this.state.isNew)) {
                if (!this.state.isNew || this.state.currentStep == 3)
                    listActions.validateEmail(inputValue)
                else
                    listActions.subscribe(nameValue, inputValue)
            }
        })
    },
    handleClose: function(event) {
        reviewAction.hideAddReviewPopup()
    },
    handleOnNew: function() {
        listActions.setIsNew(true)
        listActions.next()
    },
    handleOnRegister: function() {
        listActions.setIsNew(false)
        listActions.next()
    },
    handleSignUpClick: function() {
        listActions.setIsNew(true)
        listActions.changeStep(2)
    },
    handleKeyUp: function(event) {
        if (event.keyCode == 13) // enter
            this.handleClick()
        else if (event.keyCode ==27) // escape
            this.handleClose()
    },
    handleBackClick: function() {
        listActions.back();
    },
    render: function() {

        var urlClasses = classnames({error: this.state.urlError})
        var nameClasses = classnames({error: this.state.nameError})

        var containerClasses = classnames({
            shake: (this.state.urlError || (this.state.nameError && this.state.isNew)) && this.state.currentStep == 2,
            "sign-up-container": true
        })

        var reverse = this.state.direction == 1 ? "" : "-reverse"

        var containerHeight = 120;

        var backLink
        if (this.state.currentStep > 1)
            backLink = <button onClick={this.handleBackClick}>Back</button>

        var msg = <p>Add more than one Starlet after you register! Totally <i>FREE</i></p>

        if (this.state.validateError || this.state.subscribeError)
            msg = <p><span className="error-msg">Uh oh! Looks like there was a problem. Try again or sign up at J.S.L's website.</span></p>
        else if (this.state.currentStep == 3) {
            msg = <h2>{this.state.email}</h2>
        }
        else if (this.state.validateResponse && !this.state.isValid) {
            msg = <p><span className="error-msg">Couldn't find your email. Did you receive a confirmation email and click the link? You can also <span className="link" onClick={this.handleSignUpClick}>sign up here</span></span></p>
        }

        var headerContent
        if (this.state.currentStep <= 2)
            headerContent =
                <div>
                    <h1>Do you <Heart className="heart" /> stellar?</h1>
                    <h4>(it loves you too)</h4>
                    {msg}
                </div>
        else if (this.state.currentStep == 3)
            headerContent =
                <div className="last-step">
                    <h1>OMG</h1>
                    <h4>(almost done)</h4>
                    {msg}
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

                    <input ref="nameInput" placeholder="First Name" maxLength="25" type="text" pattern="[a-zA-Z]+" required
                        className={nameClasses} onKeyUp={this.handleKeyUp} defaultValue={this.state.firstName} />
                    <input ref="urlInput" placeholder="Email" type="email" required
                        className={urlClasses} onKeyUp={this.handleKeyUp} defaultValue={this.state.email} />
                </div>
            continueButton =
                <ContinueButton key="closeBtn" onClick={this.handleClick} label="SIGN ME UP!" isVerifying={this.state.isVerifying} />

            containerHeight = 100;
        }
        else if (this.state.currentStep == 2 && !this.state.isNew) {
            content =
                <div key="notNew">
                    <input ref="urlInput" placeholder="Registered Email" type="email" required
                        className={urlClasses} onKeyUp={this.handleKeyUp} defaultValue={this.state.email} />
                </div>
            continueButton =
                <ContinueButton key="closeBtn" onClick={this.handleClick} label="VALIDATE & ADD STARTLET" isVerifying={this.state.isVerifying} />

            containerHeight = 50;
        }
        else if (this.state.currentStep == 3) {

            if (this.state.validateResponse && !this.state.isValid)
                content = <p>Uh oh! couldn't find your email. Did you confirm the subscription?</p>
            else
                content = <p>Thanks {this.state.firstName}! Just one more tiny step. You should have received a confirmation email. Once you've confirmed, click the confirmation button and go nuts adding starlets all day long.</p>

            continueButton =
                <ContinueButton key="closeBtn" onClick={this.handleClick} label="I'VE CONFIRMED" isVerifying={this.state.isVerifying} />

            containerHeight = this.state.validateResponse && !this.state.isValid ? 60 : 120;
        }

        return (
            <main className={containerClasses} style={{"paddingBottom": this.state.currentStep != 1 ? "55px" : "15px"}}>

                {headerContent}

                <div style={{height : containerHeight+"px", width: "100%", textAlign: "center", overflow: "hidden", position: "relative"}}>
                    <ReactTransitionGroup transitionName={"sign-up-animation"+reverse} enterTimeout={500} leaveTimeout={500}>
                        {content}
                    </ReactTransitionGroup>
                </div>

                <div className="step-status">
                    {backLink}
                    <CircleStepIndicator numSteps={this.state.isNew || this.state.currentStep == 1 ? 3 : 2} currentStep={this.state.currentStep} />
                </div>

                <button className="close-btn pointer" onClick={this.handleClose}>
                    <CloseButton />
                </button>

                <ReactTransitionGroup transitionName="sign-btn-animation" enterTimeout={500} leaveTimeout={500}>
                    {continueButton}
                </ReactTransitionGroup>

            </main>
        )

    }

})

module.exports = SignUp;