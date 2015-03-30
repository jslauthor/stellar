"use strict";

var React = require('react')
var ToggleButton = require ('./controls/ToggleButton.jsx')
var RefreshButton = require ('./controls/RefreshButton.jsx')
var AddButton = require ('./controls/AddButton.jsx')
var SettingsButton = require ('./controls/SettingsButton.jsx')
var reviewStore = require('../stores/ReviewStore')
var ListenerMixin = require('alt/mixins/ListenerMixin')
//var SortMenu = require ('./controls/SortMenu.jsx');

var Controls = React.createClass({
    mixins: [ListenerMixin],
    getInitialState: function() {
        return {
            lastUpdate: reviewStore.getState().lastUpdate
        }
    },
    onChange: function() {
        this.setState({lastUpdate: reviewStore.getState().lastUpdate})
    },
    componentDidMount: function() {
        this.listenTo(reviewStore, this.onChange)
    },
    render: function() {
        return (
          <section className="mainControls">
              <ToggleButton />
              <RefreshButton />
              <div className="last-update">{this.state.lastUpdate}</div>
              <AddButton />
              <SettingsButton />
          </section>
        );
    }

});

module.exports = Controls;

