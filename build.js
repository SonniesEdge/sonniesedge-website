var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    templates  = require('metalsmith-templates'),
    rename  = require('metalsmith-rename');

Metalsmith(__dirname)
    .source('./site/content')
    .use(
        rename([
          [/\_index.md$/, "index.html"]
        ])
      )
    .use(markdown())
    .use(templates('handlebars'))
    .destination('./dist')
    .build(function (err) { if(err) console.log(err) });