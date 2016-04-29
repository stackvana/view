module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.foo').html('bar');
  callback(null, $.html());
};