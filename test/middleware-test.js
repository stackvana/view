var test = require("tap").test,
  resource = require("resource"),
  supertest = require('supertest'),
  http,
  view,
  server;

test("start a view server", function(t) {
  view = require('../'),
  http = require('resource-http');
  http.listen({ port: 8888 }, function(err, _server) {
    t.error(err, 'no error');
    t.ok(_server, 'server is returned');
    server = _server;
    t.end();
  });
});


test("load a view/layout with http and view.middle", function(t) {
  view.create({ path: __dirname + "/view-url-params" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');

    server.use(view.middle({view: _view}));

    supertest(server)
      .get('/123')
      .end(function(err, res, body){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.body.id, '123');
        t.equal(res.body.view, 'index');
        t.end();
    });
  });
});

test("load a view/layout with http and view.middle", function(t) {
  view.create({ path: __dirname + "/view-url-params" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');

    server.use(view.middle({view: _view}));

    supertest(server)
      .get('/user/0')
      .end(function(err, res){
        if (err) throw err;
        console.log('bbb', res.body)
        t.error(err, 'no error');
        t.equal(res.body.id, '0');
        t.equal(res.body.view, 'user');
        t.end();
    });
  });
});



/* TODO: nested url params / regex routing
test("load a view/layout with http and view.middle", function(t) {
  view.create({ path: __dirname + "/view-url-params" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');

    server.use(view.middle({view: _view}));

    supertest(server)
      .get('/user/0/report/1')
      .end(function(err, res, body){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.body.id, '1');
        t.equal(res.body.view, 'report');
        t.end();
    });
  });
});
*/
//return;

test("stop a view server", function(t) {
  server.server.close(function(err) {
    t.ok(!err, 'no error');
    t.end();
  });
});

test("start a view server", function(t) {
  view = require('../'),
  http = require('resource-http');
  http.listen({ port: 8888 }, function(err, _server) {
    t.error(err, 'no error');
    t.ok(_server, 'server is returned');
    server = _server;
    t.end();
  });
});


test("load a view/layout with http and view.middle", function(t) {
  view.create({ path: __dirname + "/view17" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    server.use(view.middle({view: _view}));
    supertest(server)
      .get('/root')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text, '<h1>big</h1>\n<div class="yield">\n<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
          'response returns correct result');
        t.end();
    });
  });
});

test("stop a view server", function(t) {
  server.server.close(function(err) {
    t.ok(!err, 'no error');
    t.end();
  });
});

test("start a view server", function(t) {
  view = require('../'),
  http = require('resource-http');
  http.listen({ port: 8888 }, function(err, _server) {
    t.error(err, 'no error');
    t.ok(_server, 'server is returned');
    server = _server;
    t.end();
  });
});

test("load nested view/layout with http and view.middle", function(t) {
  view.create( { path: __dirname + "/view18" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    server.use(view.middle({view: _view}));
    supertest(server) // first test index
      .get('/index')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text,
          '<h1>big</h1>\n<h2>nothing</h2>\n<div class="yield">\n<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
          'response returns correct result');
    });

    supertest(server) // then test test/table
      .get('/test/table')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text,
          '<h1>nothing</h1>\n<h2>big</h2>\n<div class="yield">\n<div class="table">steve</div>\n</div>',
          'response returns correct result');
        t.end();
    });
  });
});

test("stop a view server", function(t) {
  server.server.close(function(err) {
    t.ok(!err, 'no error');
    t.end();
  });
});

test("start a view server", function(t) {
  view = require('../'),
  http = require('resource-http');
  http.listen({ port: 8888 }, function(err, _server) {
    t.error(err, 'no error');
    t.ok(_server, 'server is returned');
    server = _server;
    t.end();
  });
});

test("load nested views/layouts with http and view.middle", function(t) {
  view.create( { path: __dirname + "/view19" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    server.use(view.middle({view: _view}));

    supertest(server) // first test index2
      .get('/index2')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text,
          '<h1>big</h1>\n<h2>nothing</h2>\n<div class="yield">\n<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
          'response returns correct result');
    });

    supertest(server) // then test table2
      .get('/table2')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text,
          '<h1>big</h1>\n<h2>nothing</h2>\n<div class="yield">\n<div class="table">steve</div>\n</div>',
          'response returns correct result');
    });

    supertest(server) // then test test2/index
      .get('/test2')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text,
          '<h1>nothing</h1>\n<h2>big</h2>\n<div class="yield">\n<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
          'response returns correct result');
    });

    /*
    supertest(server) // then test test2/index
      .get('/test2/index')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text,
          '<h1>nothing</h1>\n<h2>big</h2>\n<div class="yield">\n<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
          'response returns correct result');
    });
    */

    supertest(server) // then test test2/table
      .get('/test2/table')
      .end(function(err, res){
        if (err) throw err;
        t.error(err, 'no error');
        t.equal(res.text,
          '<h1>nothing</h1>\n<h2>big</h2>\n<div class="yield">\n<div class="table">steve</div>\n</div>',
          'response returns correct result');
        t.end();
    });
  });
});

test("stop a view server", function(t) {
  server.server.close(function(err) {
    t.ok(!err, 'no error');
    t.end();
  });
});
