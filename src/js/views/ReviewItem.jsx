"use strict";

var React = require('react')
var ConfigStore = require('../stores/ConfigStore')
var classnames = require('classnames')
var truncate = require('html-truncate')
var Stars = require('./components/Stars.jsx')
var pluralize = require('pluralize')
var DeleteButton = require('./controls/DeleteButton.jsx')

var ReviewItem = React.createClass({
    render: function() {

        var classNames = classnames({
            reviewItem: true,
            reviewLoading: this.props.loading
        })

        var num = this.props.numReviews ? this.props.numReviews.length : 0;
        var numReviewClasses = classnames({
            sm: num > 6,
            md: num <= 6 && num > 3,
            lg: num <= 3
        })

        var newComponent
        if (this.props.hasNew)
            newComponent = <p><span>NEW</span></p>

        var reviewSource
        if (!this.props.isEditing)
            reviewSource = ConfigStore.getIconForType(this.props.type)
        else
            reviewSource = <DeleteButton reviewID={this.props.reviewID} />

        return (
            <section className={classNames}>
                <div className="reviewContent">
                    <div className="reviewSource">
                        {reviewSource}
                    </div>
                    <div className="reviewInfo">
                        <div ref="reviewTitle" className="reviewTitle">
                            <p><a href={this.props.url} target="_blank">{truncate(this.props.title, 55)}</a></p>
                        </div>
                        <div className="reviewAvg">
                            <Stars stars={this.props.stars} />
                            <span className="review-avg-text">{this.props.stars}</span> AVG
                        </div>
                    </div>
                    <div className="reviewStatus">
                        <h1 className={numReviewClasses}>{this.props.numReviews}</h1>
                        <h4>{pluralize('review', this.props.numReviews)}</h4>
                        {newComponent}
                    </div>
                </div>
            </section>
        )
    }
});

module.exports = ReviewItem;