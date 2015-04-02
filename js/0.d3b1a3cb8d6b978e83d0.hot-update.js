webpackHotUpdate(0,{

/***/ 5:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var async = __webpack_require__(23);
	var exec = __webpack_require__(6).exec;
	var path = __webpack_require__(7);
	
	var plistName = "com.jslauthor.stellarApp.plist";
	var plist = __webpack_require__(18)("./" + plistName);
	
	module.exports = {
	    _createPlist: function _createPlist(callback) {
	        exec("echo '" + plist + "' > ~/Library/LaunchAgents/" + plistName, function (error, stdout, stderr) {
	            if (stderr) {
	                return callback(stderr);
	            }
	            if (error !== null) {
	                return callback(error);
	            }
	
	            return callback(null);
	        });
	    },
	
	    enableRunOnLogin: function enableRunOnLogin(callback) {
	        async.waterfall([this._createPlist, function (callback) {
	            exec("launchctl load ~/Library/LaunchAgents/" + plistName, function (error, stdout, stderr) {
	                if (stderr) {
	                    return callback(stderr);
	                }
	                if (error !== null) {
	                    return callback(error);
	                }
	
	                return callback(null);
	            });
	        }], function (err, result) {
	            if (err) {
	                console.error("Exec error", err);
	                return callback(err);
	            }
	
	            return callback(null);
	        });
	    },
	
	    disableRunOnLogin: function disableRunOnLogin(callback) {
	
	        async.waterfall([this._createPlist, function (callback) {
	            exec("launchctl unload ~/Library/LaunchAgents/" + plistName, function (error, stdout, stderr) {
	                if (stderr) {
	                    callback(stderr);
	                }
	                if (error !== null) {
	                    callback(error);
	                }
	
	                // if stdout empty, successfully unloaded
	                return callback(stdout.length === 0 ? null : true);
	            });
	        }], function (err, result) {
	            if (err) {
	                console.error("Exec error", err);
	                return callback(err);
	            }
	
	            return callback(null);
	        });
	    },
	
	    checkIfRunOnLoginEnabled: function checkIfRunOnLoginEnabled(callback) {
	        exec("launchctl list | grep com.jslauthor.stellarApp", function (error, stdout, stderr) {
	            if (stderr) {
	                callback(stderr);
	            }
	            if (error !== null) {
	                // if grep returns return code 1, our launchd job is unloaded
	                if (error.code === 1) {
	                    return callback(null, false);
	                } else {
	                    return callback(error);
	                }
	            }
	
	            // if stdout not empty, launchd job is loaded; else it's unloaded
	            return callback(null, stdout.length !== 0);
	        });
	    }
	};

/***/ },

/***/ 66:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar async = require(\"async\");\nvar exec = require(\"child_process\").exec;\nvar path = require(\"path\");\n\nvar plistName = \"com.jslauthor.stellarApp.plist\";\nvar plist = require(\"raw!../../\" + plistName);\n\nmodule.exports = {\n    _createPlist: function _createPlist(callback) {\n        exec(\"echo '\" + plist + \"' > ~/Library/LaunchAgents/\" + plistName, function (error, stdout, stderr) {\n            if (stderr) {\n                return callback(stderr);\n            }\n            if (error !== null) {\n                return callback(error);\n            }\n\n            return callback(null);\n        });\n    },\n\n    enableRunOnLogin: function enableRunOnLogin(callback) {\n        async.waterfall([this._createPlist, function (callback) {\n            exec(\"launchctl load ~/Library/LaunchAgents/\" + plistName, function (error, stdout, stderr) {\n                if (stderr) {\n                    return callback(stderr);\n                }\n                if (error !== null) {\n                    return callback(error);\n                }\n\n                return callback(null);\n            });\n        }], function (err, result) {\n            if (err) {\n                console.error(\"Exec error\", err);\n                return callback(err);\n            }\n\n            return callback(null);\n        });\n    },\n\n    disableRunOnLogin: function disableRunOnLogin(callback) {\n\n        async.waterfall([this._createPlist, function (callback) {\n            exec(\"launchctl unload ~/Library/LaunchAgents/\" + plistName, function (error, stdout, stderr) {\n                if (stderr) {\n                    callback(stderr);\n                }\n                if (error !== null) {\n                    callback(error);\n                }\n\n                // if stdout empty, successfully unloaded\n                return callback(stdout.length === 0 ? null : true);\n            });\n        }], function (err, result) {\n            if (err) {\n                console.error(\"Exec error\", err);\n                return callback(err);\n            }\n\n            return callback(null);\n        });\n    },\n\n    checkIfRunOnLoginEnabled: function checkIfRunOnLoginEnabled(callback) {\n        exec(\"launchctl list | grep com.jslauthor.stellarApp\", function (error, stdout, stderr) {\n            if (stderr) {\n                callback(stderr);\n            }\n            if (error !== null) {\n                // if grep returns return code 1, our launchd job is unloaded\n                if (error.code === 1) {\n                    return callback(null, false);\n                } else {\n                    return callback(error);\n                }\n            }\n\n            // if stdout not empty, launchd job is loaded; else it's unloaded\n            return callback(null, stdout.length !== 0);\n        });\n    }\n};"

/***/ }

})
//# sourceMappingURL=0.d3b1a3cb8d6b978e83d0.hot-update.js.map