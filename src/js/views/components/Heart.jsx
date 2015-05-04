"use strict"

var React = require('react')

var Heart = React.createClass({

    render: function() {
        return (
            <svg viewBox="0 0 27 24" height="27">
                <g>
                    <g>
                        <path fill-rule="evenodd" clip-rule="evenodd" fill="#F17894" d="M13.5,5.2C10-3.1,0.1-1.1,0,8.5c0,5.3,4.7,7.3,7.9,9.4
	c3.1,2.1,5.3,4.9,5.6,6.1c0.3-1.2,2.7-4.1,5.6-6.1c3.1-2.3,7.9-4.1,7.9-9.4C26.9-1.2,16.8-2.7,13.5,5.2z"/>
                    </g>
                </g>
            </svg>
        )
    }

})

module.exports = Heart