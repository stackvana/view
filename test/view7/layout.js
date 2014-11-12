
module['exports'] = function (options, callback) {

  var $ = this.$;

  $('h1').html('big');
  $('.yield').html('big');

  callback(null, $.html());
};
