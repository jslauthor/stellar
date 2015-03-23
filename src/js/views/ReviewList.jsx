"use strict";

var React = require('react');
var reviewStore = require('../stores/ReviewStore');
var ListenerMixin = require('alt/mixins/ListenerMixin');
var _ = require('lodash');
var ReviewItem = require('./ReviewItem.jsx')

var ReviewList = React.createClass({
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
    render: function () {

        var reviewItems = [];
        _.forEach(this.state.reviews, function (item) {
            reviewItems.push(
                <ReviewItem
                    key={item.id}
                    title={item.title}
                    url={item.url}
                    stars={item.stars}
                    type={item.type}
                    numReviews={item.numReviews}
                    new={item.new}
                    loading={item.loading}
                    lastFive={item.lastFive} />
            )
        })

        return (
            <section className="reviewList">{reviewItems}</section>
        )
    }
});

module.exports = ReviewList;