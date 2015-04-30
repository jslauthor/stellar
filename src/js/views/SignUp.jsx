"use strict"

var React = require('react')
var classnames = require('classnames')

var SignUp = React.createClass({
    getInitialState: function() {
        return { formError: false }
    },
    render: function() {

        var containerClasses = classnames({
            shake: this.state.formError,
            "sign-up-container": true
        })

        return (
            <main className={containerClasses}>
               hello
            </main>
        )

    }

})

module.exports = SignUp;