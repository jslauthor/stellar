var alt = require("../alt")

class ListActions {

    constructor() {
        this.generateActions(
            'goNext',
            'goBack'
        )
    }

    changeStep(step) {
        this.dispatch(step)
    }

}

module.exposts = alt.createActions(ListActions)