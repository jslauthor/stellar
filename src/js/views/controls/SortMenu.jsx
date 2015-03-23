"use strict";

var React = require('react');

var SortMenu = React.createClass({
    render: function() {
        return (
            <span className="sortMenu">
                <h4>sort:</h4>
                <button className="">review</button>
                <button className="">date</button>
                <button className="">average</button>
                <button className="">site</button>
            </span>
        )
    }
});

module.exports = SortMenu;