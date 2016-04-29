module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.hello').html('there');
  callback(null, $.html());
};