"use strict"

var async = require('async')
var exec = require('child_process').exec
var path = require('path')

var plistName = 'com.jslauthor.stellarApp.plist'

module.exports = {
    enableRunOnLogin: function(callback) {
        async.waterfall([
            function(callback) {
                var plistPath = path.join(path.dirname(process.execPath), '/' + plistName)
                exec('cp ' + plistPath + ' ~/Library/LaunchAgents/',
                    function(error, stdout, stderr) {
                        if (stderr) { return callback(stderr); }
                        if (error !== null) { return callback(error); }

                        return callback(null);
                    }
                )
            },
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
        exec('launchctl unload ~/Library/LaunchAgents/' + plistName,
            function(error, stdout, stderr) {
                if (stderr) { callback(stderr); }
                if (error !== null) { callback(error); }

                // if stdout empty, successfully unloaded
                return callback(stdout.length === 0 ? null : true);
            }
        )
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
