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
var moment = require('moment')

var Controls = React.createClass({
    mixins: [ListenerMixin],
    getInitialState: function() {
        return {
            lastUpdate: reviewStore.getState().lastUpdate,
            reviews: reviewStore.getState().reviews,
            isMonitoring: reviewStore.getState().isMonitoring,
            nextUpdate: reviewStore.getState().nextUpdateTime
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

        var nextUpdateLabel
        if (!this.state.isMonitoring)
            nextUpdateLabel = "Monitoring Off"
        else if (this.state.nextUpdate > 0)
            nextUpdateLabel = moment(this.state.nextUpdate).format("mm:ss")
        else
            nextUpdateLabel = "Loading"

        return (
          <section className="mainControls">
              <ToggleButton />
              <div className={lastUpdateClasses}>
                  <p className="next-update"><i>Next Update:</i> {nextUpdateLabel}</p>
                  <p><i>Last Updated:</i> {this.state.lastUpdate}</p>
              </div>
              <AddButton />
              <SettingsButton />
          </section>
        );
    }

});

module.exports = Controls;

