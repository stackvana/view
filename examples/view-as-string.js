var View = require('../').View;

  var _template = '<div class="user">\n\t<div class="name">name</div>\n\t<div class="email">email</div>\n</div>\n';
  var _presenter;
  try {
    _presenter = require('./foo');
    
  } catch (err) {
    
  }
  var _view = new View({ template: _template, presenter: _presenter })
    _view.present({}, function (err, result) {
      console.log(err, result)
    });


