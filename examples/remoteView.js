var view = require('../');

var faker = 'https://raw.githubusercontent.com/Marak/marak.com/master/public/faker.js/';
var marak = 'https://raw.githubusercontent.com/Marak/marak.com/master/view/';
faker = 'https://raw.githubusercontent.com/Marak/faker.js/master/examples/browser/';

view.create( { remote: marak } , function (err, v) {
  if (err) throw err;
  v.remote('index.html', function (err, result) {
    console.log(err, result)
  });
});