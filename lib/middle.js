// view connect middleware
var autoindex = require('./autoindex');

module['exports'] = function (options) {
  options.prefix = options.prefix || '';

  return function (req, res, next) {
    if (options.view) {
      //
      // If the view was mounted with a prefix and that prefix was not found in the incoming url,
      // do not attempt to use that view
      //
      if (options.prefix.length > 0 && req.url.search(options.prefix) === -1) {
        return next();
      }
      var _view = options.view;
      var parts = require('url').parse(req.url).pathname.replace(options.prefix, '').split('/');
      parts.shift();

      // Remark: special case for root with no index, should be refactored
      if (parts.length === 1 && parts[0] === "" && !_view['index']) {
        return missingViewHandler();
      }

      parts.forEach(function(part) {
        if(part.length > 0 && typeof _view !== 'undefined') {
          _view = _view[part];
        }
      });
      if (_view && _view['index']) {
        _view = _view['index'];
      }
      if(typeof _view === "undefined") {
        return missingViewHandler();
      }
      if (typeof _view.present !== 'function') {
        return missingViewHandler();
      }

      _view.present({
        request: req,
        response: res,
        data: req.resource.params
        }, function (err, rendered) {
          if (err) {
            if (err.code === "NO_PRESENTER_FOUND" && options.view.autoindex) {
              return autoindex(_view, {
                request: req,
                response: res,
                data: req.resource.params
              }, function (err, html){
                res.end(html);
              });
            }
            return res.end(err.message);
          } else {
            res.end(rendered);
          }
      });
    } else {
      //
      // No view was found, do not use middleware
      //
      missingViewHandler();
    }

    function missingViewHandler () {
      /*
      if (options.view.autoindex) {
        //var resp = Object.keys(_view.views);
        //return res.end(autoindex(_view));
        //return res.end(JSON.stringify(resp, true, 2));
      }
      */
      // Remark: Simply move forward to the next middleware on the on the express stack
      next();
    };

  };

};