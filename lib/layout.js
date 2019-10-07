var query = require('./query');

// recursively looks up the View tree to find the closest parent layout ( if it exists )
// todo: call all nested layouts to the top of the tree ( unless useLayout is set to false )
function findLayoutView (view) {

  // if there is no view provided, there is nothing to layout
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
module['exports'] = function _layout (view, data, cb) {
  // the current view template, always the same for layout
  var $ = query(view.template);
  data.view = view;

  function layoutTree (_view, html, next) {
    // the closest layout to current view
    var closestLayout = findLayoutView(_view);
    // terminating condition, we hit the root
    if (closestLayout !== null && typeof closestLayout.present === "function") {
      var $layout = query(closestLayout.template);
      // yield the view template into the layout
      if (closestLayout.key !== "/" && closestLayout.presenter.useParentLayout !== false) {
        // a layout was found, present that layout using incoming view data
        return closestLayout.present(data, function(err, content) {
          // take the result of the layout presentation and put into a next context
          var $presenter = query(content);
          // append the incoming html string ( could be either previous render or current view.template ) into the new context
          $presenter('.yield').append(html);
          // put the combined html into a new variable
          let currentRender = $presenter.html();
          // recurse the layout tree up one parent and pass in the currently rendered html
          layoutTree(closestLayout.parent.parent, currentRender, next);
        });
      } else {
        // if we found a layout, but are either at the root or have reached a layout which has useParentLayout=false,
        // this will stop layout traversing at the current level and continue forward with the render as-is
        return closestLayout.present(data, function(err, content) {
          var $presenter = query(content);
          // $layout('.yield').html(content)
          $presenter('.yield').append(html);
          let currentRender = $presenter.html();
          return next(null, currentRender);
        });
      }
    } else {
      // no layouts were found, terminating condition
      // continue forward with any rendered html
      return next(null, html);
    }
  }
  layoutTree(view, view.template, function(err, re){
    return cb(null, re);
  });

};