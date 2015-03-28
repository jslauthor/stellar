var alt = require('../alt')

var ALT_KEY = "ALT_STORAGE_KEY"

module.exports = {
    deleteAll: function() {
        localStorage.setItem(ALT_KEY, "")
    },

    saveAll: function() {
        localStorage.setItem(ALT_KEY, alt.takeSnapshot())
    },

    restore: function () {
        var altStore = localStorage.getItem(ALT_KEY)
        return (altStore && altStore) || ""
    }
}