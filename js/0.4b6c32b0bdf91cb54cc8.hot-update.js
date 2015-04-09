webpackHotUpdate(0,{

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

/***/ },

/***/ 419:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// export the class if we are in a Node-like system.
	if (typeof module === 'object' && module.exports === exports)
	  exports = module.exports = SemVer;

	// The debug function is excluded entirely from the minified version.
	/* nomin */ var debug;
	/* nomin */ if (typeof process === 'object' &&
	    /* nomin */ process.env &&
	    /* nomin */ process.env.NODE_DEBUG &&
	    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
	  /* nomin */ debug = function() {
	    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
	    /* nomin */ args.unshift('SEMVER');
	    /* nomin */ console.log.apply(console, args);
	    /* nomin */ };
	/* nomin */ else
	  /* nomin */ debug = function() {};

	// Note: this is the semver.org version of the spec that it implements
	// Not necessarily the package version of this code.
	exports.SEMVER_SPEC_VERSION = '2.0.0';

	// The actual regexps go on exports.re
	var re = exports.re = [];
	var src = exports.src = [];
	var R = 0;

	// The following Regular Expressions can be used for tokenizing,
	// validating, and parsing SemVer version strings.

	// ## Numeric Identifier
	// A single `0`, or a non-zero digit followed by zero or more digits.

	var NUMERICIDENTIFIER = R++;
	src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
	var NUMERICIDENTIFIERLOOSE = R++;
	src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


	// ## Non-numeric Identifier
	// Zero or more digits, followed by a letter or hyphen, and then zero or
	// more letters, digits, or hyphens.

	var NONNUMERICIDENTIFIER = R++;
	src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


	// ## Main Version
	// Three dot-separated numeric identifiers.

	var MAINVERSION = R++;
	src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
	                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
	                   '(' + src[NUMERICIDENTIFIER] + ')';

	var MAINVERSIONLOOSE = R++;
	src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
	                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
	                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

	// ## Pre-release Version Identifier
	// A numeric identifier, or a non-numeric identifier.

	var PRERELEASEIDENTIFIER = R++;
	src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
	                            '|' + src[NONNUMERICIDENTIFIER] + ')';

	var PRERELEASEIDENTIFIERLOOSE = R++;
	src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
	                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


	// ## Pre-release Version
	// Hyphen, followed by one or more dot-separated pre-release version
	// identifiers.

	var PRERELEASE = R++;
	src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
	                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

	var PRERELEASELOOSE = R++;
	src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
	                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

	// ## Build Metadata Identifier
	// Any combination of digits, letters, or hyphens.

	var BUILDIDENTIFIER = R++;
	src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

	// ## Build Metadata
	// Plus sign, followed by one or more period-separated build metadata
	// identifiers.

	var BUILD = R++;
	src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
	             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


	// ## Full Version String
	// A main version, followed optionally by a pre-release version and
	// build metadata.

	// Note that the only major, minor, patch, and pre-release sections of
	// the version string are capturing groups.  The build metadata is not a
	// capturing group, because it should not ever be used in version
	// comparison.

	var FULL = R++;
	var FULLPLAIN = 'v?' + src[MAINVERSION] +
	                src[PRERELEASE] + '?' +
	                src[BUILD] + '?';

	src[FULL] = '^' + FULLPLAIN + '$';

	// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
	// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
	// common in the npm registry.
	var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
	                 src[PRERELEASELOOSE] + '?' +
	                 src[BUILD] + '?';

	var LOOSE = R++;
	src[LOOSE] = '^' + LOOSEPLAIN + '$';

	var GTLT = R++;
	src[GTLT] = '((?:<|>)?=?)';

	// Something like "2.*" or "1.2.x".
	// Note that "x.x" is a valid xRange identifer, meaning "any version"
	// Only the first item is strictly required.
	var XRANGEIDENTIFIERLOOSE = R++;
	src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
	var XRANGEIDENTIFIER = R++;
	src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

	var XRANGEPLAIN = R++;
	src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
	                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
	                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
	                   '(?:(' + src[PRERELEASE] + ')' +
	                   ')?)?)?';

	var XRANGEPLAINLOOSE = R++;
	src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
	                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
	                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
	                        '(?:(' + src[PRERELEASELOOSE] + ')' +
	                        ')?)?)?';

	// >=2.x, for example, means >=2.0.0-0
	// <1.x would be the same as "<1.0.0-0", though.
	var XRANGE = R++;
	src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
	var XRANGELOOSE = R++;
	src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

	// Tilde ranges.
	// Meaning is "reasonably at or greater than"
	var LONETILDE = R++;
	src[LONETILDE] = '(?:~>?)';

	var TILDETRIM = R++;
	src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
	re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
	var tildeTrimReplace = '$1~';

	var TILDE = R++;
	src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
	var TILDELOOSE = R++;
	src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

	// Caret ranges.
	// Meaning is "at least and backwards compatible with"
	var LONECARET = R++;
	src[LONECARET] = '(?:\\^)';

	var CARETTRIM = R++;
	src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
	re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
	var caretTrimReplace = '$1^';

	var CARET = R++;
	src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
	var CARETLOOSE = R++;
	src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

	// A simple gt/lt/eq thing, or just "" to indicate "any version"
	var COMPARATORLOOSE = R++;
	src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
	var COMPARATOR = R++;
	src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


	// An expression to strip any whitespace between the gtlt and the thing
	// it modifies, so that `> 1.2.3` ==> `>1.2.3`
	var COMPARATORTRIM = R++;
	src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
	                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

	// this one has to use the /g flag
	re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
	var comparatorTrimReplace = '$1$2$3';


	// Something like `1.2.3 - 1.2.4`
	// Note that these all use the loose form, because they'll be
	// checked against either the strict or loose comparator form
	// later.
	var HYPHENRANGE = R++;
	src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
	                   '\\s+-\\s+' +
	                   '(' + src[XRANGEPLAIN] + ')' +
	                   '\\s*$';

	var HYPHENRANGELOOSE = R++;
	src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
	                        '\\s+-\\s+' +
	                        '(' + src[XRANGEPLAINLOOSE] + ')' +
	                        '\\s*$';

	// Star ranges basically just allow anything at all.
	var STAR = R++;
	src[STAR] = '(<|>)?=?\\s*\\*';

	// Compile to actual regexp objects.
	// All are flag-free, unless they were created above with a flag.
	for (var i = 0; i < R; i++) {
	  debug(i, src[i]);
	  if (!re[i])
	    re[i] = new RegExp(src[i]);
	}

	exports.parse = parse;
	function parse(version, loose) {
	  var r = loose ? re[LOOSE] : re[FULL];
	  return (r.test(version)) ? new SemVer(version, loose) : null;
	}

	exports.valid = valid;
	function valid(version, loose) {
	  var v = parse(version, loose);
	  return v ? v.version : null;
	}


	exports.clean = clean;
	function clean(version, loose) {
	  var s = parse(version.trim().replace(/^[=v]+/, ""), loose);
	  return s ? s.version : null;
	}

	exports.SemVer = SemVer;

	function SemVer(version, loose) {
	  if (version instanceof SemVer) {
	    if (version.loose === loose)
	      return version;
	    else
	      version = version.version;
	  } else if (typeof version !== 'string') {
	    throw new TypeError('Invalid Version: ' + version);
	  }

	  if (!(this instanceof SemVer))
	    return new SemVer(version, loose);

	  debug('SemVer', version, loose);
	  this.loose = loose;
	  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

	  if (!m)
	    throw new TypeError('Invalid Version: ' + version);

	  this.raw = version;

	  // these are actually numbers
	  this.major = +m[1];
	  this.minor = +m[2];
	  this.patch = +m[3];

	  // numberify any prerelease numeric ids
	  if (!m[4])
	    this.prerelease = [];
	  else
	    this.prerelease = m[4].split('.').map(function(id) {
	      return (/^[0-9]+$/.test(id)) ? +id : id;
	    });

	  this.build = m[5] ? m[5].split('.') : [];
	  this.format();
	}

	SemVer.prototype.format = function() {
	  this.version = this.major + '.' + this.minor + '.' + this.patch;
	  if (this.prerelease.length)
	    this.version += '-' + this.prerelease.join('.');
	  return this.version;
	};

	SemVer.prototype.inspect = function() {
	  return '<SemVer "' + this + '">';
	};

	SemVer.prototype.toString = function() {
	  return this.version;
	};

	SemVer.prototype.compare = function(other) {
	  debug('SemVer.compare', this.version, this.loose, other);
	  if (!(other instanceof SemVer))
	    other = new SemVer(other, this.loose);

	  return this.compareMain(other) || this.comparePre(other);
	};

	SemVer.prototype.compareMain = function(other) {
	  if (!(other instanceof SemVer))
	    other = new SemVer(other, this.loose);

	  return compareIdentifiers(this.major, other.major) ||
	         compareIdentifiers(this.minor, other.minor) ||
	         compareIdentifiers(this.patch, other.patch);
	};

	SemVer.prototype.comparePre = function(other) {
	  if (!(other instanceof SemVer))
	    other = new SemVer(other, this.loose);

	  // NOT having a prerelease is > having one
	  if (this.prerelease.length && !other.prerelease.length)
	    return -1;
	  else if (!this.prerelease.length && other.prerelease.length)
	    return 1;
	  else if (!this.prerelease.length && !other.prerelease.length)
	    return 0;

	  var i = 0;
	  do {
	    var a = this.prerelease[i];
	    var b = other.prerelease[i];
	    debug('prerelease compare', i, a, b);
	    if (a === undefined && b === undefined)
	      return 0;
	    else if (b === undefined)
	      return 1;
	    else if (a === undefined)
	      return -1;
	    else if (a === b)
	      continue;
	    else
	      return compareIdentifiers(a, b);
	  } while (++i);
	};

	// preminor will bump the version up to the next minor release, and immediately
	// down to pre-release. premajor and prepatch work the same way.
	SemVer.prototype.inc = function(release) {
	  switch (release) {
	    case 'premajor':
	      this.inc('major');
	      this.inc('pre');
	      break;
	    case 'preminor':
	      this.inc('minor');
	      this.inc('pre');
	      break;
	    case 'prepatch':
	      // If this is already a prerelease, it will bump to the next version
	      // drop any prereleases that might already exist, since they are not
	      // relevant at this point.
	      this.prerelease.length = 0;
	      this.inc('patch');
	      this.inc('pre');
	      break;
	    // If the input is a non-prerelease version, this acts the same as
	    // prepatch.
	    case 'prerelease':
	      if (this.prerelease.length === 0)
	        this.inc('patch');
	      this.inc('pre');
	      break;
	    case 'major':
	      this.major++;
	      this.minor = -1;
	    case 'minor':
	      this.minor++;
	      this.patch = 0;
	      this.prerelease = [];
	      break;
	    case 'patch':
	      // If this is not a pre-release version, it will increment the patch.
	      // If it is a pre-release it will bump up to the same patch version.
	      // 1.2.0-5 patches to 1.2.0
	      // 1.2.0 patches to 1.2.1
	      if (this.prerelease.length === 0)
	        this.patch++;
	      this.prerelease = [];
	      break;
	    // This probably shouldn't be used publically.
	    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
	    case 'pre':
	      if (this.prerelease.length === 0)
	        this.prerelease = [0];
	      else {
	        var i = this.prerelease.length;
	        while (--i >= 0) {
	          if (typeof this.prerelease[i] === 'number') {
	            this.prerelease[i]++;
	            i = -2;
	          }
	        }
	        if (i === -1) // didn't increment anything
	          this.prerelease.push(0);
	      }
	      break;

	    default:
	      throw new Error('invalid increment argument: ' + release);
	  }
	  this.format();
	  return this;
	};

	exports.inc = inc;
	function inc(version, release, loose) {
	  try {
	    return new SemVer(version, loose).inc(release).version;
	  } catch (er) {
	    return null;
	  }
	}

	exports.compareIdentifiers = compareIdentifiers;

	var numeric = /^[0-9]+$/;
	function compareIdentifiers(a, b) {
	  var anum = numeric.test(a);
	  var bnum = numeric.test(b);

	  if (anum && bnum) {
	    a = +a;
	    b = +b;
	  }

	  return (anum && !bnum) ? -1 :
	         (bnum && !anum) ? 1 :
	         a < b ? -1 :
	         a > b ? 1 :
	         0;
	}

	exports.rcompareIdentifiers = rcompareIdentifiers;
	function rcompareIdentifiers(a, b) {
	  return compareIdentifiers(b, a);
	}

	exports.compare = compare;
	function compare(a, b, loose) {
	  return new SemVer(a, loose).compare(b);
	}

	exports.compareLoose = compareLoose;
	function compareLoose(a, b) {
	  return compare(a, b, true);
	}

	exports.rcompare = rcompare;
	function rcompare(a, b, loose) {
	  return compare(b, a, loose);
	}

	exports.sort = sort;
	function sort(list, loose) {
	  return list.sort(function(a, b) {
	    return exports.compare(a, b, loose);
	  });
	}

	exports.rsort = rsort;
	function rsort(list, loose) {
	  return list.sort(function(a, b) {
	    return exports.rcompare(a, b, loose);
	  });
	}

	exports.gt = gt;
	function gt(a, b, loose) {
	  return compare(a, b, loose) > 0;
	}

	exports.lt = lt;
	function lt(a, b, loose) {
	  return compare(a, b, loose) < 0;
	}

	exports.eq = eq;
	function eq(a, b, loose) {
	  return compare(a, b, loose) === 0;
	}

	exports.neq = neq;
	function neq(a, b, loose) {
	  return compare(a, b, loose) !== 0;
	}

	exports.gte = gte;
	function gte(a, b, loose) {
	  return compare(a, b, loose) >= 0;
	}

	exports.lte = lte;
	function lte(a, b, loose) {
	  return compare(a, b, loose) <= 0;
	}

	exports.cmp = cmp;
	function cmp(a, op, b, loose) {
	  var ret;
	  switch (op) {
	    case '===': ret = a === b; break;
	    case '!==': ret = a !== b; break;
	    case '': case '=': case '==': ret = eq(a, b, loose); break;
	    case '!=': ret = neq(a, b, loose); break;
	    case '>': ret = gt(a, b, loose); break;
	    case '>=': ret = gte(a, b, loose); break;
	    case '<': ret = lt(a, b, loose); break;
	    case '<=': ret = lte(a, b, loose); break;
	    default: throw new TypeError('Invalid operator: ' + op);
	  }
	  return ret;
	}

	exports.Comparator = Comparator;
	function Comparator(comp, loose) {
	  if (comp instanceof Comparator) {
	    if (comp.loose === loose)
	      return comp;
	    else
	      comp = comp.value;
	  }

	  if (!(this instanceof Comparator))
	    return new Comparator(comp, loose);

	  debug('comparator', comp, loose);
	  this.loose = loose;
	  this.parse(comp);

	  if (this.semver === ANY)
	    this.value = '';
	  else
	    this.value = this.operator + this.semver.version;
	}

	var ANY = {};
	Comparator.prototype.parse = function(comp) {
	  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
	  var m = comp.match(r);

	  if (!m)
	    throw new TypeError('Invalid comparator: ' + comp);

	  this.operator = m[1];
	  if (this.operator === '=')
	    this.operator = '';

	  // if it literally is just '>' or '' then allow anything.
	  if (!m[2])
	    this.semver = ANY;
	  else {
	    this.semver = new SemVer(m[2], this.loose);

	    // <1.2.3-rc DOES allow 1.2.3-beta (has prerelease)
	    // >=1.2.3 DOES NOT allow 1.2.3-beta
	    // <=1.2.3 DOES allow 1.2.3-beta
	    // However, <1.2.3 does NOT allow 1.2.3-beta,
	    // even though `1.2.3-beta < 1.2.3`
	    // The assumption is that the 1.2.3 version has something you
	    // *don't* want, so we push the prerelease down to the minimum.
	    if (this.operator === '<' && !this.semver.prerelease.length) {
	      this.semver.prerelease = ['0'];
	      this.semver.format();
	    }
	  }
	};

	Comparator.prototype.inspect = function() {
	  return '<SemVer Comparator "' + this + '">';
	};

	Comparator.prototype.toString = function() {
	  return this.value;
	};

	Comparator.prototype.test = function(version) {
	  debug('Comparator.test', version, this.loose);
	  return (this.semver === ANY) ? true :
	         cmp(version, this.operator, this.semver, this.loose);
	};


	exports.Range = Range;
	function Range(range, loose) {
	  if ((range instanceof Range) && range.loose === loose)
	    return range;

	  if (!(this instanceof Range))
	    return new Range(range, loose);

	  this.loose = loose;

	  // First, split based on boolean or ||
	  this.raw = range;
	  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
	    return this.parseRange(range.trim());
	  }, this).filter(function(c) {
	    // throw out any that are not relevant for whatever reason
	    return c.length;
	  });

	  if (!this.set.length) {
	    throw new TypeError('Invalid SemVer Range: ' + range);
	  }

	  this.format();
	}

	Range.prototype.inspect = function() {
	  return '<SemVer Range "' + this.range + '">';
	};

	Range.prototype.format = function() {
	  this.range = this.set.map(function(comps) {
	    return comps.join(' ').trim();
	  }).join('||').trim();
	  return this.range;
	};

	Range.prototype.toString = function() {
	  return this.range;
	};

	Range.prototype.parseRange = function(range) {
	  var loose = this.loose;
	  range = range.trim();
	  debug('range', range, loose);
	  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
	  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
	  range = range.replace(hr, hyphenReplace);
	  debug('hyphen replace', range);
	  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
	  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
	  debug('comparator trim', range, re[COMPARATORTRIM]);

	  // `~ 1.2.3` => `~1.2.3`
	  range = range.replace(re[TILDETRIM], tildeTrimReplace);

	  // `^ 1.2.3` => `^1.2.3`
	  range = range.replace(re[CARETTRIM], caretTrimReplace);

	  // normalize spaces
	  range = range.split(/\s+/).join(' ');

	  // At this point, the range is completely trimmed and
	  // ready to be split into comparators.

	  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
	  var set = range.split(' ').map(function(comp) {
	    return parseComparator(comp, loose);
	  }).join(' ').split(/\s+/);
	  if (this.loose) {
	    // in loose mode, throw out any that are not valid comparators
	    set = set.filter(function(comp) {
	      return !!comp.match(compRe);
	    });
	  }
	  set = set.map(function(comp) {
	    return new Comparator(comp, loose);
	  });

	  return set;
	};

	// Mostly just for testing and legacy API reasons
	exports.toComparators = toComparators;
	function toComparators(range, loose) {
	  return new Range(range, loose).set.map(function(comp) {
	    return comp.map(function(c) {
	      return c.value;
	    }).join(' ').trim().split(' ');
	  });
	}

	// comprised of xranges, tildes, stars, and gtlt's at this point.
	// already replaced the hyphen ranges
	// turn into a set of JUST comparators.
	function parseComparator(comp, loose) {
	  debug('comp', comp);
	  comp = replaceCarets(comp, loose);
	  debug('caret', comp);
	  comp = replaceTildes(comp, loose);
	  debug('tildes', comp);
	  comp = replaceXRanges(comp, loose);
	  debug('xrange', comp);
	  comp = replaceStars(comp, loose);
	  debug('stars', comp);
	  return comp;
	}

	function isX(id) {
	  return !id || id.toLowerCase() === 'x' || id === '*';
	}

	// ~, ~> --> * (any, kinda silly)
	// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
	// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
	// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
	// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
	// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
	function replaceTildes(comp, loose) {
	  return comp.trim().split(/\s+/).map(function(comp) {
	    return replaceTilde(comp, loose);
	  }).join(' ');
	}

	function replaceTilde(comp, loose) {
	  var r = loose ? re[TILDELOOSE] : re[TILDE];
	  return comp.replace(r, function(_, M, m, p, pr) {
	    debug('tilde', comp, _, M, m, p, pr);
	    var ret;

	    if (isX(M))
	      ret = '';
	    else if (isX(m))
	      ret = '>=' + M + '.0.0-0 <' + (+M + 1) + '.0.0-0';
	    else if (isX(p))
	      // ~1.2 == >=1.2.0- <1.3.0-
	      ret = '>=' + M + '.' + m + '.0-0 <' + M + '.' + (+m + 1) + '.0-0';
	    else if (pr) {
	      debug('replaceTilde pr', pr);
	      if (pr.charAt(0) !== '-')
	        pr = '-' + pr;
	      ret = '>=' + M + '.' + m + '.' + p + pr +
	            ' <' + M + '.' + (+m + 1) + '.0-0';
	    } else
	      // ~1.2.3 == >=1.2.3-0 <1.3.0-0
	      ret = '>=' + M + '.' + m + '.' + p + '-0' +
	            ' <' + M + '.' + (+m + 1) + '.0-0';

	    debug('tilde return', ret);
	    return ret;
	  });
	}

	// ^ --> * (any, kinda silly)
	// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
	// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
	// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
	// ^1.2.3 --> >=1.2.3 <2.0.0
	// ^1.2.0 --> >=1.2.0 <2.0.0
	function replaceCarets(comp, loose) {
	  return comp.trim().split(/\s+/).map(function(comp) {
	    return replaceCaret(comp, loose);
	  }).join(' ');
	}

	function replaceCaret(comp, loose) {
	  var r = loose ? re[CARETLOOSE] : re[CARET];
	  return comp.replace(r, function(_, M, m, p, pr) {
	    debug('caret', comp, _, M, m, p, pr);
	    var ret;
	    if (pr) {
	      if (pr.charAt(0) !== '-')
	        pr = '-' + pr;
	    } else
	      pr = '';

	    if (isX(M))
	      ret = '';
	    else if (isX(m))
	      ret = '>=' + M + '.0.0-0 <' + (+M + 1) + '.0.0-0';
	    else if (isX(p)) {
	      if (M === '0')
	        ret = '>=' + M + '.' + m + '.0-0 <' + M + '.' + (+m + 1) + '.0-0';
	      else
	        ret = '>=' + M + '.' + m + '.0-0 <' + (+M + 1) + '.0.0-0';
	    } else if (M === '0')
	      ret = '=' + M + '.' + m + '.' + p + pr;
	    else if (pr)
	      ret = '>=' + M + '.' + m + '.' + p + pr +
	            ' <' + (+M + 1) + '.0.0-0';
	    else
	      ret = '>=' + M + '.' + m + '.' + p + '-0' +
	            ' <' + (+M + 1) + '.0.0-0';

	    debug('caret return', ret);
	    return ret;
	  });
	}

	function replaceXRanges(comp, loose) {
	  debug('replaceXRanges', comp, loose);
	  return comp.split(/\s+/).map(function(comp) {
	    return replaceXRange(comp, loose);
	  }).join(' ');
	}

	function replaceXRange(comp, loose) {
	  comp = comp.trim();
	  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
	  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
	    debug('xRange', comp, ret, gtlt, M, m, p, pr);
	    var xM = isX(M);
	    var xm = xM || isX(m);
	    var xp = xm || isX(p);
	    var anyX = xp;

	    if (gtlt === '=' && anyX)
	      gtlt = '';

	    if (gtlt && anyX) {
	      // replace X with 0, and then append the -0 min-prerelease
	      if (xM)
	        M = 0;
	      if (xm)
	        m = 0;
	      if (xp)
	        p = 0;

	      if (gtlt === '>') {
	        // >1 => >=2.0.0-0
	        // >1.2 => >=1.3.0-0
	        // >1.2.3 => >= 1.2.4-0
	        gtlt = '>=';
	        if (xM) {
	          // no change
	        } else if (xm) {
	          M = +M + 1;
	          m = 0;
	          p = 0;
	        } else if (xp) {
	          m = +m + 1;
	          p = 0;
	        }
	      }


	      ret = gtlt + M + '.' + m + '.' + p + '-0';
	    } else if (xM) {
	      // allow any
	      ret = '*';
	    } else if (xm) {
	      // append '-0' onto the version, otherwise
	      // '1.x.x' matches '2.0.0-beta', since the tag
	      // *lowers* the version value
	      ret = '>=' + M + '.0.0-0 <' + (+M + 1) + '.0.0-0';
	    } else if (xp) {
	      ret = '>=' + M + '.' + m + '.0-0 <' + M + '.' + (+m + 1) + '.0-0';
	    }

	    debug('xRange return', ret);

	    return ret;
	  });
	}

	// Because * is AND-ed with everything else in the comparator,
	// and '' means "any version", just remove the *s entirely.
	function replaceStars(comp, loose) {
	  debug('replaceStars', comp, loose);
	  // Looseness is ignored here.  star is always as loose as it gets!
	  return comp.trim().replace(re[STAR], '');
	}

	// This function is passed to string.replace(re[HYPHENRANGE])
	// M, m, patch, prerelease, build
	// 1.2 - 3.4.5 => >=1.2.0-0 <=3.4.5
	// 1.2.3 - 3.4 => >=1.2.0-0 <3.5.0-0 Any 3.4.x will do
	// 1.2 - 3.4 => >=1.2.0-0 <3.5.0-0
	function hyphenReplace($0,
	                       from, fM, fm, fp, fpr, fb,
	                       to, tM, tm, tp, tpr, tb) {

	  if (isX(fM))
	    from = '';
	  else if (isX(fm))
	    from = '>=' + fM + '.0.0-0';
	  else if (isX(fp))
	    from = '>=' + fM + '.' + fm + '.0-0';
	  else
	    from = '>=' + from;

	  if (isX(tM))
	    to = '';
	  else if (isX(tm))
	    to = '<' + (+tM + 1) + '.0.0-0';
	  else if (isX(tp))
	    to = '<' + tM + '.' + (+tm + 1) + '.0-0';
	  else if (tpr)
	    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
	  else
	    to = '<=' + to;

	  return (from + ' ' + to).trim();
	}


	// if ANY of the sets match ALL of its comparators, then pass
	Range.prototype.test = function(version) {
	  if (!version)
	    return false;
	  for (var i = 0; i < this.set.length; i++) {
	    if (testSet(this.set[i], version))
	      return true;
	  }
	  return false;
	};

	function testSet(set, version) {
	  for (var i = 0; i < set.length; i++) {
	    if (!set[i].test(version))
	      return false;
	  }
	  return true;
	}

	exports.satisfies = satisfies;
	function satisfies(version, range, loose) {
	  try {
	    range = new Range(range, loose);
	  } catch (er) {
	    return false;
	  }
	  return range.test(version);
	}

	exports.maxSatisfying = maxSatisfying;
	function maxSatisfying(versions, range, loose) {
	  return versions.filter(function(version) {
	    return satisfies(version, range, loose);
	  }).sort(function(a, b) {
	    return rcompare(a, b, loose);
	  })[0] || null;
	}

	exports.validRange = validRange;
	function validRange(range, loose) {
	  try {
	    // Return '*' instead of '' so that truthiness works.
	    // This will throw if it's invalid anyway
	    return new Range(range, loose).range || '*';
	  } catch (er) {
	    return null;
	  }
	}

	// Determine if version is less than all the versions possible in the range
	exports.ltr = ltr;
	function ltr(version, range, loose) {
	  return outside(version, range, '<', loose);
	}

	// Determine if version is greater than all the versions possible in the range.
	exports.gtr = gtr;
	function gtr(version, range, loose) {
	  return outside(version, range, '>', loose);
	}

	exports.outside = outside;
	function outside(version, range, hilo, loose) {
	  version = new SemVer(version, loose);
	  range = new Range(range, loose);

	  var gtfn, ltefn, ltfn, comp, ecomp;
	  switch (hilo) {
	    case '>':
	      gtfn = gt;
	      ltefn = lte;
	      ltfn = lt;
	      comp = '>';
	      ecomp = '>=';
	      break;
	    case '<':
	      gtfn = lt;
	      ltefn = gte;
	      ltfn = gt;
	      comp = '<';
	      ecomp = '<=';
	      break;
	    default:
	      throw new TypeError('Must provide a hilo val of "<" or ">"');
	  }

	  // If it satisifes the range it is not outside
	  if (satisfies(version, range, loose)) {
	    return false;
	  }

	  // From now on, variable terms are as if we're in "gtr" mode.
	  // but note that everything is flipped for the "ltr" function.

	  for (var i = 0; i < range.set.length; ++i) {
	    var comparators = range.set[i];

	    var high = null;
	    var low = null;

	    comparators.forEach(function(comparator) {
	      high = high || comparator;
	      low = low || comparator;
	      if (gtfn(comparator.semver, high.semver, loose)) {
	        high = comparator;
	      } else if (ltfn(comparator.semver, low.semver, loose)) {
	        low = comparator;
	      }
	    });

	    // If the edge version comparator has a operator then our version
	    // isn't outside it
	    if (high.operator === comp || high.operator === ecomp) {
	      return false;
	    }

	    // If the lowest version comparator has an operator and our version
	    // is less than it then it isn't higher than the range
	    if ((!low.operator || low.operator === comp) &&
	        ltefn(version, low.semver)) {
	      return false;
	    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
	      return false;
	    }
	  }
	  return true;
	}

	// Use the define() function if we're in AMD land
	if (true)
	  !(__WEBPACK_AMD_DEFINE_FACTORY__ = (exports), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }

})