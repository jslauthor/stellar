"use strict"

var alt = require("../alt")
var request = require('browser-request')
var _ = require('lodash')

class ListActions {

    constructor() {
        this.generateActions(
            'next',
            'back'
        )
    }

    reset() {
        this.dispatch()
    }

    refresh(force) {
        force = _.isUndefined(force) ? false : force

        var listStoreState = this.alt.stores.ListStore.getState()
        var elapsedTime = new Date().getTime() - ((listStoreState.lastRefresh && Date.parse(listStoreState.lastRefresh)) || 0)

        if (!_.isUndefined(listStoreState.email) && (elapsedTime >= this.alt.stores.ConfigStore.getRefreshLength() || force))
            this.actions.validateEmail(listStoreState.email)

        this.dispatch()
    }

    setIsNew(isNew) {
        this.dispatch(isNew)
    }

    subscribe(firstName, email) {

        if (this.alt.stores.ListStore.getState().isVerifying || !email || !firstName)
            return false

        request('http://www.jslauthor.com/lists/7e621b32bb/subscribe/'+email+'/'+firstName, (err, response, body) => {

            var isValid = false

            if (!err && response.statusCode == 200)
                isValid = JSON.parse(response.response).success

            this.actions.subscribeComplete({firstName: firstName, email:email, isValid:isValid, error:err, response:response})

        })

        this.dispatch()
    }

    subscribeComplete(subscribeObj) {
        this.dispatch(subscribeObj)
    }

    validateEmail(email) {

        if (this.alt.stores.ListStore.getState().isVerifying || !email)
            return false

        request('http://www.jslauthor.com/lists/7e621b32bb/member-info/'+email, (err, response, body) => {

            var isValid = false

            if (!err && response.statusCode == 200)
                isValid = JSON.parse(response.response).exists

            this.actions.validateComplete({email:email, isValid:isValid, error:err, response:response})

        })

        this.dispatch()
    }

    validateComplete(validatedObject) {
        this.dispatch(validatedObject)
    }

    changeStep(step) {
        this.dispatch(step)
    }

}

module.exports = alt.createActions(ListActions)