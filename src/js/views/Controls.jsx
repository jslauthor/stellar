"use strict";

var React = require('react');
var ToggleButton = require ('./controls/ToggleButton.jsx');
var RefreshButton = require ('./controls/RefreshButton.jsx');
var AddButton = require ('./controls/AddButton.jsx');
var SettingsButton = require ('./controls/SettingsButton.jsx');

var Controls = React.createClass({
    render: function() {
        return (
          <section className="mainControls">
              <ToggleButton />
              <RefreshButton />
              <AddButton />
              <SettingsButton />
          </section>
        );
    }

});

module.exports = Controls;

