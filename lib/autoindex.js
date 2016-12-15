/*
  autoindex.js - creates a directory autolisting for views which have missing index.html files
*/
var layout = require('./layout');
var query = require('./query');

module['exports'] = function autoindex (view, options, cb) {
  if (typeof view !== "object" || typeof view.views !== "object") {
    // TODO: should 404 error
    // Remark: Based on current testing the following line may not ever be reached
    return '404 - file not found -  cannot create autoindex';
  }
  var self = this;
  var resp = Object.keys(view.views);
  resp = resp.sort();
  resp = resp.filter(function(item){
    // special case if the View has it's presenter exports.disabled set to true
    // this will cause the page to not show in the autoindex
    if ( // this case covers folders with index.js files
        (view.views[item].index && typeof view.views[item].index.presenter === "function" && view.views[item].index.presenter.disabled === true)
        ||
        // this case will cover normal views ( not folders of views )
        (typeof view.views[item].presenter === "function" && view.views[item].presenter.disabled === true)
       ) {
      return false;
    }
    if (item !== "layout") {
      return true;
    }
    return false;
  });

  var types = [];
  var req = options.request,
      res = options.response;

  if (req.headers && req.headers.accept) {
    types = req.headers.accept.split(',');
  }

  if (types.indexOf('text/html') === -1) {
    resp = resp.map(function(item){
      return "/" + item;
    });
    return res.end(JSON.stringify(resp, true, 2));
  }

  var html = '<div class="container page" role="main">';
  resp.forEach(function(v){
    html += '<a href="' + view.views[v].breadcrumb() + '">' + v + '</a><br/>';
  });
  html += '</div>';
  view.template = html;
  layout.call(view, view, options, function (err, result) {
    if (err) {
      throw err;
    }
    var $ = query(result);
    if ($('.yield').length === 0) {
      cb(null, html);
    } else {
      $('.yield').html(html);
      cb(null, $.html());
    }
  });
}