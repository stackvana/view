module.exports = function (opts, cb) {
  opts.res.end('before applied');
}

module.exports.useLayout = false;