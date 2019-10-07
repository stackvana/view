#!/usr/bin/env node
let view = require('../');
let path = require('path');
let fs = require('fs');

// load view from local ./view directory
view.create( { path: "./view" } , function(err, _view) {
  // dump entire object
  // console.log(err, _view);
  dumpViews(_view);
  // list of all loaded files
});

let root = process.cwd() + '/public';

// enumerates every from the root down to each node,
// then creates a static file representing the default data presentation of that view
function dumpViews (v) {
  if (v.views && Object.keys(v.views)) {
    for (var subview in v.views) {
      // take path and make sure directory exists
      let writePath = path.normalize(root + '/' + v.views[subview].path.replace('./view', ''));
      let sourcePath = path.normalize(v.views[subview].path);
      try {
        fs.mkdirSync(path.dirname(writePath), { recursive: true });
      } catch (err) {
      }
      let stat = fs.lstatSync(sourcePath);
      if (stat.isFile()) {
        // TOOD: what if we want to pass data into the presenter?
        function presentView (data) {
          v.views[subview].present(data, function (err, html){
            if (err) {
              throw err;
            }
            let writePath;
            if (data.path) {
              writePath = path.normalize(root + '/' + v.views[subview].path.replace('./view', ''));
              writePath = writePath.replace('index.js', '');
              writePath += data.path + '.html';
              console.log("SPECIAL", data.path, writePath)
              // if we are rendering a .js based view, it's the presenter for html
            } else {
              writePath = path.normalize(root + '/' + v.views[subview].path.replace('./view', ''));
              // if we are rendering a .js based view, it's the presenter for html
            }
            writePath = writePath.replace('.js', '.html');
            console.log('writePathwritePathwritePath', writePath)
            //let contents = fs.readFileSync(sourcePath);
            fs.writeFileSync(writePath, html);
          });
        }

        presentView({});

        if (v.views[subview].presenter && v.views[subview].presenter.dataset) {
          // console.log('v.views[subview].presenter', v.views[subview].presenter.dataset)
          // empty / default data
          // use data found in module.exports.dataset
          let arr = Object.keys(v.views[subview].presenter.dataset);
          arr.forEach(function(page){
            // console.log('presenting page', page)
            presentView({
              path: page
            })
          });
        }
        
      } else {
        console.log(writePath)
      }
      // console.log(v.views[subview].key);
      dumpViews(v.views[subview])
    }
  }
}