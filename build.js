const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const rename = require('metalsmith-rename');

Metalsmith(__dirname)
    .source('./content')
    .destination('./dist')
    .use(rename([
        [/\_index.md$/, "index.md"]
    ]))
    .use(markdown())    
    .use(inPlace({
        engine: 'nunjucks',
        default: 'default.njk',
        pattern: '**/*.html'
    }))
    .build(function (error) {
        if (error) {
            throw error;
        }
    });