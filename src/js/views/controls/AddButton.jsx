"use strict";

var React = require('react')
var ConfigStore = require('../../stores/ConfigStore')
var reviewAction = require('../../actions/ReviewAction')

var AddButton = React.createClass({
    getInitialState: function() {
        return {
        }
    },
    handleClick: function(event) {
        reviewAction.showAddReviewPopup();
    },
    render: function() {
        return (
            <svg x="0px" y="0px" viewBox="0 0 16 16" onClick={this.handleClick} className="pointer" width="22" height="18">
                <g>
                    <g>
                        <polygon fill-rule="evenodd" clip-rule="evenodd" fill={"#"+ConfigStore.getGreen()} points="16,6.9 9.1,6.9 9.1,0 6.9,0 6.9,6.9 0,6.9 0,9.1
			6.9,9.1 6.9,16 9.1,16 9.1,9.1 16,9.1 		"/>
                    </g>
                </g>
            </svg>
        )
    }
});

module.exports = AddButton;
