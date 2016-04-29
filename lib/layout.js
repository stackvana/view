var query = require('./query');

// recursively looks up the View tree to find the closest parent layout ( if it exists )
function findLayoutView (view) {

  if (typeof view === "undefined") {
    return null;
  }

  // if the current level of the view contains a layout, return that
  if (typeof view.layout !== "undefined" && typeof view.layout.presenter === "function") {
    return view.layout;
  }

  // if we didn't find a layout on the current view level and there is no parent view,
  // we have reached the root, return null ( no more layouts )
  if (typeof view.parent === "undefined") {
    return null;
  }

  // if we didn't find a layout on the current view level,
  // and there is a parent view, and it has a layout...
  // return that parent layout
  if (typeof view.parent.layout !== "undefined") {
    return view.parent.layout;
  }

  // there is a parent, but it doesn't contain a valid layout.
  // try finding a new layout up one level of the View tree
  return findLayoutView(view.parent);

};

// hierarchically layouts are supported
// first the layout will render at it's current level,
// then it will traverse up yielding to every parent layout it finds until home
// Note: To override parent layout lookup you can set layout.js exports.useParentLayout = false
module['exports'] = function (view, data, cb) {
  var $;
  var self = this;
  // will find nearest possible layout
  var layoutView = findLayoutView(view);
  if (layoutView !== null && typeof layoutView.present === "function") {
    if (cb) {
      return layoutView.present(data, function(err, content) {
        $ = query(content);
        $('.yield').append(view.template);
        // at this point, we've rendered at least the first level of the view
        // check to see if there are any parent layouts we need to apply
        // Note: To override parent layout lookup you can set layout.js exports.useParentLayout = false
        if (layoutView.key !== "/" && layoutView.presenter.useParentLayout !== false) {
          var parentLayoutView = findLayoutView(layoutView.parent.parent);
          if (parentLayoutView === null) {
            return cb(null, $.html());
          }
          return parentLayoutView.present(data, function(err, content) {
            var $$ = query(content);
            $$('.yield').append($.html());
            return cb(null, $$.html());
          });
        } else {
          return cb(null, $.html());
        }
      });
    } else {
      $ = query(layoutView.present(data));
      $('.yield').append(view.template);
    }
  } else {
    if (layoutView !== null && layoutView.layout.template !== "undefined") {
      $ = query(layoutView.template);
      $('.yield').append(view.template);
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