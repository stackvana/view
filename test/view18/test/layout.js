module['exports'] = function (options, callback) {
  var $ = this.$;
  $('h2').html('child h2');
  callback(null, $.html());
};

module['exports'].useParentLayout = false;