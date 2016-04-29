var path = require('path'),
    fs = require('fs');
var query = require('./query'),
    layout = require('./layout'),
    render = require('./render');

var View = function (options) {
  var self = this;

  options = options || {};
  self.viewPath = options.path || process.cwd();

  if (options.path) {
    self.viewPath      = options.path;
    self.templatePath  = self.viewPath + '/';
    self.presenterPath = self.viewPath + '/';
  }

  if (options.autoindex === true) {
    self.autoindex = true;
  }

  self.ext = options.ext || ".html";

  if (options.remote) {
    self._remote = options.remote;
  }

  if (options.name) {
    self.name = options.name;
  } else {
    self.name = "";
  }

  if (options.key) {
    if(options.key === "/") {
      self.key = options.key + self.name;
    } else {
      self.key = options.key + "/" + self.name;
    }
  } else {
    self.key = "/";
  }

  if (options.template) {
    self.template = options.template;
    //
    // Remark: If we have been passed in a template as a string, the querySelectorAll context needs to be updated
    //
    self.$ = query(self.template);
  }

  if (options.presenter) {
    self.presenter = options.presenter;
  }

  if (options.parent) {
    self.parent = options.parent;
  }

  if (typeof options === "string") {
    this.load(options);
  }

  return this;
};

//
// Loads a view from remote HTTP source
//
View.prototype.remote = require('./remote');

//
// Loads a template file or directory by path
//
View.prototype.load = function (viewPath, cb) {
  var self = this;

  if(typeof cb !== 'function' && typeof viewPath === 'function') {
    cb = viewPath;
  }

  if (self._remote) {
    return self.remote(viewPath, cb);
  }

  if(typeof viewPath === "string") {
    self.viewPath = viewPath;
  }

  self.templatePath  = self.viewPath + '/';
  self.presenterPath = self.viewPath + '/';

  if (typeof cb !== 'function') {
    throw new Error("callback is required");
  }
  return self._loadAsync(cb);
};

View.prototype._loadAsync = function (cb) {
  var self = this,
  viewPath = self.viewPath,
  callbacks = 0;

  var root = self.viewPath;

  fs.readdir(root, function(err, dir) {
    if (err) {
      return cb(err);
    }
    dir = dir.filter(function(item){
      // TODO: move ignored files to JSON configuration option
      if (['.DS_Store'].indexOf(item) === -1) {
        return true;
      }
      return false;
    });
    // Do not attempt to process empty directories
    if (dir.length === 0) {
      return cb(null, self);
    }
    dir.forEach(function(p) {
      fs.stat(root + '/' + p, function(err, stat) {
        if (stat.isDirectory()){
          delegate('dir', p);
        } else {
          delegate('file', p);
        }
      });
    });
   });

  function delegate (type, _path) {
    var ext = self.detect(_path),
        subViewName;

    subViewName = _path;

    if (type === "file") {

      subViewName = _path.replace(ext, '');
      if (subViewName === ".DS_Store") {
        return;
      }
      //
      // increase the callback count
      //
      callbacks++;

      // TODO: refactor this method a bit with js presenter loading code
      function createView (presenter, template) {
        //
        // load the file as the current template
        //
        fs.readFile(root + '/' + _path, function (err, result) {

          if (err) {
            throw err;
          }
          result = result.toString();
          var presenter, template;
          //
          // determine if file is template or presenter
          //
          template = result;

          if (typeof self[subViewName] === "object") {
            self[subViewName].template = template;
            self.views[subViewName].template = template;
          } else {
            // console.log('self._root1', self._root);
            self[subViewName] = new View({
              name: subViewName,
              ext: ext,
              template: template,
              parent: self
            });

            // Remark: added additional scope to help iterate through nested views
            // without this additional views scope, we don't know whats a property or nested view
            self.views = self.views || {};
            //console.log('self._root2', self._root)
            self.views[subViewName] = new View({
              name: subViewName,
              ext: ext,
              template: template,
              parent: self
            });

          }

          callbacks--;
          if (callbacks === 0) {
            cb(null, self);
          }
        });
      }

      // determine if file is template or presenter ( presenters end in .js and are node modules )
      if (ext === ".js") {

        // if we found a .js file, assume its a presenter
        // check if a view already exists at this level with this name, if so attach this as presenter

        //
        // get presenter, if it exists
        //
        var presenterPath = root +  '/' + _path.replace(ext, '.js');

        //
        // Determine if presenter file exists first before attempting to require it
        //
        // TODO: replace with async stat
        var exists = false;
        try {
          var stat = fs.statSync(presenterPath);
          exists = true;
        } catch (err) {
          exists = false;
        }

        if (exists) {
          delete require.cache[presenterPath];
          require.cache[presenterPath] = null;
          var resolved = path.resolve(presenterPath);
          delete require.cache[resolved];
          require.cache[resolved] = null;
          presenter = require(resolved);
        }

        if (typeof self[subViewName] === "object") {
          self[subViewName].presenter = presenter;
          self.views[subViewName].presenter = presenter;
        } else {
          self[subViewName] = new View({
            name: subViewName,
            ext: ext,
            //template: template,
            presenter: presenter,
            key: self.key,
            parent: self
          });
          // Remark: added additional scope to help iterate through nested views
          // without this additional views scope, we don't know whats a property or nested view
          self.views = self.views || {};
          //console.log('self._root3', self._root, self.key);
          self.views[subViewName] = new View({
            name: subViewName,
            ext: ext,
            key: self.key,
            //template: template,
            presenter: presenter,
            parent: self
          });
        }
        callbacks--;
        setTimeout(function(){
          if (callbacks === 0) {
            cb(null, self);
          }
        }, 1);
      } else {
        // if we found a non .js file, assume it's a template
        // check if a view already exists at this level with this name, if so attach this as template
        createView();
      }
    }

    if (type === "dir") {
      //
      // create a new subview
      //
      self.views = self.views || {};
      //console.log('self._root4', self._root)

      self.views[subViewName] = self[subViewName] = new View({
        name: subViewName,
        ext: ext,
        key: self.key,
        path: root + '/' + _path,
        parent: self
      });
      //
      // increase callback count
      //
      callbacks ++;
      //
      // load view
      //
      self[subViewName].load(function() {
        //
        // decrease callback count
        //
        callbacks--;
        if(callbacks === 0){
          cb(null, self);
        }
      });
    }
  }
  return;

};

