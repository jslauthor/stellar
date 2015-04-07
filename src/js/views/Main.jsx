"use strict";

var React = require('react');
var MainBackground = require('./MainBackground.jsx');
var ReviewList = require('./ReviewList.jsx');
var Controls = require('./Controls.jsx');
var AddItem = require('./AddItem.jsx')
var reviewStore = require('../stores/ReviewStore')
var classnames = require('classnames')
var ListenerMixin = require('alt/mixins/ListenerMixin')

var Main = React.createClass({
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

        if (this.state.hasValidationRequirment)
            this.props.tray.icon = 'img/tray_icon_error@2x.png'
        else if (this.state.hasNewReviews)
            this.props.tray.icon = 'img/tray_icon_alert@2x.png'
        else
            this.props.tray.icon = 'img/tray_icon@2x.png'
    },
    render: function() {

        var popup
        if (this.state.showReviewPopup)
            popup = <AddItem style={{position: "absolute"}} />

        var classes = classnames({
            "main-section": true,
            blur: this.state.showReviewPopup
        })

        return (
            <main style={{width: "100%", height: "100%", position:"relative"}}>
                <section className={classes}>
                    <MainBackground />
                    <ReviewList />
                    <Controls />
                </section>
                {popup}
            </main>

        );
    }
});

module.exports = Main;
