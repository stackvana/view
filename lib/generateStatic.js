//
// Code responsible for generating a static site from View instance
// This part was written 10/14/2019 and is still very experimental / lacks test coverage compared to rest of library 
//

let path = require('path');
let fs = require('fs');

// You must set mode to any value besides debug in order to actually write files
let mode = 'debug';

// TODO: configurable options
let root = process.cwd() + '/public';
let ignoredPaths = [/* 'view/magic', 'view/movies', */'_after.js', '_before.js', 'layout.js', 'layout.html'];

// TODO: This method should accept a callback or promise, instead right now it will just run until all files,
//       have been generated locally ( which should work fine for binary script usage )
module['exports'] = function generateStatic (opts) {
  // enumerates every from the root down to each node,
  // then creates a static file representing the default data presentation of that view
  var v = this;
  if (v.views && Object.keys(v.views)) {
    for (var subview in v.views) {
      // take path and make sure directory exists
      let writePath = path.normalize(root + '/' + v.views[subview].path.replace('./view', ''));
      let sourcePath = path.normalize(v.views[subview].path);

      // do not process certain paths and files
      let ignore = false;
      ignoredPaths.forEach(function(p){
        if (sourcePath.search(p) !== -1) {
          ignore = true;
          console.log("IGNORING", p)
        }
      })
      // skip this excecution of loop if path is marked as ignored
      if (ignore) {
        continue;
      }
      if (mode === 'debug') {
        console.log('sourcePath', sourcePath);
      }
      try {
        fs.mkdirSync(path.dirname(writePath), { recursive: true });
      } catch (err) {
      }
      let stat = fs.lstatSync(sourcePath);
      if (stat.isFile()) {
        // TOOD: what if we want to pass data into the presenter?
        function presentView (data) {
        // console.log('v.views[subview].path', v.views[subview].path)

          // scope is required for async presenters!
          (function(subview){

            subview.present(data, function (err, html){
              // console.log('!!!! completed', subview.path, err)
              if (err) {
                console.log('ERROR', err)
                throw err;
                process.exit();
              }
              let writePath;
              if (data.path) {
                writePath = path.normalize(root + '/' + subview.path.replace('./view', ''));
                writePath = writePath.replace('index.js', '');
                writePath += data.path + '.html';
                // be sure to remove layout from path ( in case it's dataset generation )
                // if we are rendering a .js based view, it's the presenter for html
              } else {
                writePath = path.normalize(root + '/' + subview.path.replace('./view', ''));
              }
              writePath = writePath.replace('.js', '.html');
              writePath = writePath.replace('layout.html', '');
              if (mode === 'debug') {
                console.log('writePath', writePath)
              } else {
                fs.writeFileSync(writePath, html);
              }
            });
          
          })(v.views[subview])
        }

        presentView({
          req: {
            resource: {
              params: {}
            }
          }
        });

        if (v.views[subview].presenter && v.views[subview].presenter.dataset) {
          let dataset = v.views[subview].presenter.dataset;
          if (typeof dataset === 'object') {
            // console.log('v.views[subview].presenter', v.views[subview].presenter.dataset)
            // empty / default data
            // use data found in module.exports.dataset
            let arr = Object.keys(dataset);
            arr.forEach(function(page){
              // console.log('presenting page', page)
              presentView({
                path: page,
                req: {
                  resource: {
                    params: {}
                  }
                }
              })
            });
          }

          // TODO: dataset might be async function or event emitter ( for paginated results )
          if (typeof dataset === 'function') {
            dataset(function(err, results){
              let arr = Object.keys(results);
              arr.forEach(function(page){
                // console.log('presenting page', page)
                presentView({
                  path: page,
                  req: {
                    resource: {
                      params: results[page]
                    }
                  }
                })
              });
            });
          }
        }
      
      } else {
        if (mode === 'debug') {
          console.log('found dir', writePath)
        }
      }
      // console.log(v.views[subview].key);
      v.views[subview].generateStatic();
    }
  }
  
};

