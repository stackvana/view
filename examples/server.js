  let view = require('../'),
  http = require('resource-http');
  http.listen({ port: 8888 }, function(err, _server) {
    view.create( { path: __dirname + "/../test/view4" } , function(err, _view) {
      _server.use(view.middle({view: _view}));
    });
  });

