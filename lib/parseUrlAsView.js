module.exports = function parseUrlAsView (req, v, error) {
  var _url = req.url;
  // TODO: expose in view module as common method
  // Note: parseUrlAsView method is copy and pasted from internals of `view` module
  var parts = require('url').parse(_url).pathname.replace('options.prefix', '').split('/');
  parts.shift();

  // TODO: keep track of level found, if we 404'd in a found level, show last known parent
  // It's not a good idea to assume route params unless they have been passed in ( can cause conflict on namespace )
  // REMARK: This is a WIP of route parsing code ( was having issues with incorrect 404s )
  //var parts = require('url').parse(_url).pathname.replace(options.prefix, '').split('/');
  //parts.shift();
  // Remark: special case for root with no index, should be refactored
  if (parts.length === 1 && parts[0] === "" && !v['index']) {
   /*
   if (error !== false) {
     return missingViewHandler();
   }
   */
   return v
  }
  var previousView;
  var foundViews = 0;
  var routeParams = [];
  parts.forEach(function(part) {
   if(part.length > 0 && typeof v !== 'undefined') {
     previousView = v || v[part];
     v = v[part];
     if(typeof v === 'undefined') {
       routeParams.push(part)
     }
     foundViews++;
   }
  });
  if (v && v['index']) {
   v = v['index'];
  }
  if (typeof v === 'undefined' && previousView && previousView['index'] && previousView['index'].presenter && previousView['index'].presenter.route) {
   req.routeParams = routeParams;
   return previousView['index'];
  }

  return v;

};