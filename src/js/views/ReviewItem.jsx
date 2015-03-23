"use strict";

var React = require('react')
var ConfigStore = require('../stores/ConfigStore')
var classnames = require('classnames')

var ReviewItem = React.createClass({
    render: function() {

        var classNames = classnames({
            reviewItem: true,
            reviewLoading: this.props.loading
        })

        return (
            <section className={classNames}>
                <div className="reviewContent">
                    <div className="reviewSource">
                        {ConfigStore.getIconForType(this.props.type)}
                    </div>
                    <div className="reviewTitle">
                        <p><a href={this.props.url} target="_blank">{this.props.title}</a></p>
                        <div>{this.props.stars} out of 5</div>
                    </div>
                    <div  className="reviewStatus">
                        <h1>{this.props.numReviews}</h1>
                        <h4>reviews</h4>
                        <span>new</span>
                    </div>
                </div>
                <div>
                    {this.props.lastFive}
                </div>
            </section>
        )
    }
});

module.exports = ReviewItem;