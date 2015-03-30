"use strict";

var React = require('react')
var reviewStore = require('../stores/ReviewStore');
var ListenerMixin = require('alt/mixins/ListenerMixin')
var _ = require('lodash')
var ReviewItem = require('./ReviewItem.jsx')
var reviewAction = require('../actions/ReviewAction')
var TimeoutTransitionGroup = require('../addons/TimeoutTransitionGroup')

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
    componentDidUpdate: function() {
        if (this.state.shouldScrollToBottom)
        {
            var list = this.refs.listRef.getDOMNode();
            list.scrollTop = list.scrollHeight;
            reviewAction.resetScrollToBottom();
        }
    },
    render: function () {

        var reviewItems = [];
        var self = this;
        _.forEach(this.state.reviews, function (item) {
            reviewItems.push(
                <ReviewItem
                    key={item.id}
                    reviewID={item.id}
                    title={item.title}
                    url={item.url}
                    stars={item.stars}
                    type={item.type}
                    numReviews={item.numReviews}
                    hasNew={item.hasNew}
                    loading={item.loading}
                    error={item.error}
                    isEditing={self.state.isEditing} />
            )
        })

        return (
            <section ref="listRef" className="reviewList">
                <TimeoutTransitionGroup
                    enterTimeout={0}
                    leaveTimeout={0}
                    transitionName="list-animation">
                    {reviewItems}
                </TimeoutTransitionGroup>
            </section>
        )
    }
});

module.exports = ReviewList;