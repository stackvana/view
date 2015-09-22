module['exports'] = function (options, callback) {

  var $ = this.$;

  $('.user > .name').html('Bob');
  $('.user > .email').html('bob@bob.com');
  $('.time').html(options.time.toString());

  $('h1').html('big');

  callback(null, $.html());
};

module['exports'].cache = 1000;