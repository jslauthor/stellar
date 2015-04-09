webpackHotUpdate(0,{

/***/ 19:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./com.jslauthor.stellarApp.plist": 88,
		"./img/stellar.icns": 89,
		"./img/stellarBG.jpg": 107,
		"./img/stellarBG@2x.jpg": 108,
		"./img/tray_icon@2x.png": 109,
		"./img/tray_icon_alert@2x.png": 110,
		"./img/tray_icon_error@2x.png": 111,
		"./js/actions/ReviewAction": 67,
		"./js/actions/ReviewAction.js": 67,
		"./js/addons/TimeoutTransitionGroup": 90,
		"./js/addons/TimeoutTransitionGroup.js": 90,
		"./js/alt": 68,
		"./js/alt.js": 68,
		"./js/index": 69,
		"./js/index.js": 69,
		"./js/libs/updater/package": 91,
		"./js/libs/updater/package.json": 91,
		"./js/libs/updater/tools/unzip.exe": 92,
		"./js/libs/updater/updater": 93,
		"./js/libs/updater/updater.js": 93,
		"./js/services/MockService": 94,
		"./js/services/MockService.js": 94,
		"./js/stores/ConfigStore": 95,
		"./js/stores/ConfigStore.js": 95,
		"./js/stores/ReviewStore": 70,
		"./js/stores/ReviewStore.js": 70,
		"./js/utils/InterpreterUtil": 71,
		"./js/utils/InterpreterUtil.js": 71,
		"./js/utils/LocalStorageUtil": 72,
		"./js/utils/LocalStorageUtil.js": 72,
		"./js/utils/NotificationUtil": 73,
		"./js/utils/NotificationUtil.js": 73,
		"./js/utils/OSXUtil": 74,
		"./js/utils/OSXUtil.js": 74,
		"./js/views/AddItem.jsx": 75,
		"./js/views/Controls.jsx": 76,
		"./js/views/Main.jsx": 77,
		"./js/views/MainBackground.jsx": 78,
		"./js/views/ReviewItem.jsx": 79,
		"./js/views/ReviewList.jsx": 80,
		"./js/views/components/Stars.jsx": 96,
		"./js/views/components/StellarIcon.jsx": 81,
		"./js/views/controls/AddButton.jsx": 82,
		"./js/views/controls/CloseButton.jsx": 83,
		"./js/views/controls/DeleteButton.jsx": 97,
		"./js/views/controls/RefreshButton.jsx": 84,
		"./js/views/controls/SettingsButton.jsx": 85,
		"./js/views/controls/SortMenu.jsx": 98,
		"./js/views/controls/ToggleButton.jsx": 86,
		"./js/vo/Review": 87,
		"./js/vo/Review.js": 87
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 19;


/***/ },

/***/ 93:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\"use strict\";\n\nvar request = require(\"request\");\nvar path = require(\"path\");\nvar os = require(\"os\");\nvar fs = require(\"fs\");\nvar exec = require(\"child_process\").exec;\nvar spawn = require(\"child_process\").spawn;\nvar ncp = require(\"ncp\");\nvar del = require(\"del\");\nvar semver = require(\"semver\");\nvar gui = global.window.nwDispatcher.requireNwGui();\n\nvar platform = process.platform;\nplatform = /^win/.test(platform) ? \"win\" : /^darwin/.test(platform) ? \"mac\" : \"linux\" + (process.arch == \"ia32\" ? \"32\" : \"64\");\n\n/**\n * Creates new instance of updater. Manifest could be a `package.json` of project.\n *\n * Note that compressed apps are assumed to be downloaded in the format produced by [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder) (or [grunt-node-webkit-builder](https://github.com/mllrsohn/grunt-node-webkit-builder)).\n *\n * @constructor\n * @param {object} manifest - See the [manifest schema](#manifest-schema) below.\n */\nfunction updater(manifest) {\n  this.manifest = manifest;\n}\n\n/**\n * Will check the latest available version of the application by requesting the manifest specified in `manifestUrl`.\n *\n * The callback will always be called; the second parameter indicates whether or not there's a newer version.\n * This function assumes you use [Semantic Versioning](http://semver.org) and enforces it; if your local version is `0.2.0` and the remote one is `0.1.23456` then the callback will be called with `false` as the second paramter. If on the off chance you don't use semantic versioning, you could manually download the remote manifest and call `download` if you're happy that the remote version is newer.\n *\n * @param {function} cb - Callback arguments: error, newerVersionExists (`Boolean`), remoteManifest\n */\nupdater.prototype.checkNewVersion = function (cb) {\n  request.get(this.manifest.manifestUrl, gotManifest.bind(this)); //get manifest from url\n\n  /**\n   * @private\n   */\n  function gotManifest(err, req, data) {\n    if (err) {\n      return cb(err);\n    }\n\n    if (req.statusCode < 200 || req.statusCode > 299) {\n      return cb(new Error(req.statusCode));\n    }\n\n    try {\n      data = JSON.parse(data);\n    } catch (e) {\n      return cb(e);\n    }\n\n    cb(null, semver.gt(data.version, this.manifest.version), data);\n  }\n};\n\n/**\n * Downloads the new app to a template folder\n * @param  {Function} cb - called when download completes. Callback arguments: error, downloaded filepath\n * @param  {Object} newManifest - see [manifest schema](#manifest-schema) below\n * @return {Request} Request - stream, the stream contains `manifest` property with new manifest and 'content-length' property with the size of package.\n */\nupdater.prototype.download = function (cb, newManifest) {\n  var manifest = newManifest || this.manifest;\n  var url = manifest.packages[platform].url;\n  var pkg = request(url, function (err, response) {\n    if (err) {\n      cb(err);\n    }\n    if (response.statusCode < 200 || response.statusCode >= 300) {\n      pkg.abort();\n      return cb(new Error(response.statusCode));\n    }\n  });\n  pkg.on(\"response\", function (response) {\n    if (response && response.headers && response.headers[\"content-length\"]) {\n      pkg[\"content-length\"] = response.headers[\"content-length\"];\n    }\n  });\n  var filename = path.basename(url),\n      destinationPath = path.join(os.tmpdir(), filename);\n  // download the package to template folder\n  fs.unlink(path.join(os.tmpdir(), filename), function () {\n    pkg.pipe(fs.createWriteStream(destinationPath));\n    pkg.resume();\n  });\n  pkg.on(\"error\", cb);\n  pkg.on(\"end\", appDownloaded);\n  pkg.pause();\n\n  function appDownloaded() {\n    process.nextTick(function () {\n      if (pkg.response.statusCode >= 200 && pkg.response.statusCode < 300) {\n        cb(null, destinationPath);\n      }\n    });\n  }\n  return pkg;\n};\n\n/**\n * Returns executed application path\n * @returns {string}\n */\nupdater.prototype.getAppPath = function () {\n  var appPath = {\n    mac: path.join(process.cwd(), \"../../..\"),\n    win: path.dirname(process.execPath)\n  };\n  appPath.linux32 = appPath.win;\n  appPath.linux64 = appPath.win;\n  return appPath[platform];\n};\n\n/**\n * Returns current application executable\n * @returns {string}\n */\nupdater.prototype.getAppExec = function () {\n  var execFolder = this.getAppPath();\n  var exec = {\n    mac: \"\",\n    win: path.basename(process.execPath),\n    linux32: path.basename(process.execPath),\n    linux64: path.basename(process.execPath)\n  };\n  return path.join(execFolder, exec[platform]);\n};\n\n/**\n * Will unpack the `filename` in temporary folder.\n * For Windows, [unzip](https://www.mkssoftware.com/docs/man1/unzip.1.asp) is used.\n *\n * @param {string} filename\n * @param {function} cb - Callback arguments: error, unpacked directory\n * @param {object} manifest\n */\nupdater.prototype.unpack = function (filename, cb, manifest) {\n  pUnpack[platform].apply(this, arguments);\n};\n\n/**\n * @private\n * @param {string} zipPath\n * @return {string}\n */\nvar getZipDestinationDirectory = function getZipDestinationDirectory(zipPath) {\n  return path.join(os.tmpdir(), path.basename(zipPath, path.extname(zipPath)));\n},\n\n/**\n * @private\n * @param {object} manifest\n * @return {string}\n */\ngetExecPathRelativeToPackage = function getExecPathRelativeToPackage(manifest) {\n  var execPath = manifest.packages[platform] && manifest.packages[platform].execPath;\n\n  if (execPath) {\n    return execPath;\n  } else {\n    var suffix = {\n      win: \".exe\",\n      mac: \".app\"\n    };\n    return manifest.name + (suffix[platform] || \"\");\n  }\n};\n\nvar pUnpack = {\n  /**\n   * @private\n   */\n  mac: function mac(filename, cb, manifest) {\n    var args = arguments,\n        extension = path.extname(filename),\n        destination = path.join(os.tmpdir(), path.basename(filename, extension));\n\n    if (!fs.existsSync(destination)) {\n      fs.mkdirSync(destination);\n    }\n\n    if (extension === \".zip\") {\n      exec(\"unzip -xo \" + filename + \" >/dev/null\", { cwd: destination }, function (err) {\n        if (err) {\n          console.log(err);\n          return cb(err);\n        }\n        var appPath = path.join(destination, getExecPathRelativeToPackage(manifest));\n        cb(null, appPath);\n      });\n    } else if (extension === \".dmg\") {\n      (function () {\n        var findMountPoint = function (dmg_name, callback) {\n          exec(\"hdiutil info\", function (err, stdout) {\n            if (err) return callback(err);\n            var results = stdout.split(\"\\n\");\n            var dmgExp = new RegExp(dmg_name + \"$\");\n            for (var i = 0, l = results.length; i < l; i++) {\n              if (results[i].match(dmgExp)) {\n                var mountPoint = results[i].split(\"\\t\").pop();\n                var fileToRun = path.join(mountPoint, dmg_name + \".app\");\n                return callback(null, fileToRun);\n              }\n            }\n            callback(Error(\"Mount point not found\"));\n          });\n        };\n\n        // just in case if something was wrong during previous mount\n        exec(\"hdiutil unmount /Volumes/\" + path.basename(filename, \".dmg\"), function (err) {\n          exec(\"hdiutil attach \" + filename + \" -nobrowse\", function (err) {\n            if (err) {\n              if (err.code == 1) {\n                pUnpack.mac.apply(this, args);\n              }\n              return cb(err);\n            }\n            findMountPoint(path.basename(filename, \".dmg\"), cb);\n          });\n        });\n      })();\n    }\n  },\n  /**\n   * @private\n   */\n  win: function win(filename, cb, manifest) {\n    var destinationDirectory = getZipDestinationDirectory(filename),\n        unzip = function unzip() {\n      // unzip by C. Spieler (docs: https://www.mkssoftware.com/docs/man1/unzip.1.asp, issues: http://www.info-zip.org/)\n      exec(\"\\\"\" + path.resolve(__dirname, \"tools/unzip.exe\") + \"\\\" -u -o \\\"\" + filename + \"\\\" -d \\\"\" + destinationDirectory + \"\\\" > NUL\", function (err) {\n        if (err) {\n          return cb(err);\n        }\n\n        cb(null, path.join(destinationDirectory, getExecPathRelativeToPackage(manifest)));\n      });\n    };\n\n    fs.exists(destinationDirectory, function (exists) {\n      if (exists) {\n        del(destinationDirectory, { force: true }, function (err) {\n          if (err) {\n            cb(err);\n          } else {\n            unzip();\n          }\n        });\n      } else {\n        unzip();\n      }\n    });\n  },\n  /**\n   * @private\n   */\n  linux32: function linux32(filename, cb, manifest) {\n    //filename fix\n    exec(\"tar -zxvf \" + filename + \" >/dev/null\", { cwd: os.tmpdir() }, function (err) {\n      console.log(arguments);\n      if (err) {\n        console.log(err);\n        return cb(err);\n      }\n      cb(null, path.join(os.tmpdir(), getExecPathRelativeToPackage(manifest)));\n    });\n  }\n};\npUnpack.linux64 = pUnpack.linux32;\n\n/**\n * Runs installer\n * @param {string} appPath\n * @param {array} args - Arguments which will be passed when running the new app\n * @param {object} options - Optional\n * @returns {function}\n */\nupdater.prototype.runInstaller = function (appPath, args, options) {\n  return pRun[platform].apply(this, arguments);\n};\n\nvar pRun = {\n  /**\n   * @private\n   */\n  mac: function mac(appPath, args, options) {\n    //spawn\n    if (args && args.length) {\n      args = [appPath].concat(\"--args\", args);\n    } else {\n      args = [appPath];\n    }\n    return run(\"open\", args, options);\n  },\n  /**\n   * @private\n   */\n  win: function win(appPath, args, options, cb) {\n    return run(appPath, args, options, cb);\n  },\n  /**\n   * @private\n   */\n  linux32: function linux32(appPath, args, options, cb) {\n    var appExec = path.join(appPath, path.basename(this.getAppExec()));\n    fs.chmodSync(appExec, \"0755\");\n    if (!options) options = {};\n    options.cwd = appPath;\n    return run(appPath + \"/\" + path.basename(this.getAppExec()), args, options, cb);\n  }\n};\n\npRun.linux64 = pRun.linux32;\n\n/**\n * @private\n */\nfunction run(path, args, options) {\n  var opts = {\n    detached: true\n  };\n  for (var key in options) {\n    opts[key] = options[key];\n  }\n  var sp = spawn(path, args, opts);\n  sp.unref();\n  return sp;\n}\n\n/**\n * Installs the app (copies current application to `copyPath`)\n * @param {string} copyPath\n * @param {function} cb - Callback arguments: error\n */\nupdater.prototype.install = function (copyPath, cb) {\n  pInstall[platform].apply(this, arguments);\n};\n\nvar pInstall = {\n  /**\n   * @private\n   */\n  mac: function mac(to, cb) {\n    ncp(this.getAppPath(), to, cb);\n  },\n  /**\n   * @private\n   */\n  win: function win(to, cb) {\n    var self = this;\n    var errCounter = 50;\n    deleteApp(appDeleted);\n\n    function appDeleted(err) {\n      if (err) {\n        errCounter--;\n        if (errCounter > 0) {\n          setTimeout(function () {\n            deleteApp(appDeleted);\n          }, 100);\n        } else {\n          return cb(err);\n        }\n      } else {\n        ncp(self.getAppPath(), to, appCopied);\n      }\n    }\n    function deleteApp(cb) {\n      del(to, { force: true }, cb);\n    }\n    function appCopied(err) {\n      if (err) {\n        setTimeout(deleteApp, 100, appDeleted);\n        return;\n      }\n      cb();\n    }\n  },\n  /**\n   * @private\n   */\n  linux32: function linux32(to, cb) {\n    ncp(this.getAppPath(), to, cb);\n  }\n};\npInstall.linux64 = pInstall.linux32;\n\n/**\n * Runs the app from original app executable path.\n * @param {string} execPath\n * @param {array} args - Arguments passed to the app being ran.\n * @param {object} options - Optional. See `spawn` from nodejs docs.\n */\nupdater.prototype.run = function (execPath, args, options) {\n  var arg = arguments;\n  if (platform.indexOf(\"linux\") === 0) arg[0] = path.dirname(arg[0]);\n  pRun[platform].apply(this, arg);\n};\n\nmodule.exports = updater;"

/***/ }

})