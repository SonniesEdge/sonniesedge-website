const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const rename = require('metalsmith-rename');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const picsetGenerate = require('metalsmith-picset-generate');

Metalsmith(__dirname)
    .source('./content')
    .destination('./dist')
    .use(rename([
        [/\_index.md$/, "index.md"]
    ]))
    .use(collections({
        posts: {
          pattern: ['posts/*.md', '!posts/index.md'],
          sortBy: 'date',
          reverse: true
        },
        utility: {
            pattern: ['*.md']
        }
    }))
    .use(markdown({
        smartypants: true,
        gfm: true,
        tables: true
    })) 
    .use(permalinks({
        linksets: [
            {
                match: { collection: 'posts' },
                pattern: 'posts/:title'
            }
        ],
        relative: false
      }))
    .use(picsetGenerate({
        path: 'images'
    }))
    .use(layouts({
        engine: 'nunjucks',
        default: 'default.njk',
        pattern: '**/*.html'
    }))
    .build(function (error) {
        if (error) {
            throw error;
        }
    });