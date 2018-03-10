const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const rename = require('metalsmith-rename');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');

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
            pattern: ['*.md', '!index.md']
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
            },
            {
                match: { collection: 'utility' },
                pattern: ':slug'
            }
        ]
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