View.prototype.present = function (options, callback) {

  var self = this, useLayout = false, saveToCache = false;
  var _template = self.template;

  if (options.base) {
    //self = options.base;
  }

  if (options.template) {
    //_template = options.template;
  }

  if (options.layout) {
    //self.layout = options.layout;
  }

  // console.log('presenting', self.presenter.cache, self.lastCache, self._cache);
  self.schema = {};
  if (self.presenter && self.presenter.schema) {
    self.schema = self.presenter.schema;
  }
  if (self.presenter && typeof self.presenter.cache !== 'undefined' && typeof self.presenter.cache === "number") {
    // the presenter has indicated it should be cached. check to see if a version is already stored
    if (typeof self.lastCache === 'undefined') {
      // no cache has been found, as a cache is required. run the view and save to cache
      saveToCache = true;
      // console.log('first time, creating new cache');
    } else {
      // a cache has been found. check to see if it's expired. if not expired, serve.
      var now = new Date().getTime();
      var diff = (now - self.lastCache);
      if (self.presenter.cache === 0) {
        // a cache value of 0 indicates the cache never expires, return from cache
        return callback(null, self._cache);
      }
      if (diff >= self.presenter.cache) {
        saveToCache = true;
        // console.log('cache found, but expired by ', (diff - self.presenter.cache));
      } else {
        // console.log('cache found, serving');
        return callback(null, self._cache);
      }
    }
  }

  if (typeof options.useLayout === 'undefined' || options.useLayout === true) {
    useLayout = true;
  }

  // if this is not a layout, do perform layout
  if (self.name !== "layout") {
    // load query
    // TODO: better template rendering support
    var ren = _template;
    if (self.ext === ".markdown") {
      self.template = require('./engines/markdown')(self.template);
    }
    self.$ = query(_template);

    var overrideLayout = false;

    if (typeof self.presenter === "function" && self.presenter.useLayout === false) {
      overrideLayout = true;
    }
    //console.log('layout? ', useLayout, overrideLayout)
    if (useLayout && !overrideLayout) {

      layout.call(self, self, options, function (err, result) {
        if (err) {
          throw err;
        }
        // update template and reload query
        self.$ = query(result);

        var _presenter = render;
        if (typeof self.presenter === "function" ) {
          _presenter = self.presenter;
        } else if (typeof _template === "undefined") {
          var e = new Error("No presenter found!");
          e.code = "NO_PRESENTER_FOUND";
          return callback(e);
        }

        // if we have presenter, use it,
        // otherwise fallback to default presenter
        return _presenter.call(self, options, function (err, result){
          if (err === null) {
            if (saveToCache) {
              self.lastCache = new Date().getTime();
              self._cache = result;
            }
          }
          callback(err, result);
        });
      });
    } else {
      // if we have presenter, use it,
      // otherwise fallback to default presenter
      return (self.presenter || render).call(self, options, function (err, result){
        if (err === null) {
          if (saveToCache) {
            self.lastCache = new Date().getTime();
            self._cache = result;
          }
        }
        callback(err, result);
      });
    }
  } else {
    // load query
    self.$ = query(self.template);

    // if we have presenter, use it,
    // otherwise fallback to default presenter

    var _presenter = render;
    if (typeof self.presenter === "function" ) {
      _presenter = self.presenter;
    }

    return _presenter.call(self, options, function(err, result) {
      if (saveToCache) {
        self.lastCache = new Date().getTime();
        self._cache = result;
      }
      return callback(err, result);
    });
  }
};

//
// TODO: Detects view type based on current path
//
View.prototype.detect = function (p) {
  return path.extname(p);
};

View.prototype.breadcrumb = function () {
  if (typeof this.parent === "undefined") {
    return this.name;
  }
  return this.parent.breadcrumb() + '/' + this.name;
};

module['exports'] = View;