module['exports'] = function (options, callback) {
  var $ = this.$;
  $('h1').html('parent h1');
  callback(null, $.html());
};
