"use strict"

var React = require('react')

var CloseButton = React.createClass({
    render: function() {
        return (
            <svg viewBox="0 0 16 15" width="16" height="15">
                <g>
                    <polygon fill="#FFFFFF" points="16,12 11,7.2 15.6,2.8 12.7,0 8.1,4.4 3.5,0 0.6,2.8 5.2,7.2 0,12.2 2.9,15 8.1,10 13.1,14.8 	"/>
                </g>
            </svg>
        )
    }
})

module.exports = CloseButton