"use strict";

var React = require('react')
var ToggleButton = require ('./controls/ToggleButton.jsx')
var RefreshButton = require ('./controls/RefreshButton.jsx')
var AddButton = require ('./controls/AddButton.jsx')
var SettingsButton = require ('./controls/SettingsButton.jsx')
var reviewStore = require('../stores/ReviewStore')
var ListenerMixin = require('alt/mixins/ListenerMixin')
var classnames = require('classnames')
var _ = require('lodash')

var Controls = React.createClass({
    mixins: [ListenerMixin],
    getInitialState: function() {
        return {
            lastUpdate: reviewStore.getState().lastUpdate,
            reviews: reviewStore.getState().reviews
        }
    },
    onChange: function() {
        this.setState(this.getInitialState())
    },
    componentDidMount: function() {
        this.listenTo(reviewStore, this.onChange)
    },
    render: function() {

        var lastUpdateClasses = classnames({
            "last-update": true,
            hide: _.isUndefined(this.state.reviews) || _.size(this.state.reviews) == 0
        })

        return (
          <section className="mainControls">
              <ToggleButton />
              <RefreshButton />
              <div className={lastUpdateClasses}>{this.state.lastUpdate}</div>
              <AddButton />
              <SettingsButton />
          </section>
        );
    }

});

module.exports = Controls;

