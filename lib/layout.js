var query = require('./query');

function findParentLayoutView (view) {

  // recursively looks up the View tree to find the closest parent layout ( if it exists )

  if (typeof view.layout !== "undefined" && typeof view.layout.presenter === "function") {
    //return view.layout.present;
  }

  if (typeof view.parent === "undefined") {
    // we have reached the top of the View tree
    // this is the root and no layout can exist above it
    return null;
  }

  if (typeof view.parent.layout !== "undefined") {
    // a parent view exists, and it has a layout, use that layout
    // note: layouts are not currently nested. the closest layout ( local or parent ) will always take precedence
    return view.parent.layout;
  }

  // there is a parent, and it doesn't contain a valid layout.
  // try finding a new layout up one level of the View tree
  return findParentLayoutView(view.parent);

};

module['exports'] = function (view, data, cb) {
  var $;
  var self = this;
  var parentLayoutView = findParentLayoutView(view);
  //console.log(_presenterLayout.toString())
  if (parentLayoutView !== null && typeof parentLayoutView.present === "function") {
    if (cb) {
      return parentLayoutView.present(data, function(err, content) {
        $ = query(content);
        $('.yield').html(view.template);
        return cb(null, $.html());
      });
    } else {
      $ = query(parentLayoutView.present(data));
      $('.yield').html(view.template);
    }
  } else {
    if (parentLayoutView !== null && parentLayoutView.layout.template !== "undefined") {
      $ = query(parentLayoutView.template);
      $('.yield').html(view.template);
    } else {
      $ = query(view.template);
    }
    if (cb) {
      return cb(null, $.html());
    } else {
      return $.html();
    }
  }
};