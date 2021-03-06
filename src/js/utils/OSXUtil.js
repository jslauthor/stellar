"use strict"

var async = require('async')
var exec = require('child_process').exec
var path = require('path')

var plistName = 'com.jslauthor.stellarApp.plist'
var plist = require("raw!../../"+plistName)

module.exports = {
    _createPlist: function(callback) {
        exec('echo \'' + plist + '\' > ~/Library/LaunchAgents/' + plistName,
            function(error, stdout, stderr) {
                if (stderr) { return callback(stderr); }
                if (error !== null) { return callback(error); }

                return callback(null);
            }
        )
    },

    enableRunOnLogin: function(callback) {
        async.waterfall([
            this._createPlist,
            function(callback) {
                exec('launchctl load ~/Library/LaunchAgents/' + plistName,
                    function(error, stdout, stderr) {
                        if (stderr) { return callback(stderr); }
                        if (error !== null) { return callback(error); }

                        return callback(null);
                    }
                );
            }

        ], function(err, result) {
            if (err) {
                console.error("Exec error", err);
                return callback(err);
            }

            return callback(null);
        })
    },

    disableRunOnLogin: function(callback) {

        async.waterfall([
            this._createPlist,
            function(callback) {
                exec('launchctl unload ~/Library/LaunchAgents/' + plistName,
                    function(error, stdout, stderr) {
                        if (stderr) { callback(stderr); }
                        if (error !== null) { callback(error); }

                        // if stdout empty, successfully unloaded
                        return callback(stdout.length === 0 ? null : true);
                    }
                )
            }

        ], function(err, result) {
            if (err) {
                console.error("Exec error", err);
                return callback(err);
            }

            return callback(null);
        })
    },

    checkIfRunOnLoginEnabled: function(callback) {
        exec('launchctl list | grep com.jslauthor.stellarApp',
            function(error, stdout, stderr) {
                if (stderr) { callback(stderr); }
                if (error !== null) {
                    // if grep returns return code 1, our launchd job is unloaded
                    if (error.code === 1) { return callback(null, false); }
                    else { return callback(error); }
                }

                // if stdout not empty, launchd job is loaded; else it's unloaded
                return callback(null, stdout.length !== 0);
            }
        )
    }
}
