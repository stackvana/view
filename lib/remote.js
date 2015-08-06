// loads a view from a remote http source
// the source of the view is irrelvenant, it should be any HTTP complaiant webserver

// Remark: hyperquest and through are required for remote views
var request = require('hyperquest');
var through = require('through2');
var colors = require('colors');

// TODO: consider giving a streaming interface to the file instead of buffering the output here

/*

  types of incoming urls:
    /
    /index.html
    /blog
    /blog/
    /blog/index.html
    /css/styles.css


  1. check if this is a static assett or a dynamic view
    - if static asset, open up stream and serve it without anything else
    - if dynamic view, attempt to load layout and presenter for view

*/

module['exports'] = function remoteView (remotePath, callback) {

  var viewFormats = ['.html'], self = this, basePath;

  if (typeof remotePath === "undefined") {
    return callback(new Error('remotePath argument is required!'));
  }

  var lastItem = remotePath.split('/');
  if (lastItem.length > 0) {
    lastItem = lastItem.pop();
  }

  // if no . is found, then assume its a folder of index view
  if (lastItem.search(/\./) === -1) {
    if(lastItem.substr(lastItem.length-1, lastItem.length) === "/") {
      remotePath += "index.html";
    } else {
      remotePath += "/index.html";
    }
  }

  basePath = remotePath.split('/');
  basePath.pop();
  basePath = basePath.join('/');
  basePath = self._remote + basePath;

  function _remoteView() {
    // if no .html extension is found, then assume its a static asset and we should continue
    if (remotePath.search(/\.html/) === -1) {
      return serveStatic();
    }
    return serveView(callback);
  }

  _remoteView(remotePath);

  function serveStatic () {

    // console.log('serving static assett', remotePath);

    var lastItem = remotePath.split('/');
    if (lastItem.length > 0) {
      lastItem = lastItem.pop();
    }

    // if no . is found, then assume its a folder of index view
    if (lastItem.search(/\./) === -1) {
      remotePath += "/index.html";
    }

    var remoteFilePath = self._remote + remotePath;
    var remoteFileOutput = '';
    var remoteFile = request(remoteFilePath);

    remoteFile.on('error', function(err){
      console.log('remoteFile error'.red);
      throw err;
    });

    remoteFile.pipe(through(function(chunk, enc, cb){
      remoteFileOutput += chunk;
      cb(null);
    }));
    remoteFile.on('end', function (err, res){
      // TODO: this is hard-coded to the Github response,
      // it should be using the HTTP status code 404 instead....
      if (remoteFileOutput === "Not Found") {
        if (remoteFilePath.substr(remoteFilePath.length-1, remoteFilePath.length) !== "/") {
          remotePath += "/";
          return _remoteView(remotePath, callback);
        } else {
          return callback(new Error('Could not find file: ' + remoteFilePath));
        }
      } else {
        return callback(err, remoteFileOutput);
      }
    });
  };

  function fetchTemplate (callback) {

    var remoteTemplatePath = self._remote + remotePath;
    // console.log('remote template'.yellow, remoteTemplatePath);
    var remoteTemplateOutput = '';
    var remoteTemplate = request(remoteTemplatePath);

    remoteTemplate.on('error', function(err){
      return callback(err);
    });

    remoteTemplate.pipe(through(function(chunk, enc, cb){
      remoteTemplateOutput += chunk;
      cb(null);
    }));

    remoteTemplate.on('end', function(err, res){
      return callback(err, remoteTemplateOutput);
      // TODO: this is hard-coded to the Github response,
      // it should be using the HTTP status code 404 instead....
      if (remoteTemplateOutput === "Not Found") {
      } else {
      }
    });
  };

  // TODO: remote presenters
  function fetchPresenter (cb) {
    var remotePresenterPath = basePath + "index.js";
    console.log('remote presenter'.yellow, remotePresenterPath);
    var remotePresenter = request(remotePresenterPath);
  };

  function fetchLayout (cb) {
    var remoteLayoutPath;
    if (basePath.substr(basePath.length-1, basePath.length) !== "/") {
      remoteLayoutPath = basePath + "/layout.html";
    } else {
      remoteLayoutPath = basePath + "layout.html";
    }
    // console.log('remoteLayoutPath'.yellow, remoteLayoutPath);
    var remoteLayout = request(remoteLayoutPath);
    var remoteLayoutTemplateOutput = '';
    remoteLayout.on('error', function(err){
      return cb(err);
    });
    remoteLayout.pipe(through(function(chunk, enc, cb){
      remoteLayoutTemplateOutput += chunk;
      cb(null);
    }));
    remoteLayout.on('end', function(){
      return cb(null, remoteLayoutTemplateOutput);
    });
  };

  // TODO: remote layout presenters
  function fetchLayoutPresenter (cb) {};

  function serveView (cb) {
    //console.log('serving dynamic view', remotePath);
    fetchLayout(function(err, remoteLayoutTemplateOutput) {
      if (err) {
        return cb(err);
      }
      // console.log('callbacked fetchLayout', err, remoteLayoutTemplateOutput)
      fetchTemplate(function(err, remoteTemplateOutput) {
        if (err) {
          return cb(err);
        }
        // console.log('callbacked fetchTemplate', err, remoteTemplateOutput)
          // TODO: this is hard-coded to the Github response,
          // it should be using the HTTP status code 404 instead....
          if (remoteLayoutTemplateOutput === "Not Found" ) {
            // don't use the layout
            // console.log('not using layout', remoteTemplateOutput)
            cb(null, remoteTemplateOutput);
          } else {
            // console.log('applying layout'.yellow, remoteLayoutTemplateOutput)
            var query = require('../lib/query');
            var $;
            $ = query(remoteLayoutTemplateOutput.toString());
            $('.yield').html(remoteTemplateOutput);
            cb(null, $.html());
          }
      });
    });
  };

};