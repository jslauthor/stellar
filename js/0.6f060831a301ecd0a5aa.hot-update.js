webpackHotUpdate(0,{

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"name": "stellar",
		"version": "1.0.0",
		"main": "index.html",
		"author": "J.S. Leonard <hello@jslauthor.com>",
		"manifestUrl": "https://s3-us-west-2.amazonaws.com/jsl-author/stellar/package.json",
		"packages": {
			"mac": {
				"url": "https://s3-us-west-2.amazonaws.com/jsl-author/stellar/releases/stellar/mac/stellar.zip"
			}
		},
		"dependencies": {
			"alt": "^0.14.5",
			"appdmg": "^0.3.0",
			"async": "~0.9.0",
			"auto-launch": "^0.1.15",
			"autoprefixer-loader": "^1.2.0",
			"babel": "^4.7.16",
			"babel-core": "^4.7.16",
			"babel-loader": "^4.3.0",
			"browser-request": "^0.3.3",
			"cheerio": "^0.18.0",
			"classnames": "^1.2.0",
			"css-loader": "^0.9.1",
			"dotenv": "~0.4.0",
			"file-loader": "^0.8.1",
			"ftellipsis": "^0.2.3",
			"hex-rgb-converter": "0.0.2",
			"html-truncate": "^1.1.2",
			"json-loader": "^0.5.1",
			"jsx-loader": "^0.12.2",
			"lodash": "^2.4.1",
			"moment": "~2.8.1",
			"moment-duration-format": "^1.3.0",
			"node-sass": "^3.0.0-beta.4",
			"node-webkit-builder": "^1.0.11",
			"node-webkit-updater": "^0.2.4",
			"nw": "^0.12.0",
			"path": "^0.11.14",
			"pluralize": "^1.1.2",
			"raw-loader": "^0.5.1",
			"request": "^2.53.0",
			"sass-loader": "^1.0.1",
			"style-loader": "^0.9.0",
			"url-loader": "^0.5.5",
			"validator": "^3.36.0",
			"webpack": "^1.7.3",
			"winreg": "0.0.12",
			"ncp": "^0.5.1",
			"del": "~0.1.2",
			"semver": "^3.0.1"
		},
		"devDependencies": {
			"react": "^0.12.1",
			"react-router": "^0.11.6",
			"react-tween-state": "0.0.4",
			"reactify": "^0.17.1"
		},
		"engines": {
			"node": ">=0.10.22",
			"npm": ">=1.3.14"
		},
		"window": {
			"show": false,
			"show_in_taskbar": false,
			"transparent": true,
			"resizable": false,
			"toolbar": false,
			"frame": false,
			"always-on-top": true,
			"visible-on-all-workspaces": true,
			"width": 410,
			"height": 360,
			"min_width": 410,
			"min_height": 360,
			"max_width": 410,
			"max_height": 360
		}
	}

/***/ },

/***/ 413:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";

	var request = __webpack_require__(417);
	var path = __webpack_require__(7);
	var os = __webpack_require__(414);
	var fs = __webpack_require__(415);
	var exec = __webpack_require__(6).exec;
	var spawn = __webpack_require__(6).spawn;
	var ncp = __webpack_require__(418);
	var del = __webpack_require__(416);
	var semver = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"semver\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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