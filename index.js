var view = {};

var View = view.View = require('./lib/View');
view.middle = require('./lib/middle');
view.parseUrlAsView = require('./lib/parseUrlAsView');

view.create = function (options, callback) {
  options = options || {};
  var _view;
  _view = new View(options);
  if (options.path) {
    return _view.load(function(err, r){
      callback(null, r)
    });
  } else {
    return callback(null, _view);
  }
}

module['exports'] = view;