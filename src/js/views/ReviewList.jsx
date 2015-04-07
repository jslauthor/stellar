"use strict";

var React = require('react/addons')
var ReactTransitionGroup = React.addons.CSSTransitionGroup;
var reviewStore = require('../stores/ReviewStore');
var ListenerMixin = require('alt/mixins/ListenerMixin')
var _ = require('lodash')
var ReviewItem = require('./ReviewItem.jsx')
var reviewAction = require('../actions/ReviewAction')
var AddButton = require ('./controls/AddButton.jsx')
var StellarIcon = require('./components/StellarIcon.jsx')

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
                    requiresValidation={item.requiresValidation}
                    isEditing={self.state.isEditing} />
            )
        })

        if (reviewItems.length == 0)
            reviewItems.push(
                <div key="noItemMsg" className="no-item-msg">
                    <span><p>Welcome to</p><StellarIcon /></span>

                    <p>Add a starlet with the <AddButton/> button!</p>
                </div>
            )

        return (
            <section ref="listRef" className="reviewList">
                <ReactTransitionGroup transitionName="list-animation">
                    {reviewItems}
                </ReactTransitionGroup>
            </section>
        )
    }
});

module.exports = ReviewList;