"use strict"

var React = require('react')
var reviewAction = require('../../actions/ReviewAction')

var DeleteButton = React.createClass({
    onDelete: function(event) {
        reviewAction.deleteReview(this.props.reviewID)
    },
    render: function() {
        return (
            <svg className="pointer" onClick={this.onDelete}
                viewBox="0 0 20 20" width="20" height="20">
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#E12147" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10c5.5,0,10-4.5,10-10
	C20,4.5,15.5,0,10,0z M16.6,12.5H3.4v-5h13.1V12.5z"/>
            </svg>
        )
    }
})

module.exports = DeleteButton;