webpackHotUpdate(0,{

/***/ 20:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var alt = __webpack_require__(1);
	var ReviewAction = __webpack_require__(3);
	var LocalStorageUtil = __webpack_require__(2);
	var _ = __webpack_require__(6);
	var moment = __webpack_require__(120);
	var AutoLaunch = __webpack_require__(369);
	
	var ReviewStore = (function () {
	    function ReviewStore() {
	        var _this = this;
	
	        _classCallCheck(this, ReviewStore);
	
	        this.bindActions(ReviewAction);
	        this.reviews = {};
	        this.loading = false;
	        this.showReviewPopup = false;
	        this.isEditing = false;
	        this.isMonitoring = true;
	        this.lastUpdate = "";
	        this.shouldScrollToBottom = true;
	        this.hasNewReviews = false;
	        this.notificationsEnabled = true;
	        this.runOnLogin = false;
	
	        this.nwAppLauncher = new AutoLaunch({
	            name: "stellarApp",
	            isHidden: false,
	            path: window.process.cwd().match(/.*?\.app/)
	        });
	
	        this.on("serialize", function () {
	            var state = _.cloneDeep(_this.alt.stores.ReviewStore.getState());
	            state.isEditing = false;
	            state.loading = false;
	            state.showReviewPopup = false;
	            delete state.nwAppLauncher;
	
	            _.each(state.reviews, function (review) {
	                review.loading = false;
	            });
	            return state;
	        });
	    }
	
	    _createClass(ReviewStore, {
	        onToggleMonitoring: {
	            value: function onToggleMonitoring() {
	                this.isMonitoring = !this.isMonitoring;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onToggleEditing: {
	            value: function onToggleEditing() {
	                this.isEditing = !this.isEditing;
	            }
	        },
	        onToggleNotifications: {
	            value: function onToggleNotifications() {
	                this.notificationsEnabled = !this.notificationsEnabled;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onCheckRunOnLogin: {
	            value: function onCheckRunOnLogin(error) {
	                console.log(error);
	                this.nwAppLauncher.isEnabled((function (enabled) {
	                    this.runOnLogin = enabled;
	                }).bind(this));
	            }
	        },
	        onToggleRunOnLogin: {
	            value: function onToggleRunOnLogin() {
	                this.runOnLogin = !this.runOnLogin;
	                if (this.runOnLogin) this.nwAppLauncher.enable(this.onCheckRunOnLogin.bind(this));else this.nwAppLauncher.disable(this.onCheckRunOnLogin.bind(this));
	            }
	        },
	        onShowAddReviewPopup: {
	            value: function onShowAddReviewPopup() {
	                this.showReviewPopup = true;
	            }
	        },
	        onHideAddReviewPopup: {
	            value: function onHideAddReviewPopup() {
	                this.showReviewPopup = false;
	            }
	        },
	        onAllComplete: {
	            value: function onAllComplete() {
	                this.lastUpdate = "Updated " + moment().format("ddd, h:mmA");
	                this.loading = false;
	            }
	        },
	        onRequestReview: {
	            value: function onRequestReview(review) {
	                this.loading = true;
	            }
	        },
	        onDeleteReview: {
	            value: function onDeleteReview(reviews) {
	                this.reviews = reviews;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onAddReview: {
	            value: function onAddReview(review) {
	                this.isEditing = false;
	                this.reviews[review.id] = review;
	                this.shouldScrollToBottom = true;
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onReviewComplete: {
	            value: function onReviewComplete(review) {
	                this.reviews[review.id] = review;
	                LocalStorageUtil.saveAll();
	                this._updateHasNew();
	            }
	        },
	        onMarkAsSeen: {
	            value: function onMarkAsSeen(reviewID) {
	                var review = this.reviews[reviewID];
	                if (!_.isUndefined(review)) review.hasNew = false;
	
	                this._updateHasNew();
	                LocalStorageUtil.saveAll();
	            }
	        },
	        onResetScrollToBottom: {
	            value: function onResetScrollToBottom() {
	                this.shouldScrollToBottom = false;
	            }
	        },
	        _updateHasNew: {
	            value: function _updateHasNew() {
	                this.hasNewReviews = false;
	                var self = this;
	                _.each(this.reviews, function (review) {
	                    if (review.hasNew) {
	                        self.hasNewReviews = true;
	                        return false;
	                    }
	                });
	            }
	        }
	    });
	
	    return ReviewStore;
	})();
	
	module.exports = alt.createStore(ReviewStore, "ReviewStore");

/***/ },

/***/ 369:
/***/ function(module, exports, __webpack_require__) {

	var AutoLaunch,
	  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	module.exports = AutoLaunch = (function() {
	
	  /* Public */
	  function AutoLaunch(opts) {
	    this.isEnabled = __bind(this.isEnabled, this);
	    this.disable = __bind(this.disable, this);
	    this.enable = __bind(this.enable, this);
	    this.fixOpts = __bind(this.fixOpts, this);
	    if (opts.name == null) {
	      throw new Error('You must specify a name');
	    }
	    this.opts = {};
	    this.opts.appName = opts.name;
	    this.opts.isHiddenOnLaunch = opts.isHidden != null ? opts.isHidden : false;
	    this.opts.appPath = opts.path != null ? opts.path : process.execPath;
	    this.fixOpts();
	    this.api = null;
	    if (/^win/.test(process.platform)) {
	      this.api = __webpack_require__(370);
	    } else if (/darwin/.test(process.platform)) {
	      this.api = __webpack_require__(371);
	    }
	  }
	
	  AutoLaunch.prototype.fixOpts = function() {
	    var tempPath;
	    if (/darwin/.test(process.platform)) {
	      this.opts.appPath = this.opts.appPath.replace('/Contents/Frameworks/node-webkit Helper.app/Contents/MacOS/node-webkit Helper', '');
	    }
	    if (this.opts.appPath.indexOf('/') !== -1) {
	      tempPath = this.opts.appPath.split('/');
	      this.opts.appName = tempPath[tempPath.length - 1];
	    } else if (this.opts.appPath.indexOf('\\') !== -1) {
	      tempPath = this.opts.appPath.split('\\');
	      this.opts.appName = tempPath[tempPath.length - 1];
	      this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - '.exe'.length);
	    }
	    if (/darwin/.test(process.platform)) {
	      return this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - '.app'.length);
	    }
	  };
	
	  AutoLaunch.prototype.enable = function(cb) {
	    if (cb == null) {
	      cb = (function(_this) {
	        return function() {};
	      })(this);
	    }
	    if (this.api == null) {
	      return cb(null);
	    }
	    this.api.enable(this.opts, cb);
	    return null;
	  };
	
	  AutoLaunch.prototype.disable = function(cb) {
	    if (cb == null) {
	      cb = (function(_this) {
	        return function() {};
	      })(this);
	    }
	    if (this.api == null) {
	      return cb(null);
	    }
	    this.api.disable(this.opts, cb);
	    return null;
	  };
	
	  AutoLaunch.prototype.isEnabled = function(cb) {
	    if (cb == null) {
	      cb = (function(_this) {
	        return function() {};
	      })(this);
	    }
	    if (this.api == null) {
	      return cb(false);
	    }
	    this.api.isEnabled(this.opts, cb);
	    return null;
	  };
	
	  return AutoLaunch;
	
	})();


/***/ },

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

	var Winreg, regKey;
	
	Winreg = __webpack_require__(372);
	
	regKey = new Winreg({
	  hive: Winreg.HKCU,
	  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
	});
	
	module.exports = {
	  regKey: regKey,
	  enable: function(opts, cb) {
	    return regKey.set(opts.appName, Winreg.REG_SZ, "\"" + opts.appPath + "\"", cb);
	  },
	  disable: function(opts, cb) {
	    return regKey.remove(opts.appName, cb);
	  },
	  isEnabled: function(opts, cb) {
	    return regKey.get(opts.appName, function(err, item) {
	      return cb(item != null);
	    });
	  }
	};


/***/ },

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

	var applescript, tellTo;
	
	applescript = __webpack_require__(373);
	
	tellTo = 'tell application "System Events" to ';
	
	module.exports = {
	  enable: (function(_this) {
	    return function(opts, cb) {
	      var command, isHidden, properties;
	      isHidden = opts.isHiddenOnLaunch ? 'false' : 'true';
	      properties = "{path:\"" + opts.appPath + "\", hidden:" + isHidden + ", name:\"" + opts.appName + "\"}";
	      command = tellTo + 'make login item at end with properties ' + properties;
	      return applescript.execString(command, cb);
	    };
	  })(this),
	  disable: (function(_this) {
	    return function(opts, cb) {
	      var command;
	      command = tellTo + ("delete login item \"" + opts.appName + "\"");
	      return applescript.execString(command, cb);
	    };
	  })(this),
	  isEnabled: (function(_this) {
	    return function(opts, cb) {
	      var command;
	      command = tellTo + "get the name of every login item";
	      return applescript.execString(command, function(err, loginItems) {
	        if (loginItems == null) {
	          return false;
	        }
	        return cb(loginItems.indexOf(opts.appName) > -1);
	      });
	    };
	  })(this)
	};


/***/ },

/***/ 372:
/***/ function(module, exports, __webpack_require__) {

	/************************************************************************************************************
	 * registry.js - contains a wrapper for the REG command under Windows, which provides access to the registry
	 *
	 *  author:   Paul Bottin a/k/a FrEsC
	 *
	 */
	
	/* imports */
	var util          = __webpack_require__(293)
	,   spawn         = __webpack_require__(294).spawn
	
	/* set to console.log for debugging */
	,   log           = function () {}
	
	/* registry hive ids */
	,   HKLM          = 'HKLM'
	,   HKCU          = 'HKCU'
	,   HKCR          = 'HKCR'
	,   HKU           = 'HKU'
	,   HKCC          = 'HKCC'
	,   HIVES         = [ HKLM, HKCU, HKCR, HKU, HKCC ]
	
	/* registry value type ids */
	,   REG_SZ        = 'REG_SZ'
	,   REG_MULTI_SZ  = 'REG_MULTI_SZ'
	,   REG_EXPAND_SZ = 'REG_EXPAND_SZ'
	,   REG_DWORD     = 'REG_DWORD'
	,   REG_QWORD     = 'REG_QWORD'
	,   REG_BINARY    = 'REG_BINARY'
	,   REG_NONE      = 'REG_NONE'
	,   REG_TYPES     = [ REG_SZ, REG_MULTI_SZ, REG_EXPAND_SZ, REG_DWORD, REG_QWORD, REG_BINARY, REG_NONE ]
	
	/* general key pattern */
	,   KEY_PATTERN   = /(\\[a-zA-Z0-9_\s]+)*/
	
	/* key path pattern (as returned by REG-cli) */
	,   PATH_PATTERN  = /^(HKEY_LOCAL_MACHINE|HKEY_CURRENT_USER|HKEY_CLASSES_ROOT|HKEY_USERS|HKEY_CURRENT_CONFIG)(.*)$/
	
	/* registry item pattern */
	,   ITEM_PATTERN  = /^([a-zA-Z0-9_\s\\-]+)\s(REG_SZ|REG_MULTI_SZ|REG_EXPAND_SZ|REG_DWORD|REG_QWORD|REG_BINARY|REG_NONE)\s+([^\s].*)$/
	
	
	
	/**
	 * a single registry value record
	 */
	function RegistryItem (host, hive, key, name, type, value) {
	
	  if (!(this instanceof RegistryItem))
	    return new RegistryItem(host, hive, key, name, type, value);
	
	  /* private members */
	  var _host = host    // hostname
	  ,   _hive = hive    // registry hive
	  ,   _key = key      // registry key
	  ,   _name = name    // property name
	  ,   _type = type    // property type
	  ,   _value = value  // property value
	
	  /* getters/setters */
	  this.__defineGetter__('host', function () { return _host; });
	  this.__defineGetter__('hive', function () { return _hive; });
	  this.__defineGetter__('key', function () { return _key; });
	  this.__defineGetter__('name', function () { return _name; });
	  this.__defineGetter__('type', function () { return _type; });
	  this.__defineGetter__('value', function () { return _value; });
	
	  Object.freeze(this);
	}
	
	util.inherits(RegistryItem, Object);
	
	/* lock RegistryItem class */
	Object.freeze(RegistryItem);
	Object.freeze(RegistryItem.prototype);
	
	
	
	/**
	 * a registry object, which provides access to a single Registry key
	 */
	function Registry (options) {
	
	  if (!(this instanceof Registry))
	    return new Registry(options);
	
	  /* private members */
	  var _options = options || {}
	  ,   _host = '' + (_options.host || '')    // hostname
	  ,   _hive = '' + (_options.hive || HKLM)  // registry hive
	  ,   _key  = '' + (_options.key  || '')    // registry key
	
	  /* getters/setters */
	  this.__defineGetter__('host', function () { return _host; });
	  this.__defineGetter__('hive', function () { return _hive; });
	  this.__defineGetter__('key', function () { return _key; });
	  this.__defineGetter__('path', function () { return (_host.length == 0 ? '' : '\\\\' + host + '\\') + _hive + _key; });
	  this.__defineGetter__('parent', function () {
	    var i = _key.lastIndexOf('\\')
	    return new Registry({
	      host: this.host,
	      hive: this.hive,
	      key:  (i == -1)?'':_key.substring(0, i)
	    });
	  });
	
	  // validate options...
	  if (HIVES.indexOf(_hive) == -1)
	    throw new Error('illegal hive specified.');
	
	  if (!KEY_PATTERN.test(_key))
	    throw new Error('illegal key specified.');
	
	  Object.freeze(this);
	}
	
	util.inherits(Registry, Object);
	
	/**
	 * registry hive key LOCAL_MACHINE
	 */
	Registry.HKLM = HKLM;
	
	/**
	 * registry hive key CURRENT_USER
	 */
	Registry.HKCU = HKCU;
	
	/**
	 * registry hive key CLASSES_ROOT
	 */
	Registry.HKCR = HKCR;
	
	/**
	 * registry hive key USERS
	 */
	Registry.HKU = HKU;
	
	/**
	 * registry hive key CURRENT_CONFIG
	 */
	Registry.HKCC = HKCC;
	
	/**
	 * collection of available registry hive keys
	 */
	Registry.HIVES = HIVES;
	
	/**
	 * registry value type STRING
	 */
	Registry.REG_SZ = REG_SZ;
	
	/**
	 * registry value type MULTILINE_STRING
	 */
	Registry.REG_MULTI_SZ = REG_MULTI_SZ;
	
	/**
	 * registry value type EXPANDABLE_STRING
	 */
	Registry.REG_EXPAND_SZ = REG_EXPAND_SZ;
	
	/**
	 * registry value type DOUBLE_WORD
	 */
	Registry.REG_DWORD = REG_DWORD;
	
	/**
	 * registry value type QUAD_WORD
	 */
	Registry.REG_QWORD = REG_QWORD;
	
	/**
	 * registry value type BINARY
	 */
	Registry.REG_BINARY = REG_BINARY;
	
	/**
	 * registry value type UNKNOWN
	 */
	Registry.REG_NONE = REG_NONE;
	
	/**
	 * collection of available registry value types
	 */
	Registry.REG_TYPES = REG_TYPES;
	
	/**
	 * retrieve all values from this registry key
	 */
	Registry.prototype.values = function values (cb) {
	
	  if (typeof cb !== 'function')
	    throw new TypeError('must specify a callback');
	
	  var args = [ 'QUERY', this.path ]
	  ,   proc = spawn('REG', args, {
	        cwd: undefined,
	        env: process.env,
	        stdio: [ 'ignore', 'pipe', 'ignore' ]
	      })
	  ,   buffer = ''
	  ,   self = this
	
	  proc.on('close', function (code) {
	
	    if (code !== 0) {
	      log('process exited with code ' + code);
	      cb(new Error('process exited with code ' + code), null);
	    } else {
	      var items = []
	      ,   result = []
	      ,   lines = buffer.split('\n')
	      ,   lineNumber = 0
	
	      for (var line in lines) {
	        lines[line] = lines[line].trim();
	        if (lines[line].length > 0) {
	          log(lines[line]);
	          if (lineNumber != 0) {
	            items.push(lines[line]);
	          }
	          ++lineNumber;
	        }
	      }
	
	      for (var item in items) {
	
	        var match = ITEM_PATTERN.exec(items[item])
	        ,   name
	        ,   type
	        ,   value
	
	        if (match) {
	          name = match[1].trim();
	          type = match[2].trim();
	          value = match[3];
	          result.push(new RegistryItem(self.host, self.hive, self.key, name, type, value));
	        }
	      }
	
	      cb(null, result);
	
	    }
	  });
	
	  proc.stdout.on('data', function (data) {
	    buffer += data.toString();
	  });
	
	  return this;
	};
	
	/**
	 * retrieve all subkeys from this registry key
	 */
	Registry.prototype.keys = function keys (cb) {
	
	  if (typeof cb !== 'function')
	    throw new TypeError('must specify a callback');
	
	  var args = [ 'QUERY', this.path ]
	  ,   proc = spawn('REG', args, {
	        cwd: undefined,
	        env: process.env,
	        stdio: [ 'ignore', 'pipe', 'ignore' ]
	      })
	  ,   buffer = ''
	  ,   self = this
	
	  proc.on('close', function (code) {
	    if (code !== 0) {
	      log('process exited with code ' + code);
	      cb(new Error('process exited with code ' + code), null);
	    }
	  });
	
	  proc.stdout.on('data', function (data) {
	    buffer += data.toString();
	  });
	
	  proc.stdout.on('end', function () {
	
	    var items = []
	    ,   result = []
	    ,   lines = buffer.split('\n')
	
	    for (var line in lines) {
	      lines[line] = lines[line].trim();
	      if (lines[line].length > 0) {
	        log(lines[line]);
	        items.push(lines[line]);
	      }
	    }
	
	    for (var item in items) {
	
	      var match = PATH_PATTERN.exec(items[item])
	      ,   hive
	      ,   key
	
	      if (match) {
	        hive = match[1];
	        key  = match[2];
	        if (key && (key !== self.key)) {
	          result.push(new Registry({
	            host: self.host,
	            hive: self.hive,
	            key:  key
	          }));
	        }
	      }
	    }
	
	    cb(null, result);
	
	  });
	
	  return this;
	};
	
	/**
	 * retrieve a named value from this registry key
	 */
	Registry.prototype.get = function get (name, cb) {
	
	  if (typeof cb !== 'function')
	    throw new TypeError('must specify a callback');
	
	  var args = [ 'QUERY', this.path, '/v', name ]
	  ,   proc = spawn('REG', args, {
	        cwd: undefined,
	        env: process.env,
	        stdio: [ 'ignore', 'pipe', 'ignore' ]
	      })
	  ,   buffer = ''
	  ,   self = this
	
	  proc.on('close', function (code) {
	    if (code !== 0) {
	      log('process exited with code ' + code);
	      cb(new Error('process exited with code ' + code), null);
	    } else {
	      var items = []
	      ,   result = null
	      ,   lines = buffer.split('\n')
	      ,   lineNumber = 0
	
	      for (var line in lines) {
	        lines[line] = lines[line].trim();
	        if (lines[line].length > 0) {
	          log(lines[line]);
	          if (lineNumber != 0) {
	             items.push(lines[line]);
	          }
	          ++lineNumber;
	        }
	      }
	
	      var item = items[0] || ''
	      ,   match = ITEM_PATTERN.exec(item)
	      ,   name
	      ,   type
	      ,   value
	
	      if (match) {
	        name = match[1].trim();
	        type = match[2].trim();
	        value = match[3];
	        result = new RegistryItem(self.host, self.hive, self.key, name, type, value);
	      }
	
	      cb(null, result);
	    }
	  });
	
	  proc.stdout.on('data', function (data) {
	    buffer += data.toString();
	  });
	
	  return this;
	};
	
	/**
	 * put a value into this registry key, overwrites existing value
	 */
	Registry.prototype.set = function set (name, type, value, cb) {
	
	  if (typeof cb !== 'function')
	    throw new TypeError('must specify a callback');
	
	  if (REG_TYPES.indexOf(type) == -1)
	    throw Error('illegal type specified.');
	  
	  var args = ['ADD', this.path];
	  if (name == '')
	    args.push('/ve');
	  else
	    args = args.concat(['/v', name]);
	  
	  args = args.concat(['/t', type, '/d', value, '/f']);
	
	  var proc = spawn('REG', args, {
	        cwd: undefined,
	        env: process.env,
	        stdio: [ 'ignore', 'pipe', 'ignore' ]
	      })
	
	  proc.on('close', function (code) {
	    if (code !== 0) {
	      log('process exited with code ' + code);
	      cb(new Error('process exited with code ' + code));
	    } else {
	      cb(null);
	    }
	  });
	
	  proc.stdout.on('data', function (data) {
	    // simply discard output
	    log(''+data);
	  });
	
	  return this;
	};
	
	/**
	 * remove a named value from this registry key
	 */
	Registry.prototype.remove = function remove (name, cb) {
	
	  if (typeof cb !== 'function')
	    throw new TypeError('must specify a callback');
	
	  var args = name ? ['DELETE', this.path, '/f', '/v', name] : ['DELETE', this.path, '/f', '/ve']
	  ,   proc = spawn('REG', args, {
	        cwd: undefined,
	        env: process.env,
	        stdio: [ 'ignore', 'pipe', 'ignore' ]
	      })
	
	  proc.on('close', function (code) {
	    if (code !== 0) {
	      log('process exited with code ' + code);
	      cb(new Error('process exited with code ' + code));
	    } else {
	      cb(null);
	    }
	  });
	
	  proc.stdout.on('data', function (data) {
	    // simply discard output
	    log(''+data);
	  });
	
	  return this;
	};
	
	/**
	 * erase this registry key and it's contents
	 */
	Registry.prototype.erase = function erase (cb) {
	
	  if (typeof cb !== 'function')
	    throw new TypeError('must specify a callback');
	
	  var args = ['DELETE', this.path, '/f', '/va']
	  ,   proc = spawn('REG', args, {
	        cwd: undefined,
	        env: process.env,
	        stdio: [ 'ignore', 'pipe', 'ignore' ]
	      })
	
	  proc.on('close', function (code) {
	    if (code !== 0) {
	      log('process exited with code ' + code);
	      cb(new Error('process exited with code ' + code));
	    } else {
	      cb(null);
	    }
	  });
	
	  proc.stdout.on('data', function (data) {
	    // simply discard output
	    log(''+data);
	  });
	
	  return this;
	};
	
	/**
	 * create this registry key
	 */
	Registry.prototype.create = function create (cb) {
	
	  if (typeof cb !== 'function')
	    throw new TypeError('must specify a callback');
	
	  var args = ['ADD', this.path]
	  ,   proc = spawn('REG', args, {
	        cwd: undefined,
	        env: process.env,
	        stdio: [ 'ignore', 'pipe', 'ignore' ]
	      })
	
	  proc.on('close', function (code) {
	    if (code !== 0) {
	      log('process exited with code ' + code);
	      cb(new Error('process exited with code ' + code));
	    } else {
	      cb(null);
	    }
	  });
	
	  proc.stdout.on('data', function (data) {
	    // simply discard output
	    log(''+data);
	  });
	
	  return this;
	};
	
	module.exports = Registry;
	
	/* lock Registry class */
	Object.freeze(Registry);
	Object.freeze(Registry.prototype);


/***/ },

/***/ 373:
/***/ function(module, exports, __webpack_require__) {

	var spawn = __webpack_require__(294).spawn;
	exports.Parsers = __webpack_require__(374);
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
	}
	
	// Execute a String as AppleScript.
	exports.execString = function execString(str, callback) {
	  return runApplescript(str, callback);
	}
	
	
	
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
	
	  interpreter.on('exit', function(code) {
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
	  stream.on("data", function(chunk) { stream.body += chunk; });
	}


/***/ },

/***/ 374:
/***/ function(module, exports, __webpack_require__) {

	
	// 'parse' accepts a string that is expected to be the stdout stream of an
	// osascript invocation. It reads the fist char of the string to determine
	// the data-type of the result, and creates the appropriate type parser.
	exports.parse = function(str) {
	  if (str.length == 0) {
	    return;
	  }
	  
	  var rtn = parseFromFirstRemaining.call({
	    value: str,
	    index: 0
	  });
	  return rtn;
	}
	
	// Attemps to determine the data type of the next part of the String to
	// parse. The 'this' value has a Object with 'value' as the AppleScript
	// string to parse, and 'index' as the pointer to the current position
	// of parsing in the String. This Function does not need to be exported???
	function parseFromFirstRemaining() {
	  var cur = this.value[this.index];
	  switch(cur) {
	    case '{':
	      return exports.ArrayParser.call(this);
	      break;
	    case '"':
	      return exports.StringParser.call(this);
	      break;
	    case 'a':
	      if (this.value.substring(this.index, this.index+5) == 'alias') {
	        return exports.AliasParser.call(this);
	      }
	      break;
	    case '«':
	      if (this.value.substring(this.index, this.index+5) == '«data') {
	        return exports.DataParser.call(this);
	      }
	      break;
	  }
	  if (!isNaN(cur)) {
	    return exports.NumberParser.call(this);
	  }
	  return exports.UndefinedParser.call(this);
	}
	
	// Parses an AppleScript "alias", which is really just a reference to a
	// location on the filesystem, but formatted kinda weirdly.
	exports.AliasParser = function() {
	  this.index += 6;
	  return "/Volumes/" + exports.StringParser.call(this).replace(/:/g, "/");
	}
	
	// Parses an AppleScript Array. Which looks like {}, instead of JavaScript's [].
	exports.ArrayParser = function() {
	  var rtn = [],
	    cur = this.value[++this.index];
	  while (cur != '}') {
	    rtn.push(parseFromFirstRemaining.call(this));
	    if (this.value[this.index] == ',') this.index += 2;
	    cur = this.value[this.index];
	  }
	  this.index++;
	  return rtn;
	}
	
	// Parses «data » results into native Buffer instances.
	exports.DataParser = function() {
	  var body = exports.UndefinedParser.call(this);
	  body = body.substring(6, body.length-1);
	  var type = body.substring(0,4);
	  body = body.substring(4, body.length);
	  var buf = new Buffer(body.length/2);
	  var count = 0;
	  for (var i=0, l=body.length; i<l; i += 2) {
	    buf[count++] = parseInt(body[i]+body[i+1], 16);
	  }
	  buf.type = type;
	  return buf;
	}
	
	// Parses an AppleScript Number into a native JavaScript Number instance.
	exports.NumberParser = function() {
	  return Number(exports.UndefinedParser.call(this));
	}
	
	// Parses a standard AppleScript String. Which starts and ends with "" chars.
	// The \ char is the escape character, so anything after that is a valid part
	// of the resulting String.
	exports.StringParser = function(str) {
	  var rtn = "",
	    end = ++this.index,
	    cur = this.value[end++];
	  while(cur != '"') {
	    if (cur == '\\') {
	      rtn += this.value.substring(this.index, end-1);
	      this.index = end++;
	    }
	    cur = this.value[end++];
	  }
	  rtn += this.value.substring(this.index, end-1);
	  this.index = end;
	  return rtn;
	}
	
	// When the "parseFromFirstRemaining" function can't figure out the data type
	// of "str", then the UndefinedParser is used. It crams everything it sees
	// into a String, until it finds a ',' or a '}' or it reaches the end of data.
	var END_OF_TOKEN = /}|,|\n/;
	exports.UndefinedParser = function() {
	  var end = this.index, cur = this.value[end++];
	  while (!END_OF_TOKEN.test(cur)) {
	    cur = this.value[end++];
	  }
	  var rtn = this.value.substring(this.index, end-1);
	  this.index = end-1;
	  return rtn;
	}


/***/ }

})
//# sourceMappingURL=0.56f600a8a57475ae63b3.hot-update.js.map