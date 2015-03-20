"use strict";

var React = require('react');
var cheerio = require('cheerio');
var request = require('browser-request');
var MainBackground = require('./MainBackground.jsx');

var Main = React.createClass({
    getDefaultProps: function() {
        return {
            page: "http://www.amazon.com/Get-Whats-Yours-Secrets-Security-ebook/dp/B00LD1OPP6/ref=zg_bs_tab_pd_bsnr_1"
        }
    },
    getInitialState: function() {
        return {
            loading: true,
            numReviews: ""
        }
    },
    componentWillMount: function() {


    },
    componentDidMount: function() {
        console.log(this.props.page);
        var self = this;
        request(this.props.page, function(er, response, body) {
            var $ = cheerio.load(body);

            //console.log($('.swSprite').first().text());
            console.log($('.crAvgStars').first().children("a").text());
            self.setState(
                {
                    loading: false,
                    numReviews: self.getNumberOfReviews($('.crAvgStars').first().children("a").text())
                }
            );
        });
    },
    getNumberOfReviews: function(reviewString) {
        console.log(reviewString);
        var matches = /(\d+).*/gi.exec(reviewString);
        return !matches || matches.length < 1 ? 0 : matches[1];
    },
    render: function() {

        var status;
        if (this.state.loading) {
            status = "Loading...";
        } else {
            status = this.state.numReviews + " motherfucking reviews";
        }

        return (
            <section style={{width: "100%", height: "100%", position:"relative"}}>
                <MainBackground className="mainBackground" />
                <div className="mainContent">{status}</div>
            </section>
        );
    }
});

module.exports = Main;
