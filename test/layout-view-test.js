var test = require("tap").test,
    view = require('../');

test("should be able to perform single level layout", function (t) {
  view.create( { path: __dirname + "/single-layout" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="outer"><div class="yield"><h1>Top level</h1></div></div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("should be able to perform nested layout", function (t) {
  view.create( { path: __dirname + "/nested-layouts" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.subview.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="outer"><div class="yield"><div class="inner"><div class="yield"><h2>Sub level</h2></div></div></div></div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("nested layouts should use all layout presenters", function (t) {
  view.create( { path: __dirname + "/nested-layouts-presenters" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.subview.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="outer"><span class="foo">bar</span><div class="yield"><div class="inner"><span class="hello">there</span><div class="yield"><h2>Sub level</h2></div></div></div></div>',
        'present() returns correct result');
      t.end();
    });
  });
});

return;
//return;
test("presenters should have access to view object", function (t) {
  view.create( { path: __dirname + "/view6" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      console.log(result)
      t.equal(result,
        '<div class="layout-name">layout</div>\n<div class="layout-template">%3Cdiv%20class%3D%22layout-name%22%3Ename%3C/div%3E%0A%3Cdiv%20class%3D%22layout-template%22%3Etemplate%3C/div%3E%0A%3Cdiv%20class%3D%22layout-presenter%22%3Epresenter%3C/div%3E%0A%3Cdiv%20class%3D%22layout-parent%22%3Eparent%3C/div%3E%0A%3Cdiv%20class%3D%22yield%22%3E%3C/div%3E</div>\n<div class="layout-presenter">function%20%28options%2C%20callback%29%20%7B%0A%0A%20%20var%20%24%20%3D%20this.%24%3B%0A%0A%20%20%24%28%27.layout-name%27%29.html%28this.name%29%3B%0A%20%20%24%28%27.layout-template%27%29.html%28escape%28this.template%29%29%3B%0A%20%20%24%28%27.layout-presenter%27%29.html%28escape%28this.presenter%29%29%3B%0A%20%20%24%28%27.layout-parent%27%29.html%28this.parent.name%29%3B%0A%0A%20%20callback%28null%2C%20%24.html%28%29%29%3B%0A%7D</div>\n<div class="layout-parent"></div>\n<div class="yield"><div class="name">index</div>\n<div class="template">%3Cdiv%20class%3D%22name%22%3Ename%3C/div%3E%0A%3Cdiv%20class%3D%22template%22%3Etemplate%3C/div%3E%0A%3Cdiv%20class%3D%22presenter%22%3Epresenter%3C/div%3E%0A%3Cdiv%20class%3D%22parent%22%3Eparent%3C/div%3E</div>\n<div class="presenter">function%20%28options%2C%20callback%29%20%7B%0A%0A%20%20var%20%24%20%3D%20this.%24%3B%0A%0A%20%20%24%28%27.name%27%29.html%28this.name%29%3B%0A%20%20%24%28%27.presenter%27%29.html%28escape%28this.presenter%29%29%3B%0A%20%20%24%28%27.parent%27%29.html%28this.parent.name%29%3B%0A%20%20%24%28%22.template%22%29.html%28escape%28this.template%29%29%3B%0A%0A%20%20callback%28null%2C%20%24.html%28%29%29%3B%0A%7D</div>\n<div class="parent"></div></div>',
        'present() returns correct result');
      t.end();
    });
  });
});

return;

test("start view from given path containing single template and presenter with layout template", function (t) {
  view.create( { path: __dirname + "/view3" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>nothing</h1>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

// TODO: is this test valid?
test("start view from given path containing single template and presenter with layout presenter", function (t) {
  view.create( { path: __dirname + "/view4" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,'<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n');
      t.end();
    });
  });
});

return;

test("start from view given path containing single template and presenter with layout template and presenter", function (t) {
  view.create( { path: __dirname + "/view5" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("layout presenter should run before template presenter", function (t) {
  view.create( { path: __dirname + "/view7" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});
return;

test("layout presenter should modify a template before the template presenter is called", function (t) {
  view.create( { path: __dirname + "/view8" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div></div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("layout presenter should be able to modify template presenter", function (t) {
  view.create( { path: __dirname + "/view9" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result, 'hi', 'present() returns correct result');
      t.end();
    });
  });
});

test("template presenter should be able to modify layout html", function (t) {
  view.create( { path: __dirname + "/view10" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("multiple views with a layout and presenter", function (t) {
  view.create( { path: __dirname + "/view11" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>\n',
        'present() returns correct result');
    });
    _view.table.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div class="yield"><div class="table">steve</div>\n</div>\n',
        'present() returns correct result');
      t.end();
    });
  });
});

test("layout presenter and template presenter both see passed options", function (t) {
  view.create( { path: __dirname + "/view12" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({
      name: "Bob",
      email: "bob@bob.com",
      company: "big"
    }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("multiple views with a layout and presenter, as well as options", function (t) {
  view.create( { path: __dirname + "/view13" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({
      name: "Bob",
      email: "bob@bob.com",
      company: "big"
    }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
    });
    _view.table.present({
      table: "steve",
      company: "company"
    }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>company</h1>\n<div class="yield"><div class="table">steve</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("nested views, no layouts", function(t) {
  view.create( { path: __dirname + "/view15" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n',
        'present() returns correct result');
    });
    _view.test.table.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="table">steve</div>\n',
        'present() returns correct result');
      t.end();
    });
  });
});

test("nested views, nested layouts affect only appropriate directory level", function(t) {
  view.create( { path: __dirname + "/view16" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>big</h1>\n<h2>nothing</h2>\n<div class="yield"><div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n</div>',
        'present() returns correct result');
    });
    _view.test.table.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<h1>nothing</h1>\n<h2>big</h2>\n<div class="yield"><div class="table">steve</div>\n</div>',
        'present() returns correct result');
      t.end();
    });
  });
});

test("start a view with a layout, but set useLayout to false", function (t) {
  view.create( { path: __dirname + "/view10" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({ useLayout: false }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result,
        '<div class="user">\n\t<div class="name">Bob</div>\n\t<div class="email">bob@bob.com</div>\n</div>\n',
        'present() returns correct result');
      t.end();
    });
  });
});