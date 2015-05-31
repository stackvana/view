var test = require("tap").test,
    view = require('../'),
    _view;

var marak = 'https://raw.githubusercontent.com/Marak/marak.com/master/view';

test("create a remote view to github.com/marak/marak.com", function (t) {
  view.create( { remote: marak } , function (err, v) {
    t.error(err, 'no error');
    t.type(v, Object);
    _view = v;
    t.end();
  });
});

test("create attempt to load index.html file", function (t) {
  _view.remote('/', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '<html>\n  <head>\n    <title>Marak.com</title>\n');
    t.end();
  });
});

test("create attempt to load index.html file", function (t) {
  _view.remote('/index.html', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '<html>\n  <head>\n    <title>Marak.com</title>\n');
    t.end();
  });
});

test("create attempt to load /blog/index.html", function (t) {
  _view.remote('/blog/index.html', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '<html>\n  <head>\n    <title>Marak.com - Blog</');
    t.end();
  });
});

test("create attempt to load /blog", function (t) {
  _view.remote('/blog/', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '<html>\n  <head>\n    <title>Marak.com - Blog</');
    t.end();
  });
});

test("create attempt to load /blog", function (t) {
  _view.remote('/blog', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '<html>\n  <head>\n    <title>Marak.com - Blog</');
    t.end();
  });
});

test("create attempt to load /css/styles.css", function (t) {
  _view.remote('/css/styles.css', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), 'body {\n  font-family: \"Arial, Helvetica, sans');
    t.end();
  });
});