module.exports = function parseUrlAsView (req, v, error) {
  var _url = req.url;
  // TODO: expose in view module as common method
  // Note: parseUrlAsView method is copy and pasted from internals of `view` module
  // todo: keep track of level found, if we 404'd in a found level, show last known parent
  var parts = require('url').parse(_url).pathname.replace('options.prefix', '').split('/');
  parts.shift();
  //console.log(parts)
  
  // Remark: special case for root with no index, should be refactored
  //console.log("FML", v.key)
  if (parts.length === 1 && parts[0] === '' && !v['index']) {
    /*
    if (error !== false) {
      return missingViewHandler();
    }
    */
    //console.log('return missing / default view')
    return v;
  }
  var previousView;
  var foundViews = 0;
  //console.log('VIEW', v)
  parts.forEach(function(part, i) {
    //console.log(part)
    if(part.length > 0 && typeof v !== 'undefined') {
      if (typeof v[part] !== "undefined") {
        foundViews++;
        v = v[part];
        if (typeof v.presenter !== 'function' && typeof v['index'] !== "undefined" && i === parts.length - 1) {
          v = v['index'];
        }
      }
      else if (v['index']) {
        v = v['index'];
        //foundViews++;
      }
    }
  });

  if (foundViews < parts.length) {
    req.resource.params.id = parts[foundViews]; // TODO: switch back to array.slice to preserve additional route params
  }

  if (parts.length === 1) {
    req.resource.params.id = parts[0];
  }

  //console.log('FOUND', v.key, req.resource.params)
  return v;
};