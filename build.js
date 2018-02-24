var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    templates  = require('metalsmith-templates'),
    rename  = require('metalsmith-rename')
    default_values = require('metalsmith-default-values');

Metalsmith(__dirname)
    .source('./content')
    .use(
        rename([
            [/\_index.md$/, "index.html"]
        ])
    )
    .use(default_values([
    {
        pattern : 'posts/*.md',
        defaults: {
        layout: 'post.hbs'
        }
    },
    {
        pattern : '**/*.md',
        defaults: {
        layout : 'generic.hbs'
        }
    }
    ]))
    .use(markdown())
    .use(templates({
        engine: 'handlebars',
        partials: {
            header_generic: 'partials/header_generic',
            header_home: 'partials/header_home',
            footer: 'partials/footer',
            metadata: 'partials/metadata'
        }
    }))
    .destination('./dist')
    .build(function (err) { if(err) console.log(err) });