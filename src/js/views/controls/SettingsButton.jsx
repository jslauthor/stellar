"use strict";

var React = require('react')
var ConfigStore = require('../../stores/ConfigStore')
var gui = window.require('nw.gui')
var reviewAction = require('../../actions/ReviewAction')

var menu;

var SettingsButton = React.createClass({
    getInitialState: function() {
        return {
        }
    },
    componentDidMount: function() {
        menu = new gui.Menu();
        menu.append(new gui.MenuItem({
            label: 'Edit starlets',
            click: function() {
                reviewAction.toggleEditing()
            }
        }));
        menu.append(new gui.MenuItem({
            label: 'Open at startup',
            type: "checkbox",
            checked: true
        }));
        menu.append(new gui.MenuItem({ type: 'separator' }));
        menu.append(new gui.MenuItem({
            label: 'Join J.S.L. Newsletter',
            click: function() {
                gui.Shell.openExternal('http://www.jslauthor.com/sign-up');
            }
        }));
    },
    handleClick: function(event) {
        console.log(event)
        menu.popup(event.clientX+5, event.clientY+5)
    },
    render: function() {
        return (
            <svg onClick={this.handleClick} className="pointer" width="22" height="18" viewBox="0 0 17 17">
                <path fill={"#"+ConfigStore.getGreen()} d="M17,8.5c0-0.6-0.5-1.3-1-1.5c-0.6-0.2-1.1-0.7-1.3-1.1c-0.2-0.4-0.1-1.1,0.1-1.7c0.3-0.5,0.1-1.3-0.3-1.8
	c-0.4-0.4-1.2-0.6-1.8-0.3c-0.5,0.3-1.3,0.3-1.7,0.1C10.7,2.1,10.2,1.6,10,1C9.8,0.5,9.1,0,8.5,0C7.9,0,7.2,0.5,7,1
	C6.8,1.6,6.3,2.1,5.9,2.3C5.5,2.4,4.8,2.4,4.3,2.1C3.7,1.9,2.9,2,2.5,2.5C2,2.9,1.9,3.7,2.1,4.3c0.3,0.5,0.3,1.3,0.1,1.7
	C2.1,6.3,1.6,6.8,1,7C0.5,7.2,0,7.9,0,8.5S0.5,9.8,1,10c0.6,0.2,1.1,0.7,1.3,1.1c0.2,0.4,0.1,1.1-0.1,1.7c-0.3,0.5-0.1,1.3,0.3,1.8
	c0.4,0.4,1.2,0.6,1.8,0.3c0.5-0.3,1.3-0.3,1.7-0.1C6.3,14.9,6.8,15.4,7,16c0.2,0.6,0.9,1,1.5,1c0.6,0,1.3-0.5,1.5-1
	c0.2-0.6,0.7-1.1,1.1-1.3c0.4-0.2,1.1-0.1,1.7,0.1c0.5,0.3,1.3,0.1,1.8-0.3c0.4-0.4,0.6-1.2,0.3-1.8c-0.3-0.5-0.3-1.3-0.1-1.7
	c0.2-0.4,0.7-0.9,1.3-1.1C16.6,9.8,17,9.1,17,8.5z M8.5,11.6c-1.7,0-3.1-1.4-3.1-3.1c0-1.7,1.4-3.1,3.1-3.1c1.7,0,3.1,1.4,3.1,3.1
	C11.6,10.2,10.2,11.6,8.5,11.6z"/>
            </svg>
        )
    }
});

module.exports = SettingsButton;











