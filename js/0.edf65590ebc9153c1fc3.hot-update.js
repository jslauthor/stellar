webpackHotUpdate(0,{

/***/ 186:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var spawn = __webpack_require__(294).spawn;
	exports.Parsers = __webpack_require__(291);
	var parse = exports.Parsers.parse;
	
	// Path to 'osascript'. By default search PATH.
	exports.osascript = "osascript";
	
	// Execute a *.applescript file.
	exports.execFile = function execFile(file, args, callback) {
	  if (!Array.isArray(args)) {
	    callback = args;
	    args = [];
	  }
	  return runApplescript(file, args, callback);
	};
	
	// Execute a String as AppleScript.
	exports.execString = function execString(str, callback) {
	  return runApplescript(str, callback);
	};
	
	function runApplescript(strOrPath, args, callback) {
	  var isString = false;
	  if (!Array.isArray(args)) {
	    callback = args;
	    args = [];
	    isString = true;
	  }
	
	  // args get added in reverse order with 'unshift'
	  if (!isString) {
	    // The name of the file is the final arg if 'execFile' was called.
	    args.unshift(strOrPath);
	  }
	  args.unshift("-ss"); // To output machine-readable text.
	  var interpreter = spawn(exports.osascript, args);
	
	  bufferBody(interpreter.stdout);
	  bufferBody(interpreter.stderr);
	
	  interpreter.on("exit", function (code) {
	    var result = parse(interpreter.stdout.body);
	    var err;
	    if (code) {
	      // If the exit code was something other than 0, we're gonna
	      // return an Error object.
	      err = new Error(interpreter.stderr.body);
	      err.appleScript = strOrPath;
	      err.exitCode = code;
	    }
	    callback(err, result, interpreter.stderr.body);
	  });
	
	  if (isString) {
	    // Write the given applescript String to stdin if 'execString' was called.
	    interpreter.stdin.write(strOrPath);
	    interpreter.stdin.end();
	  }
	}
	
	function bufferBody(stream) {
	  stream.body = "";
	  stream.setEncoding("utf8");
	  stream.on("data", function (chunk) {
	    stream.body += chunk;
	  });
	}

/***/ }

})
//# sourceMappingURL=0.edf65590ebc9153c1fc3.hot-update.js.map