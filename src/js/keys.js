var keymirror = require('keymirror')
var keys = keymirror({
    HELP_CLICKED: null,
    JOIN_CLICKED: null,
    SUBSCRIBED: null,
    VALIDATED: null,
    DISMISSED_ANNOUNCEMENT: null,
    SHARE_CLICKED: null,
    REVIEW_ADDED: null,
    REVIEW_DELETED: null,
    TOGGLE_MONITORING: null,
    TOGGLE_NOTIFICATIONS: null
})

module.exports = keys
