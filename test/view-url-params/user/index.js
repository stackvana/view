module.exports = function urlParamsPresenter (opts, cb) {
  var res = opts.res,
      req = opts.req;
  res.json({
    user_id: req.resource.params.user_id,
    view: 'user'
  });
};

module.exports.route = ":user_id";