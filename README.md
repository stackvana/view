# view

A View-Presenter pattern for JavaScript.

## Installation

    npm install view

## What is this project?

The `view` module provides a simple [View-Presenter](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) pattern for creating views using a template and a single transformational JavaScript method.

The template is the "View", the single JavaScript method is the "Presenter".

This simple pattern allows for a very clean View which can easily be extended with any advanced features you might want.

It ships with templating support for HTML or Markdown, but can easily be extended with the templating engine of your choice. 

The project is well tested with easy to read test cases. It's been in development for several years and is used in many production applications such as [hook.io](https://hook.io)


## Features

### Hierarchy Views mapped directly to the file-system

The structure of the folder which contains the view maps directly to the constructed View object.

For example:

```
/view
  index.html
  /about
   index.html
   team.html
  contact.html
```

Will map to:

```js
// renders View-Presenter
myView.index.present(opts, cb); 
myView.about.index.present(opts, cb);
myView.about.team.present(opts, cb);
myView.contact.present(opts, cb);

// also can introspect templates as strings
myView.index.template;
myView.about.index.template;
myView.about.team.template;
```

### Isomorphic $ based Presenter Pattern

A Presenter is a single optional JavaScript method which can be associated with a View template.

Presenters are paired with a View by existing in the same directory and sharing the same name as the View template.

When `View.present()` is called, this Presenter method will execute on the context of the View template.

For example:

```
/view
  index.html
  index.js
  about/
   index.html
   team.html
   team.js
  contact.html
```

```js
module['exports'] = function examplePresenter(opts, callback) {
  // this.$ is a jQuery like selector with it's HTML context set to the current `View.template`
  var $ = this.$;

  // you can perform normal jQuery like modifications here
  $('h1').html('Hello');
  
  // once you are done transforming the template, continue with the newly modified html
  // notice this uses a callback? this means you can retrieve data from any remote source!
  // simply require the module you need in this Presenter and call out.

  callback(null, $.html());

}
```

Our unit tests will give a much better idea on how this works in practice.

### Layouts / Nested Layouts

A simple layout pattern is available for Views.

If a View has a `layout.html` or `layout.js` file present, that layout file will yield the results of the View-Presenter into the layout.

If no layout is found at the current level of the View-Presenter tree, the View will recurse upwards until a layout or the root is found.

For example: 

```
/view
  index.html
  layout.html
  layout.js
  /about
   index.html
   team.html
   team.js
  contact.html
```

layout.html

```html
<h1>Hello</h1>
<div class="yield">
</div>
```

```js
// Will yield the contents of the "index" View inside the ".yield" element
myView.index.present(opts, cb); 

// In the case of a nested view, the layout will still be applied
myView.about.team.present(opts, cb);
myView.about.index.present(opts, cb);
myView.contact.present(opts, cb);
```

Our unit tests will also give a better idea on how nested layouts will be applied.

## Built-in Node.js HTTP middleware

The `view` module ships with a built-in Node.js middleware. This middleware will map the View to incoming urls of your web application.

For example:

```
/view
  index.html
  about/
   index.html
   team.html
  contact.html
  hello.markdown
```

```js
 // for simplicity, assume server is an Express.js application
 server.use(view.middle({view: myView }));
```

Will now map to the following urls on your server: 

```
http://localhost/index
http://localhost/about
http://localhost/about/team
http://localhost/contact
http://localhost/hello
```


## Tests

    tap test/*.*
