module.exports = function urlParamsPresenter (opts, cb) {
  var res = opts.res,
      req = opts.req;
  res.json({
    id: req.resource.params.id,
    view: 'index'
  });
};