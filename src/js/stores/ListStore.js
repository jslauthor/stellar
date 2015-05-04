"use strict"

var ListActions = require('../actions/ListActions')
var gui = require('nw.gui')

class ListStore {

    constructor() {
        this.bindActions(ListActions)

        this.isNew = false
        this.currentStep = 1
        this.hasValidated = false
        this.email

        this.on('serialize', () => {
            var state = _.cloneDeep(this.alt.stores.ListStore.getState());
            delete state.isNew
            delete state.currentStep

            return state;
        });
    }

    function onChangeStep(step) {
        this.currentStep = step
    }

    function onNext() {
        this.currentStep = Math.min(3, ++this.currentStep)
    }

    function onBack() {
        this.currentStep = Math.min(1, --this.currentStep)
    }
}

module.exports = alt.createStore(ListStore)