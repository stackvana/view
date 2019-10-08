module['exports'] = function (options, callback) {

  var $ = this.$;

  this.parent.index.template = '<div class="user"><div class="name">name</div><div class="email">email</div>\n</div>';

  callback(null, $.html());
};
