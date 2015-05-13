"use strict"

var ListActions = require('../actions/ListActions')
var gui = require('nw.gui')
var alt = require('../alt')
var _ = require('lodash')
var LocalStorageUtil = require('../utils/LocalStorageUtil')
var mixpanel = require('../mixpanel')
var keys = require('../keys')

class ListStore {

    constructor() {
        this.bindActions(ListActions)

        this.isNew = false
        this.currentStep = 1
        this.isValid = false
        this.email = null
        this.firstName = null
        this.isVerifying = false
        this.lastRefresh
        this.direction = 1

        this.subscribeError = null
        this.subscribeResponse = null

        this.validateError = null
        this.validateResponse = null

        this.on('serialize', () => {
            var state = _.cloneDeep(this.alt.stores.ListStore.getState())
            delete state.isNew
            delete state.currentStep
            delete state.isVerifying
            delete state.subscribeError
            delete state.subscribeResponse
            delete state.validateError
            delete state.validateResponse

            return state
        })
    }

    onReset() {
        this.isNew = false
        this.currentStep = 1
        this.isValid = false
        this.email = null
        this.firstName = null
        this.isVerifying = false
        this.lastRefresh

        this.subscribeError = null
        this.subscribeResponse = null

        this.validateError = null
        this.validateResponse = null
    }

    onSetIsNew(isNew) {
        this.isNew = isNew
    }

    onSubscribe() {
        this.isVerifying = true
        this.subscribeError = null
        this.subscribeResponse = null
        this.validateError = null
        this.validateResponse = null
        LocalStorageUtil.saveAll()
    }

    onSubscribeComplete(subscribeObj) {
        this.firstName = subscribeObj.firstName
        this.email = subscribeObj.email
        this.subscribeError = subscribeObj.error
        this.subscribeResponse = subscribeObj.response
        this.isVerifying = false

        if (subscribeObj.isValid)
            this._setCurrentStep(3)

        mixpanel.track(keys.SUBSCRIBED, {
            name: subscribeObj.firstName,
            email: subscribeObj.email,
            valid: subscribeObj.isValid
        })

        LocalStorageUtil.saveAll()
    }

    onValidateEmail() {
        this.isVerifying = true
        this.subscribeError = null
        this.subscribeResponse = null
        this.validateError = null
        this.validateResponse = null
        LocalStorageUtil.saveAll()
    }

    onValidateComplete(validatedObject) {
        this.email = validatedObject.email
        this.isValid = validatedObject.isValid
        this.validateError = validatedObject.error
        this.validateResponse = validatedObject.response
        this.isVerifying = false

        if (!this.serverError)
            this.lastRefresh = new Date()

        mixpanel.track(keys.VALIDATED, {
            email: validatedObject.email,
            valid: validatedObject.isValid
        })

        this.alt.stores.ReviewStore.emitChange()
        LocalStorageUtil.saveAll()
    }

    onChangeStep(step) {
        this._setCurrentStep(step)

        this.subscribeError = null
        this.subscribeResponse = null
        this.validateError = null
        this.validateResponse = null
    }

    onNext() {
        this._setCurrentStep(Math.min(3, this.currentStep+1))
    }

    onBack() {
        this._setCurrentStep(Math.max(1, this.currentStep-1))

        if (this.currentStep == 1) {
            this.subscribeError = null
            this.subscribeResponse = null
            this.validateError = null
            this.validateResponse = null
        }
    }

    _setCurrentStep(step) {
        this.direction = step > this.currentStep ? 1 : -1
        this.currentStep = step
    }
}

module.exports = alt.createStore(ListStore, 'ListStore')