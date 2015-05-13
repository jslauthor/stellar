"use strict"

var React = require('react');
var ListenerMixin = require('alt/mixins/ListenerMixin')
var announcementStore = require('../../stores/AnnouncementStore')
var announcementAction = require('../../actions/AnnouncementActions')
var gui = require('nw.gui')
var CloseButton = require('../controls/CloseButton.jsx')
var validator = require('validator')

var AnnouncementBanner = React.createClass({
    mixins: [ListenerMixin],
    getInitialState: function() {
        return announcementStore.getState()
    },
    componentDidMount: function() {
        this.listenTo(announcementStore, this.onChange)
    },
    onChange: function() {
        this.setState(this.getInitialState())
    },
    handleClick: function() {
        if (validator.isURL(this.state.link, {require_protocol: true}))
            gui.Shell.openExternal(this.state.link)
    },
    handleDismiss: function() {
        announcementAction.dismiss()
    },
    render: function() {
        return (
            <div className="banner" style={{display:this.state.isDismissed ? "none" : "flex"}}>
                <div className="marquee marquee-speed-slow marquee-movement-smooth marquee-direction-left" onClick={this.handleClick} data-marquee={this.state.message}></div>
                <CloseButton className="close" clickHandler={this.handleDismiss} />
            </div>

        )
    }
})

module.exports = AnnouncementBanner
