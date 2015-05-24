// loads a view from a remote http source
// the source of the view is irrelvenant, it should be any HTTP complaiant webserver

// Remark: hyperquest and through are required for remote views
var request = require('hyperquest');
var through = require('through2');

module['exports'] = function remoteView (remotePath, callback) {

  var self = this;

  var p = self._remote + remotePath;
  var remoteTemplate = request(p);
  console.log('fetching', p)
  
  p = p.replace('.html', '.js');
  var remotePresenter = request(p);
  console.log('fetching', p)

  var rL = self._remote + 'layout.html';
  var rP = self._remote + 'layout.js';
  console.log('fetching', rL)

  var remoteLayout = request(rL);

  self[remotePath] = {
    template: remoteTemplate,
    presenter: remotePresenter,
    layout: remoteLayout
  };

  var remotePresenterOutput = '';
  var remoteLayoutTemplateOutput = '';
  var remoteTemplateOutput = '';

  remoteLayout.pipe(through(function(chunk, enc, cb){
    remoteLayoutTemplateOutput += chunk;
    cb(null);
  }));

  remoteLayout.on('end', function(){
    finishLayoutLoad();
  });

  function finishLayoutLoad () {
    console.log('finishLayoutLoad');

    remoteTemplate.pipe(through(function(chunk, enc, cb){
      remoteTemplateOutput += chunk;
      cb(null);
    }));

    remoteTemplate.on('end', function(err, res){
      console.log('end remoteTemplate');
      finishTemplateLoad();
    });

    /* TODO: implement remote presenters
    remotePresenter.pipe(through(function(chunk, enc, cb){
      remotePresenterOutput += chunk;
      cb(null, remotePresenterOutput);
    }, finishPresenterLoad));
    */
  }

  function finishPresenterLoad () {
    //    console.log('finishPresenterLoad', remotePresenter);
  }

  function finishTemplateLoad () {
    // console.log('finishTemplateLoad')
    // TODO: this is hard-coded to the Github response,
    // it should be using the HTTP status code 404 instead....
    if (remoteLayoutTemplateOutput === "Not Found") {
      // don't use the layout
      console.log('using no layout', remoteTemplateOutput)
      callback(null, remoteTemplateOutput);
    } else {
      var query = require('../lib/query');
      var $;
      $ = query(remoteLayoutTemplateOutput.toString());
      $('.yield').html(remoteTemplateOutput);
      callback(null, $.html());
    }
  }

};