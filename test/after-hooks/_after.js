module.exports = function (opts, cb) {
  let $ = this.$.load(opts.html || '');
  $('.after').html('after');
  cb(null, $.html());
}