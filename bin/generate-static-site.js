#!/usr/bin/env node
let view = require('../');
let path = require('path');
let fs = require('fs');

// load view from local ./view directory
view.create( { path: "./view" } , function(err, _view) {
  // dump entire object
  // console.log(err, _view);
  _view.generateStatic();
  // list of all loaded files
});

