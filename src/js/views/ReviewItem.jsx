"use strict";

var React = require('react')
var ConfigStore = require('../stores/ConfigStore')
var classnames = require('classnames')
var truncate = require('html-truncate')
var Stars = require('./components/Stars.jsx')
var pluralize = require('pluralize')
var DeleteButton = require('./controls/DeleteButton.jsx')
var reviewAction = require('../actions/ReviewAction')
var gui = require('nw.gui');

var ReviewItem = React.createClass({
    handleClick: function() {
        reviewAction.markAsSeen(this.props.reviewID)
    },
    handleLink: function() {
        gui.Shell.openExternal(this.props.url)
        reviewAction.markAsSeen(this.props.reviewID)
    },
    handleValidation: function () {

    },
    render: function() {

        var classNames = classnames({
            reviewItem: true,
            reviewLoading: this.props.loading,
            reviewError: (this.props.requiresValidation || this.props.error) && !this.props.loading
        })

        var contentClasses = classnames({
            reviewContent: true,
            jiggle: this.props.isEditing
        })

        var num = this.props.numReviews ? this.props.numReviews.length : 0;
        var numReviewClasses = classnames({
            sm: num > 6,
            md: num <= 6 && num > 3,
            lg: num <= 3
        })

        var validation
        if (this.props.requiresValidation)
            validation =
                <div className="requiresValidation">
                    <button className="pointer" onClick={this.handleValidation}>Validate with Amazon</button>
                </div>

        var newComponent
        if (this.props.hasNew)
            newComponent = <p className="pointer" onClick={this.handleClick}><span>NEW</span></p>

        var reviewSource
        if (!this.props.isEditing)
            reviewSource = ConfigStore.getIconForType(this.props.type)
        else
            reviewSource = <DeleteButton reviewID={this.props.reviewID} />

        return (
            <section className={classNames}>
                <div className={contentClasses}>
                    <div className="reviewSource">
                        {reviewSource}
                    </div>
                    <div className="reviewInfo">
                        <div ref="reviewTitle" className="reviewTitle">
                            <p><a className="pointer" onClick={this.handleLink}>{truncate(this.props.title, 45)}</a></p>
                        </div>
                        <div className="reviewAvg">
                            <Stars stars={this.props.stars} />
                            <span className="review-avg-text">{this.props.stars}</span> AVG
                        </div>
                    </div>
                    <div className="reviewStatus">
                        <h1 className={numReviewClasses}><a className="pointer" onClick={this.handleLink}>{this.props.numReviews}</a></h1>
                        <h4>{pluralize('review', this.props.numReviews)}</h4>
                        {newComponent}
                    </div>
                </div>
                {validation}
            </section>
        )
    }
});

module.exports = ReviewItem;