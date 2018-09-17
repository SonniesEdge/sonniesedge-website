// DEPRACATED IN FAVOUR OF GULPFILE VERSION

const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const rename = require('metalsmith-rename');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const metalsmithPrism = require('metalsmith-prism');
const defaultvals = require('metalsmith-default-values');

Metalsmith(__dirname)
    .source('./content')
    .destination('./dist')
    .use(rename([
        [/\_index.md$/, "index.md"]
    ]))
    .use(defaultvals([
        {
            pattern: ['posts/*.md', '!posts/index.md'],
            defaults: {
                layout: 'post.njk'
            }
        }
    ]))
    .use(collections({
        posts: {
          pattern: ['posts/*.md', '!posts/index.md'],
          sortBy: 'date',
          reverse: true
        },
        mainnav: {
            sortBy: 'weight'
        }
    }))
    .use(markdown({
        smartypants: true,
        gfm: true,
        tables: true,
        langPrefix: 'language-'
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
    .use(layouts({
        engine: 'nunjucks',
        default: 'default.njk',
        pattern: '**/*.html'
    }))
    .use(metalsmithPrism({
        lineNumbers: true
    }))
    .build(function (error) {
        if (error) {
            throw error;
        }
    });