module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.table').html('Bobby');
  callback(null, $.html());
};