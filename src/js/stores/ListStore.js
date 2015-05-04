"use strict"

var ListActions = require('../actions/ListActions')
var gui = require('nw.gui')

class ListStore {

    constructor() {
        this.bindActions(ListActions)
    }



}

module.exports = alt.createStore(ListStore)