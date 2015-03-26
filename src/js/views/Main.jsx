"use strict";

var React = require('react');
var MainBackground = require('./MainBackground.jsx');
var ReviewList = require('./ReviewList.jsx');
var Controls = require('./Controls.jsx');

var Main = React.createClass({
    render: function() {
        return (
            <section style={{width: "100%", height: "100%", position:"relative"}}>
                <MainBackground />
                <ReviewList />
                <Controls />
            </section>
        );
    }
});

module.exports = Main;
