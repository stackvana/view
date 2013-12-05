
module['exports'] = function (options, callback) {

  var $ = this.$;

	$('.table').html('steve');

		callback(null, $.html());
};

