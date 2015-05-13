"use strict";

var React = require('react');
var MainBackground = require('./MainBackground.jsx');
var ReviewList = require('./ReviewList.jsx');
var Controls = require('./Controls.jsx');
var AddItem = require('./AddItem.jsx')
var SignUp = require('./SignUp.jsx')
var reviewStore = require('../stores/ReviewStore')
var classnames = require('classnames')
var ListenerMixin = require('alt/mixins/ListenerMixin')
var OSUtil = require('../utils/OSUtil')
var listStore = require('../stores/ListStore')
var _ = require('lodash')

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

        this.props.tray.icon = OSUtil.getIconPath()
    },
    render: function() {

        var popUpContainer
        if (this.state.showReviewPopup)
        {
            var popClasses = classnames({
                "flex-container" : true,
                "flex-container-mac" : !OSUtil.isWindows()
            })

            var listStoreState = listStore.getState()
            var popup = listStoreState.isValid || _.size(this.state.reviews) < 1 ? <AddItem /> : <SignUp />
            popUpContainer = <section id="popUpContainer" style={{position:"absolute", top: 0, left: 0, right: 0, bottom: 0}}>
                <div className={popClasses}>
                    {popup}
                </div>
            </section>
        }

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
                {popUpContainer}
            </main>

        );
    }
});

module.exports = Main;
