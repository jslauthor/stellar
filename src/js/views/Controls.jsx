"use strict";

var React = require('react');
var ToggleButton = require ('./controls/ToggleButton.jsx');

var Controls = React.createClass({
    render: function() {
        return (
          <section className="mainControls">
              <ToggleButton />
          </section>
        );
    }

});

module.exports = Controls;

