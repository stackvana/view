// view connect middleware
var autoindex = require('./autoindex');
var parseUrlAsView = require('./parseUrlAsView');
module['exports'] = function (options) {
  options.prefix = options.prefix || '';
  return function routeRequest (req, res, next) {
    if (options.view) {
      //
      // If the view was mounted with a prefix and that prefix was not found in the incoming url,
      // do not attempt to use that view
      //
      // console.log(req.url.blue, 'prefix', options.prefix)
      if (options.prefix.length > 0 && req.url.search(options.prefix) === -1) {
        return next();
      }
      var _view = options.view;
      var _baseView = options.baseView;

      _view = parseUrlAsView(req, _view)

      /*
        // TODO: uncomment out next block
        req.resource = req.resource || {};
        req.resource._args = parts;
        req.resource.args = parts.slice(foundViews - 1, parts.length);
      */

      if (typeof _view === "undefined") {
        return missingViewHandler();
        // TODO: uncomment out next block
        /* 
           Note: will jump back to previous level of view on 404 
                 this is needed for regex route parsing
          if (typeof previousView !== "undefined") {
            _view = previousView.index;
          } else {
            return missingViewHandler();
          }
        */
      }

      var Route = require('route-parser');
      // TODO: multi-level route parsing
      if (typeof _view === 'object' && typeof _view.presenter === 'function' && typeof _view.presenter.route !== "undefined" && _view.presenter.route.length > 0) {
        var _route = _view.presenter.route;
        // console.log('building', _route, _view.name, req.url, _view.key, req.routeParams)
        var route = new Route('/' + _route);
        var routeParams = route.match("/" + req.routeParams);
        // console.log("route results", _route,  req.routeParams, routeParams)
        if (routeParams === false) {
          res.writeHead(404);
          // TODO: make error customizable
          res.end('Invalid path: ' + "/" + _view.routeParams + ' does not match ' + _route);
          return;
        } else {
          // route matches, map route parameters to resource scope
          for (var p in routeParams) {
            req.resource.params[p] = routeParams[p];
          }
        }
      }

      // Note: presenters are currently required for view middleware
      // this could be changed easily by adding an additional method for default html rendering
      if (typeof _view.present !== 'function') {
        return missingViewHandler();
      }

      var __view, _template = _view.template;
      var _layout = _view.layout;
      if (typeof _baseView !== "undefined") {
        _baseView = parseUrlAsView(req.url, _baseView, false);
        // console.log('found a baseView to extend', _baseView)
        if (typeof _baseView !== "undefined" && typeof _baseView.presenter !== "undefined" && typeof _view.presenter === "undefined") {
          __view = _view;
          __view.presenter = _baseView.presenter;
        } else {
          __view = _view;
        }
      } else {
        __view = _view;
      }

      __view.present({
        request: req,
        response: res,
        req: req,
        res: res,
        unauthorizedRoleAccess: options.unauthorizedRoleAccess,
        checkRoleAccess: options.checkRoleAccess,
        data: req.resource.params
        }, function (err, rendered) {
          if (err) {
            if (err.code === "NO_PRESENTER_FOUND" && options.view.autoindex) {
              return autoindex(__view, {
                request: req,
                response: res,
                req: req,
                res: res,
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
      // If we hit a missing view and autoindex is enabled, and we actually have a view to autoindex
      // Note: in most cases, it seems this is already taken care of...
      // ...we could probably refactor and remove the following block
      // console.log('missingViewHandler', req.url, options.view.autoindex);
      // return next();
      if (options.view && options.view.autoindex && typeof _view === "object") {
        //var resp = Object.keys(_view.views);
        return autoindex(_view, {
          request: req,
          response: res,
          req: req,
          res: res,
          data: req.resource.params,
          unauthorizedRoleAccess: options.unauthorizedRoleAccess,
          checkRoleAccess: options.checkRoleAccess
        }, function (err, html){
          res.end(html);
        });

        //return res.end(JSON.stringify(resp, true, 2));
      } else {
        // Remark: Simply move forward to the next middleware on the on the express stack
        next();
      }
    };

  };

};