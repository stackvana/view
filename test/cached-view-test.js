/*

  to set a view to be cached, you must set:
  
    module['exports'].cache = 6000;
  
  where 6000 is the ttl in milliseconds
  see: ./test/view20

*/ 

var test = require("tap").test,
    view = require('../'),
    first,
    second,
    v;

test("start a view with a layout and presenter that has a cache", function (t) {
  view.create( { path: __dirname + "/view20" } , function (err, _view) {
    v = _view;
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    first = new Date();
    _view.index.present({ time: first, useLayout: false }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n\t<div class="time">' + first + '</div>\n</div>\n',
        'present() returns correct result');
      setTimeout(function(){
        t.end();
      }, 500)
    });
  });
});

test("run the same view and expected a cached result", function (t) {
  var now = new Date();
  v.index.present({ time: now, useLayout: false }, function (err, result) {
    t.error(err, 'no error');
    t.ok(result, 'present returns result');
    t.equal(result,
      '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n\t<div class="time">' + first + '</div>\n</div>\n',
      'present() returns correct result');
      setTimeout(function(){
        t.end();
      }, 1505)
  });
});

test("run the same view some time after the cache has expired and get the new result again", function (t) {
  var now = new Date();
  second = now;
  v.index.present({ time: now, useLayout: false }, function (err, result) {
    t.error(err, 'no error');
    t.ok(result, 'present returns result');
    t.equal(result,
    '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n\t<div class="time">' + now + '</div>\n</div>\n',
    'present() returns correct result');
    setTimeout(function(){
      t.end();
    }, 50)
  });
});

test("run the same view and expected the new cached result", function (t) {
  var now = new Date();
  v.index.present({ time: now, useLayout: false }, function (err, result) {
    t.error(err, 'no error');
    t.ok(result, 'present returns result');
    t.equal(result,
      '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n\t<div class="time">' + second + '</div>\n</div>\n',
      'present() returns correct result');
      t.end();
  });
});