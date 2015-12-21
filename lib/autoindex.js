/*
  autoindex.js - creates a directory autolisting for views which have missing index.html files
*/

module['exports'] = function autoindex (view /*, cb */) {
  var resp = Object.keys(view.views);
  var html = "";
  for (var v in view.views) {
    console.log(view.views[v].breadcrumb(), 'breadcrumb')
    html += '<a href="' + view.views[v].breadcrumb() + '">' + v + '</a><br/>';
  }
  return html;
}