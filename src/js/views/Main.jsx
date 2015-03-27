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
    getInitialState: function() {
        return reviewStore.getState()
    },
    componentDidMount() {
        this.listenTo(reviewStore, this.onChange)
    },

    onChange() {
        this.setState(this.getInitialState())
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
