var test = require("tap").test,
    view = require('../'),
    _view;

return;
var marak = 'https://raw.githubusercontent.com/Marak/marak.com/master/view';

// TODO: fix issues with relative paths with /faker.js versus /faker.js/ and relative paths

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

test("attempt to load /faker.js/", function (t) {
  _view.remote('/faker.js/', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '<!DOCTYPE html>\n<html lang="en">\n  <head>\n   ');
    t.end();
  });
});

test("attempt to load /faker.js", function (t) {
  _view.remote('/faker.js', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '<!DOCTYPE html>\n<html lang="en">\n  <head>\n   ');
    t.end();
  });
});

test("attempt to load /faker.js/js/prettyPrint.js", function (t) {
  _view.remote('/faker.js/js/prettyPrint.js', function (err, result) {
    t.error(err, 'no error');
    t.equal(result.substr(0, 45), '/*\n AUTHOR James Padolsey (http://james.padol');
    t.end();
  });
});

// TODO: tests for presenters and layout presenters