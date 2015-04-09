webpackHotUpdate(0,{

/***/ 93:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar request = require(\"browser-request\");\nvar path = require(\"path\");\nvar os = require(\"os\");\nvar fs = require(\"fs\");\nvar exec = require(\"child_process\").exec;\nvar spawn = require(\"child_process\").spawn;\nvar ncp = require(\"ncp\");\nvar del = require(\"del\");\nvar semver = require(\"semver\");\nvar gui = global.window.nwDispatcher.requireNwGui();\n\nvar platform = process.platform;\nplatform = /^win/.test(platform) ? \"win\" : /^darwin/.test(platform) ? \"mac\" : \"linux\" + (process.arch == \"ia32\" ? \"32\" : \"64\");\n\n/**\n * Creates new instance of updater. Manifest could be a `package.json` of project.\n *\n * Note that compressed apps are assumed to be downloaded in the format produced by [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder) (or [grunt-node-webkit-builder](https://github.com/mllrsohn/grunt-node-webkit-builder)).\n *\n * @constructor\n * @param {object} manifest - See the [manifest schema](#manifest-schema) below.\n */\nfunction updater(manifest) {\n  this.manifest = manifest;\n}\n\n/**\n * Will check the latest available version of the application by requesting the manifest specified in `manifestUrl`.\n *\n * The callback will always be called; the second parameter indicates whether or not there's a newer version.\n * This function assumes you use [Semantic Versioning](http://semver.org) and enforces it; if your local version is `0.2.0` and the remote one is `0.1.23456` then the callback will be called with `false` as the second paramter. If on the off chance you don't use semantic versioning, you could manually download the remote manifest and call `download` if you're happy that the remote version is newer.\n *\n * @param {function} cb - Callback arguments: error, newerVersionExists (`Boolean`), remoteManifest\n */\nupdater.prototype.checkNewVersion = function (cb) {\n  request.get(this.manifest.manifestUrl, gotManifest.bind(this)); //get manifest from url\n\n  /**\n   * @private\n   */\n  function gotManifest(err, req, data) {\n    if (err) {\n      return cb(err);\n    }\n\n    if (req.statusCode < 200 || req.statusCode > 299) {\n      return cb(new Error(req.statusCode));\n    }\n\n    try {\n      data = JSON.parse(data);\n    } catch (e) {\n      return cb(e);\n    }\n\n    cb(null, semver.gt(data.version, this.manifest.version), data);\n  }\n};\n\n/**\n * Downloads the new app to a template folder\n * @param  {Function} cb - called when download completes. Callback arguments: error, downloaded filepath\n * @param  {Object} newManifest - see [manifest schema](#manifest-schema) below\n * @return {Request} Request - stream, the stream contains `manifest` property with new manifest and 'content-length' property with the size of package.\n */\nupdater.prototype.download = function (cb, newManifest) {\n  var manifest = newManifest || this.manifest;\n  var url = manifest.packages[platform].url;\n  var pkg = request(url, function (err, response) {\n    if (err) {\n      cb(err);\n    }\n    if (response.statusCode < 200 || response.statusCode >= 300) {\n      pkg.abort();\n      return cb(new Error(response.statusCode));\n    }\n  });\n  pkg.on(\"response\", function (response) {\n    if (response && response.headers && response.headers[\"content-length\"]) {\n      pkg[\"content-length\"] = response.headers[\"content-length\"];\n    }\n  });\n  var filename = path.basename(url),\n      destinationPath = path.join(os.tmpdir(), filename);\n  // download the package to template folder\n  fs.unlink(path.join(os.tmpdir(), filename), function () {\n    pkg.pipe(fs.createWriteStream(destinationPath));\n    pkg.resume();\n  });\n  pkg.on(\"error\", cb);\n  pkg.on(\"end\", appDownloaded);\n  pkg.pause();\n\n  function appDownloaded() {\n    process.nextTick(function () {\n      if (pkg.response.statusCode >= 200 && pkg.response.statusCode < 300) {\n        cb(null, destinationPath);\n      }\n    });\n  }\n  return pkg;\n};\n\n/**\n * Returns executed application path\n * @returns {string}\n */\nupdater.prototype.getAppPath = function () {\n  var appPath = {\n    mac: path.join(process.cwd(), \"../../..\"),\n    win: path.dirname(process.execPath)\n  };\n  appPath.linux32 = appPath.win;\n  appPath.linux64 = appPath.win;\n  return appPath[platform];\n};\n\n/**\n * Returns current application executable\n * @returns {string}\n */\nupdater.prototype.getAppExec = function () {\n  var execFolder = this.getAppPath();\n  var exec = {\n    mac: \"\",\n    win: path.basename(process.execPath),\n    linux32: path.basename(process.execPath),\n    linux64: path.basename(process.execPath)\n  };\n  return path.join(execFolder, exec[platform]);\n};\n\n/**\n * Will unpack the `filename` in temporary folder.\n * For Windows, [unzip](https://www.mkssoftware.com/docs/man1/unzip.1.asp) is used.\n *\n * @param {string} filename\n * @param {function} cb - Callback arguments: error, unpacked directory\n * @param {object} manifest\n */\nupdater.prototype.unpack = function (filename, cb, manifest) {\n  pUnpack[platform].apply(this, arguments);\n};\n\n/**\n * @private\n * @param {string} zipPath\n * @return {string}\n */\nvar getZipDestinationDirectory = function getZipDestinationDirectory(zipPath) {\n  return path.join(os.tmpdir(), path.basename(zipPath, path.extname(zipPath)));\n},\n\n/**\n * @private\n * @param {object} manifest\n * @return {string}\n */\ngetExecPathRelativeToPackage = function getExecPathRelativeToPackage(manifest) {\n  var execPath = manifest.packages[platform] && manifest.packages[platform].execPath;\n\n  if (execPath) {\n    return execPath;\n  } else {\n    var suffix = {\n      win: \".exe\",\n      mac: \".app\"\n    };\n    return manifest.name + (suffix[platform] || \"\");\n  }\n};\n\nvar pUnpack = {\n  /**\n   * @private\n   */\n  mac: function mac(filename, cb, manifest) {\n    var args = arguments,\n        extension = path.extname(filename),\n        destination = path.join(os.tmpdir(), path.basename(filename, extension));\n\n    if (!fs.existsSync(destination)) {\n      fs.mkdirSync(destination);\n    }\n\n    if (extension === \".zip\") {\n      exec(\"unzip -xo \" + filename + \" >/dev/null\", { cwd: destination }, function (err) {\n        if (err) {\n          console.log(err);\n          return cb(err);\n        }\n        var appPath = path.join(destination, getExecPathRelativeToPackage(manifest));\n        cb(null, appPath);\n      });\n    } else if (extension === \".dmg\") {\n      (function () {\n        var findMountPoint = function (dmg_name, callback) {\n          exec(\"hdiutil info\", function (err, stdout) {\n            if (err) return callback(err);\n            var results = stdout.split(\"\\n\");\n            var dmgExp = new RegExp(dmg_name + \"$\");\n            for (var i = 0, l = results.length; i < l; i++) {\n              if (results[i].match(dmgExp)) {\n                var mountPoint = results[i].split(\"\\t\").pop();\n                var fileToRun = path.join(mountPoint, dmg_name + \".app\");\n                return callback(null, fileToRun);\n              }\n            }\n            callback(Error(\"Mount point not found\"));\n          });\n        };\n\n        // just in case if something was wrong during previous mount\n        exec(\"hdiutil unmount /Volumes/\" + path.basename(filename, \".dmg\"), function (err) {\n          exec(\"hdiutil attach \" + filename + \" -nobrowse\", function (err) {\n            if (err) {\n              if (err.code == 1) {\n                pUnpack.mac.apply(this, args);\n              }\n              return cb(err);\n            }\n            findMountPoint(path.basename(filename, \".dmg\"), cb);\n          });\n        });\n      })();\n    }\n  },\n  /**\n   * @private\n   */\n  win: function win(filename, cb, manifest) {\n    var destinationDirectory = getZipDestinationDirectory(filename),\n        unzip = function unzip() {\n      // unzip by C. Spieler (docs: https://www.mkssoftware.com/docs/man1/unzip.1.asp, issues: http://www.info-zip.org/)\n      exec(\"\\\"\" + path.resolve(__dirname, \"tools/unzip.exe\") + \"\\\" -u -o \\\"\" + filename + \"\\\" -d \\\"\" + destinationDirectory + \"\\\" > NUL\", function (err) {\n        if (err) {\n          return cb(err);\n        }\n\n        cb(null, path.join(destinationDirectory, getExecPathRelativeToPackage(manifest)));\n      });\n    };\n\n    fs.exists(destinationDirectory, function (exists) {\n      if (exists) {\n        del(destinationDirectory, { force: true }, function (err) {\n          if (err) {\n            cb(err);\n          } else {\n            unzip();\n          }\n        });\n      } else {\n        unzip();\n      }\n    });\n  },\n  /**\n   * @private\n   */\n  linux32: function linux32(filename, cb, manifest) {\n    //filename fix\n    exec(\"tar -zxvf \" + filename + \" >/dev/null\", { cwd: os.tmpdir() }, function (err) {\n      console.log(arguments);\n      if (err) {\n        console.log(err);\n        return cb(err);\n      }\n      cb(null, path.join(os.tmpdir(), getExecPathRelativeToPackage(manifest)));\n    });\n  }\n};\npUnpack.linux64 = pUnpack.linux32;\n\n/**\n * Runs installer\n * @param {string} appPath\n * @param {array} args - Arguments which will be passed when running the new app\n * @param {object} options - Optional\n * @returns {function}\n */\nupdater.prototype.runInstaller = function (appPath, args, options) {\n  return pRun[platform].apply(this, arguments);\n};\n\nvar pRun = {\n  /**\n   * @private\n   */\n  mac: function mac(appPath, args, options) {\n    //spawn\n    if (args && args.length) {\n      args = [appPath].concat(\"--args\", args);\n    } else {\n      args = [appPath];\n    }\n    return run(\"open\", args, options);\n  },\n  /**\n   * @private\n   */\n  win: function win(appPath, args, options, cb) {\n    return run(appPath, args, options, cb);\n  },\n  /**\n   * @private\n   */\n  linux32: function linux32(appPath, args, options, cb) {\n    var appExec = path.join(appPath, path.basename(this.getAppExec()));\n    fs.chmodSync(appExec, \"0755\");\n    if (!options) options = {};\n    options.cwd = appPath;\n    return run(appPath + \"/\" + path.basename(this.getAppExec()), args, options, cb);\n  }\n};\n\npRun.linux64 = pRun.linux32;\n\n/**\n * @private\n */\nfunction run(path, args, options) {\n  var opts = {\n    detached: true\n  };\n  for (var key in options) {\n    opts[key] = options[key];\n  }\n  var sp = spawn(path, args, opts);\n  sp.unref();\n  return sp;\n}\n\n/**\n * Installs the app (copies current application to `copyPath`)\n * @param {string} copyPath\n * @param {function} cb - Callback arguments: error\n */\nupdater.prototype.install = function (copyPath, cb) {\n  pInstall[platform].apply(this, arguments);\n};\n\nvar pInstall = {\n  /**\n   * @private\n   */\n  mac: function mac(to, cb) {\n    ncp(this.getAppPath(), to, cb);\n  },\n  /**\n   * @private\n   */\n  win: function win(to, cb) {\n    var self = this;\n    var errCounter = 50;\n    deleteApp(appDeleted);\n\n    function appDeleted(err) {\n      if (err) {\n        errCounter--;\n        if (errCounter > 0) {\n          setTimeout(function () {\n            deleteApp(appDeleted);\n          }, 100);\n        } else {\n          return cb(err);\n        }\n      } else {\n        ncp(self.getAppPath(), to, appCopied);\n      }\n    }\n    function deleteApp(cb) {\n      del(to, { force: true }, cb);\n    }\n    function appCopied(err) {\n      if (err) {\n        setTimeout(deleteApp, 100, appDeleted);\n        return;\n      }\n      cb();\n    }\n  },\n  /**\n   * @private\n   */\n  linux32: function linux32(to, cb) {\n    ncp(this.getAppPath(), to, cb);\n  }\n};\npInstall.linux64 = pInstall.linux32;\n\n/**\n * Runs the app from original app executable path.\n * @param {string} execPath\n * @param {array} args - Arguments passed to the app being ran.\n * @param {object} options - Optional. See `spawn` from nodejs docs.\n */\nupdater.prototype.run = function (execPath, args, options) {\n  var arg = arguments;\n  if (platform.indexOf(\"linux\") === 0) arg[0] = path.dirname(arg[0]);\n  pRun[platform].apply(this, arg);\n};\n\nmodule.exports = updater;"

/***/ },

/***/ 413:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";

	var request = __webpack_require__(18);
	var path = __webpack_require__(7);
	var os = __webpack_require__(414);
	var fs = __webpack_require__(415);
	var exec = __webpack_require__(6).exec;
	var spawn = __webpack_require__(6).spawn;
	var ncp = __webpack_require__(418);
	var del = __webpack_require__(416);
	var semver = __webpack_require__(419);
	var gui = global.window.nwDispatcher.requireNwGui();

	var platform = process.platform;
	platform = /^win/.test(platform) ? "win" : /^darwin/.test(platform) ? "mac" : "linux" + (process.arch == "ia32" ? "32" : "64");

	/**
	 * Creates new instance of updater. Manifest could be a `package.json` of project.
	 *
	 * Note that compressed apps are assumed to be downloaded in the format produced by [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder) (or [grunt-node-webkit-builder](https://github.com/mllrsohn/grunt-node-webkit-builder)).
	 *
	 * @constructor
	 * @param {object} manifest - See the [manifest schema](#manifest-schema) below.
	 */
	function updater(manifest) {
	  this.manifest = manifest;
	}

	/**
	 * Will check the latest available version of the application by requesting the manifest specified in `manifestUrl`.
	 *
	 * The callback will always be called; the second parameter indicates whether or not there's a newer version.
	 * This function assumes you use [Semantic Versioning](http://semver.org) and enforces it; if your local version is `0.2.0` and the remote one is `0.1.23456` then the callback will be called with `false` as the second paramter. If on the off chance you don't use semantic versioning, you could manually download the remote manifest and call `download` if you're happy that the remote version is newer.
	 *
	 * @param {function} cb - Callback arguments: error, newerVersionExists (`Boolean`), remoteManifest
	 */
	updater.prototype.checkNewVersion = function (cb) {
	  request.get(this.manifest.manifestUrl, gotManifest.bind(this)); //get manifest from url

	  /**
	   * @private
	   */
	  function gotManifest(err, req, data) {
	    if (err) {
	      return cb(err);
	    }

	    if (req.statusCode < 200 || req.statusCode > 299) {
	      return cb(new Error(req.statusCode));
	    }

	    try {
	      data = JSON.parse(data);
	    } catch (e) {
	      return cb(e);
	    }

	    cb(null, semver.gt(data.version, this.manifest.version), data);
	  }
	};

	/**
	 * Downloads the new app to a template folder
	 * @param  {Function} cb - called when download completes. Callback arguments: error, downloaded filepath
	 * @param  {Object} newManifest - see [manifest schema](#manifest-schema) below
	 * @return {Request} Request - stream, the stream contains `manifest` property with new manifest and 'content-length' property with the size of package.
	 */
	updater.prototype.download = function (cb, newManifest) {
	  var manifest = newManifest || this.manifest;
	  var url = manifest.packages[platform].url;
	  var pkg = request(url, function (err, response) {
	    if (err) {
	      cb(err);
	    }
	    if (response.statusCode < 200 || response.statusCode >= 300) {
	      pkg.abort();
	      return cb(new Error(response.statusCode));
	    }
	  });
	  pkg.on("response", function (response) {
	    if (response && response.headers && response.headers["content-length"]) {
	      pkg["content-length"] = response.headers["content-length"];
	    }
	  });
	  var filename = path.basename(url),
	      destinationPath = path.join(os.tmpdir(), filename);
	  // download the package to template folder
	  fs.unlink(path.join(os.tmpdir(), filename), function () {
	    pkg.pipe(fs.createWriteStream(destinationPath));
	    pkg.resume();
	  });
	  pkg.on("error", cb);
	  pkg.on("end", appDownloaded);
	  pkg.pause();

	  function appDownloaded() {
	    process.nextTick(function () {
	      if (pkg.response.statusCode >= 200 && pkg.response.statusCode < 300) {
	        cb(null, destinationPath);
	      }
	    });
	  }
	  return pkg;
	};

	/**
	 * Returns executed application path
	 * @returns {string}
	 */
	updater.prototype.getAppPath = function () {
	  var appPath = {
	    mac: path.join(process.cwd(), "../../.."),
	    win: path.dirname(process.execPath)
	  };
	  appPath.linux32 = appPath.win;
	  appPath.linux64 = appPath.win;
	  return appPath[platform];
	};

	/**
	 * Returns current application executable
	 * @returns {string}
	 */
	updater.prototype.getAppExec = function () {
	  var execFolder = this.getAppPath();
	  var exec = {
	    mac: "",
	    win: path.basename(process.execPath),
	    linux32: path.basename(process.execPath),
	    linux64: path.basename(process.execPath)
	  };
	  return path.join(execFolder, exec[platform]);
	};

	/**
	 * Will unpack the `filename` in temporary folder.
	 * For Windows, [unzip](https://www.mkssoftware.com/docs/man1/unzip.1.asp) is used.
	 *
	 * @param {string} filename
	 * @param {function} cb - Callback arguments: error, unpacked directory
	 * @param {object} manifest
	 */
	updater.prototype.unpack = function (filename, cb, manifest) {
	  pUnpack[platform].apply(this, arguments);
	};

	/**
	 * @private
	 * @param {string} zipPath
	 * @return {string}
	 */
	var getZipDestinationDirectory = function getZipDestinationDirectory(zipPath) {
	  return path.join(os.tmpdir(), path.basename(zipPath, path.extname(zipPath)));
	},

	/**
	 * @private
	 * @param {object} manifest
	 * @return {string}
	 */
	getExecPathRelativeToPackage = function getExecPathRelativeToPackage(manifest) {
	  var execPath = manifest.packages[platform] && manifest.packages[platform].execPath;

	  if (execPath) {
	    return execPath;
	  } else {
	    var suffix = {
	      win: ".exe",
	      mac: ".app"
	    };
	    return manifest.name + (suffix[platform] || "");
	  }
	};

	var pUnpack = {
	  /**
	   * @private
	   */
	  mac: function mac(filename, cb, manifest) {
	    var args = arguments,
	        extension = path.extname(filename),
	        destination = path.join(os.tmpdir(), path.basename(filename, extension));

	    if (!fs.existsSync(destination)) {
	      fs.mkdirSync(destination);
	    }

	    if (extension === ".zip") {
	      exec("unzip -xo " + filename + " >/dev/null", { cwd: destination }, function (err) {
	        if (err) {
	          console.log(err);
	          return cb(err);
	        }
	        var appPath = path.join(destination, getExecPathRelativeToPackage(manifest));
	        cb(null, appPath);
	      });
	    } else if (extension === ".dmg") {
	      (function () {
	        var findMountPoint = function (dmg_name, callback) {
	          exec("hdiutil info", function (err, stdout) {
	            if (err) return callback(err);
	            var results = stdout.split("\n");
	            var dmgExp = new RegExp(dmg_name + "$");
	            for (var i = 0, l = results.length; i < l; i++) {
	              if (results[i].match(dmgExp)) {
	                var mountPoint = results[i].split("\t").pop();
	                var fileToRun = path.join(mountPoint, dmg_name + ".app");
	                return callback(null, fileToRun);
	              }
	            }
	            callback(Error("Mount point not found"));
	          });
	        };

	        // just in case if something was wrong during previous mount
	        exec("hdiutil unmount /Volumes/" + path.basename(filename, ".dmg"), function (err) {
	          exec("hdiutil attach " + filename + " -nobrowse", function (err) {
	            if (err) {
	              if (err.code == 1) {
	                pUnpack.mac.apply(this, args);
	              }
	              return cb(err);
	            }
	            findMountPoint(path.basename(filename, ".dmg"), cb);
	          });
	        });
	      })();
	    }
	  },
	  /**
	   * @private
	   */
	  win: function win(filename, cb, manifest) {
	    var destinationDirectory = getZipDestinationDirectory(filename),
	        unzip = function unzip() {
	      // unzip by C. Spieler (docs: https://www.mkssoftware.com/docs/man1/unzip.1.asp, issues: http://www.info-zip.org/)
	      exec("\"" + path.resolve(__dirname, "tools/unzip.exe") + "\" -u -o \"" + filename + "\" -d \"" + destinationDirectory + "\" > NUL", function (err) {
	        if (err) {
	          return cb(err);
	        }

	        cb(null, path.join(destinationDirectory, getExecPathRelativeToPackage(manifest)));
	      });
	    };

	    fs.exists(destinationDirectory, function (exists) {
	      if (exists) {
	        del(destinationDirectory, { force: true }, function (err) {
	          if (err) {
	            cb(err);
	          } else {
	            unzip();
	          }
	        });
	      } else {
	        unzip();
	      }
	    });
	  },
	  /**
	   * @private
	   */
	  linux32: function linux32(filename, cb, manifest) {
	    //filename fix
	    exec("tar -zxvf " + filename + " >/dev/null", { cwd: os.tmpdir() }, function (err) {
	      console.log(arguments);
	      if (err) {
	        console.log(err);
	        return cb(err);
	      }
	      cb(null, path.join(os.tmpdir(), getExecPathRelativeToPackage(manifest)));
	    });
	  }
	};
	pUnpack.linux64 = pUnpack.linux32;

	/**
	 * Runs installer
	 * @param {string} appPath
	 * @param {array} args - Arguments which will be passed when running the new app
	 * @param {object} options - Optional
	 * @returns {function}
	 */
	updater.prototype.runInstaller = function (appPath, args, options) {
	  return pRun[platform].apply(this, arguments);
	};

	var pRun = {
	  /**
	   * @private
	   */
	  mac: function mac(appPath, args, options) {
	    //spawn
	    if (args && args.length) {
	      args = [appPath].concat("--args", args);
	    } else {
	      args = [appPath];
	    }
	    return run("open", args, options);
	  },
	  /**
	   * @private
	   */
	  win: function win(appPath, args, options, cb) {
	    return run(appPath, args, options, cb);
	  },
	  /**
	   * @private
	   */
	  linux32: function linux32(appPath, args, options, cb) {
	    var appExec = path.join(appPath, path.basename(this.getAppExec()));
	    fs.chmodSync(appExec, "0755");
	    if (!options) options = {};
	    options.cwd = appPath;
	    return run(appPath + "/" + path.basename(this.getAppExec()), args, options, cb);
	  }
	};

	pRun.linux64 = pRun.linux32;

	/**
	 * @private
	 */
	function run(path, args, options) {
	  var opts = {
	    detached: true
	  };
	  for (var key in options) {
	    opts[key] = options[key];
	  }
	  var sp = spawn(path, args, opts);
	  sp.unref();
	  return sp;
	}

	/**
	 * Installs the app (copies current application to `copyPath`)
	 * @param {string} copyPath
	 * @param {function} cb - Callback arguments: error
	 */
	updater.prototype.install = function (copyPath, cb) {
	  pInstall[platform].apply(this, arguments);
	};

	var pInstall = {
	  /**
	   * @private
	   */
	  mac: function mac(to, cb) {
	    ncp(this.getAppPath(), to, cb);
	  },
	  /**
	   * @private
	   */
	  win: function win(to, cb) {
	    var self = this;
	    var errCounter = 50;
	    deleteApp(appDeleted);

	    function appDeleted(err) {
	      if (err) {
	        errCounter--;
	        if (errCounter > 0) {
	          setTimeout(function () {
	            deleteApp(appDeleted);
	          }, 100);
	        } else {
	          return cb(err);
	        }
	      } else {
	        ncp(self.getAppPath(), to, appCopied);
	      }
	    }
	    function deleteApp(cb) {
	      del(to, { force: true }, cb);
	    }
	    function appCopied(err) {
	      if (err) {
	        setTimeout(deleteApp, 100, appDeleted);
	        return;
	      }
	      cb();
	    }
	  },
	  /**
	   * @private
	   */
	  linux32: function linux32(to, cb) {
	    ncp(this.getAppPath(), to, cb);
	  }
	};
	pInstall.linux64 = pInstall.linux32;

	/**
	 * Runs the app from original app executable path.
	 * @param {string} execPath
	 * @param {array} args - Arguments passed to the app being ran.
	 * @param {object} options - Optional. See `spawn` from nodejs docs.
	 */
	updater.prototype.run = function (execPath, args, options) {
	  var arg = arguments;
	  if (platform.indexOf("linux") === 0) arg[0] = path.dirname(arg[0]);
	  pRun[platform].apply(this, arg);
	};

	module.exports = updater;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }

})