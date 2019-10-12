var test = require("tap").test,
    view = require('../');

test("start a view with top-level _after hook", function (t) {
  view.create( { path: __dirname + "/after-hooks" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({}, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result, '<div class="yield"><span class="before"></span><span class="after">after</span></div>', 'present() returns correct result');
      t.end();
    });
  });
});

test("start a view with top-level _before hook", function (t) {
  view.create( { path: __dirname + "/before-hooks" } , function(err, _view) {
    t.error(err, 'no error');
    t.ok(_view, 'view is returned');
    _view.index.present({
      res: {
        end: function(result){
          t.ok(result, 'present returns result');
          t.equal(result, 'before applied', 'present() returns correct result');
          t.end();
        }
      }
    }, function (err, result) {
      t.error(err, 'no error');
      t.ok(result, 'present returns result');
      t.equal(result, 'before', 'present() returns correct result');
      t.end();
    });
  });
});

