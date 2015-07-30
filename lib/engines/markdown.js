module['exports'] = function render (str) {
  var marked = require('marked');
  // TODO: expose parser options through schema
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });
  
  
  // Synchronous highlighting with highlight.js
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  });
  
  return marked(str);
  
};