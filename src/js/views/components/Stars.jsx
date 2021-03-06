"use strict";

var React = require('react')
var ConfigStore = require('../../stores/ConfigStore')

var Stars = React.createClass({
    getDefaultProps: function() {
        return {
            stars: 0
        }
    },
    render: function() {

        var percent = ((this.props.stars > 0 ? Math.min(this.props.stars, 5) / 5 : 0) * 100) + "%";

        return (
            <svg viewBox="0 0 73 12" width="73" height="12">

                <path x="0" y="0" fill={"#"+ConfigStore.getDarkGreen()} d="M8.6,3.8L6.5,0L4.4,3.8L0,4.6l3,3.1L2.5,12l4-1.8l4,1.8L10,7.7
			l3-3.1L8.6,3.8z M23.6,3.8L21.5,0l-2.1,3.8L15,4.6l3,3.1L17.5,12l4-1.8l4,1.8L25,7.7l3-3.1L23.6,3.8z M38.6,3.8L36.5,0l-2.1,3.8
			L30,4.6l3,3.1L32.5,12l4-1.8l4,1.8L40,7.7l3-3.1L38.6,3.8z M53.6,3.8L51.5,0l-2.1,3.8L45,4.6l3,3.1L47.5,12l4-1.8l4,1.8L55,7.7
			l3-3.1L53.6,3.8z M73,4.6l-4.4-0.8L66.5,0l-2.1,3.8L60,4.6l3,3.1L62.5,12l4-1.8l4,1.8L70,7.7L73,4.6z"/>

                <svg width={percent} height="100%" style={{overflow:"hidden"}}>
                    <path x="0" y="0" fill={"#"+ConfigStore.getGreen()} d="M8.6,3.8L6.5,0L4.4,3.8L0,4.6l3,3.1L2.5,12l4-1.8l4,1.8L10,7.7
			l3-3.1L8.6,3.8z M23.6,3.8L21.5,0l-2.1,3.8L15,4.6l3,3.1L17.5,12l4-1.8l4,1.8L25,7.7l3-3.1L23.6,3.8z M38.6,3.8L36.5,0l-2.1,3.8
			L30,4.6l3,3.1L32.5,12l4-1.8l4,1.8L40,7.7l3-3.1L38.6,3.8z M53.6,3.8L51.5,0l-2.1,3.8L45,4.6l3,3.1L47.5,12l4-1.8l4,1.8L55,7.7
			l3-3.1L53.6,3.8z M73,4.6l-4.4-0.8L66.5,0l-2.1,3.8L60,4.6l3,3.1L62.5,12l4-1.8l4,1.8L70,7.7L73,4.6z"/>
                </svg>

            </svg>
        )
    }
})

module.exports = Stars;
