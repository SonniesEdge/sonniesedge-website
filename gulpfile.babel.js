import gulp from "gulp";
import BrowserSync from "browser-sync";
import sass from "gulp-sass";
import responsive from 'gulp-responsive';
import metalsmith from 'gulp-metalsmith';
import dropbox from './gulp-getdropboxfolder';
import getpinboard from './gulp-getpinboard';

import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdown';
import rename from 'metalsmith-rename';
import collections from 'metalsmith-collections';
import permalinks from 'metalsmith-permalinks';
import metalsmithPrism from 'metalsmith-prism';
import defaultvals from 'metalsmith-default-values';
import dateFormatter from 'metalsmith-date-formatter';
import metalsmithFeed from 'metalsmith-feed';
import metalsmithExcerpts from 'metalsmith-excerpts';
import metalsmithDrafts from 'metalsmith-drafts';
import metalsmithWebmentions from './metalsmith-webmentions';
import metalsmithDateInFilename from './metalsmith-date-from-filename';
import metalsmithContentAsField from './metalsmith-contentasfield';
import metalsmithDateAsTitle from './metalsmith-dateastitle';
import metalsmithPagination from 'metalsmith-pagination';

gulp.task('dropboxText', function (done) {
    dropbox({
        dropboxfolder: '/_blog/text',
        localDestination: './content'
    }, done);
});

gulp.task('dropboxImages', function (done) {
    dropbox({
        dropboxfolder: '/_blog/images',
        localDestination: './images'
    }, done);
});

gulp.task('getPinboard', function (done) {
    getpinboard({path: '/_blog/text/bookmarks'},  done);
});

gulp.task('getPinboardAll', function (done) {
    getpinboard({path: '/_blog/text/bookmarks'},  done, true);
});

gulp.task('smithy', function () {
    return gulp.src('./content/**')
    .pipe(metalsmith({
        root: __dirname,
        frontmatter: true,
        clean: true,
        use: [
            rename([
                [/\_index.md$/, "index.md"]
            ]),
            metalsmithDateInFilename(),
            metalsmithDrafts(),
            metalsmithContentAsField({
                fieldName: 'dave'
            }),
            defaultvals([
                {
                    pattern: ['**/posts/*.md', '!**/posts/index.md'],
                    defaults: {
                        layout: 'page/post.njk'
                    }
                },
                {
                    pattern: ['**/talks/*.md', '!**/talks/index.md'],
                    defaults: {
                        layout: 'page/talk.njk'
                    }
                },
                {
                    pattern: ['**/bookmarks/*.md', '!**/bookmarks/index.md'],
                    defaults: {
                        layout: 'page/bookmark.njk'
                    }
                },
                {
                    pattern: ['**/notes/*.md', '!**/notes/index.md'],
                    defaults: {
                        layout: 'page/note.njk'
                    }
                }
            ]),
            collections({
                posts: {
                  pattern: [
                      '**/posts/*.md', 
                      '!**/posts/index.md'
                    ],
                  sortBy: 'date',
                  reverse: true
                },
                bookmarks: {
                    pattern: [
                        '**/bookmarks/*.md',
                        '!**/bookmarks/index.md'
                      ],
                    sortBy: 'date',
                    reverse: true
                },
                talks: {
                    pattern: [
                        '**/talks/*.md', 
                        '!**/talks/index.md'
                      ],
                    sortBy: 'date',
                    reverse: true
                },
                notes: {
                    pattern: [
                        '**/notes/*.md', 
                        '!**/notes/index.md'
                      ],
                    sortBy: 'date',
                    reverse: true,
                    metadata: {
                        name: 'Notes'
                    }
                },
                mainnav: {
                    sortBy: 'weight'
                }
            }),
            markdown({
                smartypants: true,
                gfm: true,
                tables: true,
                langPrefix: 'language-'
            }),
            metalsmithExcerpts(),
            metalsmithContentAsField({
                name: 'contents_original'
            }),
            metalsmithPagination({
                'collections.bookmarks': {
                    perPage: 25,
                    layout: 'page/bookmarks_pagination.njk',
                    path: 'test/:num/index.html'
                }
            }),
            permalinks({
                linksets: [
                    {
                        match: { collection: 'posts' },
                        pattern: '/posts/:slug'
                    },
                    {
                        match: { collection: 'talks' },
                        pattern: '/talks/:slug'
                    },
                    {
                        match: { collection: 'bookmarks' },
                        pattern: '/bookmarks/:slug'
                    }
                ],
                relative: false
              }),
            dateFormatter({
              dates: [
                {
                  key: 'date',
                  format: 'MMMM Do YYYY, HH:mm'
                }
              ]
            }),
            metalsmithDateAsTitle([
              {
                collection: 'notes'
              }
            ]),
            metalsmithPrism({
                lineNumbers: true
            }),
            metalsmithFeed({
                collection: 'posts',
                limit: false,
                preprocess: file => ({
                    title: file.title,
                    description: file.contents,
                    url: file.url
                })
            }),
            metalsmithFeed({
                collection: 'bookmarks',
                limit: false,
                destination: 'bookmarks.xml',
                preprocess: file => ({
                    title: file.title,
                    description: file.contents,
                    url: file.url
                })
            }),
            metalsmithFeed({
                collection: 'notes',
                limit: false,
                destination: 'notes.xml',
                preprocess: file => ({
                    title: file.title,
                    description: file.contents,
                    url: file.url
                })
            }),
            metalsmithWebmentions(),
            layouts({
                engine: 'nunjucks',
                directory: 'views',
                default: 'layout/default.njk',
                pattern: '**/*.html'
            })
        ],
        metadata: {
          site: {
            url: 'https://sonniesedge.co.uk',
            title: 'sonniesedge.co.uk',
            author: 'Charlie Owen | sonniesedge'
          } 
        }
      }))
      .pipe(gulp.dest('./dist'))
      .pipe(BrowserSync.stream());
});

gulp.task('movies', function () {
    return gulp.src(['./images/**/*.mp4'], { base: './' })
    .pipe(gulp.dest('./content'));
});

gulp.task('favicons', function () {
  return gulp.src(['./assets/favicons/*.*'])
  .pipe(gulp.dest('./content'));
});

gulp.task('images', function () {
    return gulp.src(['./images/**/*.{png,jpg,jpeg}'])
      .pipe(responsive(
        {
            'pages/**/*': [
                { 
                    width: 300
                }
            ],
            'posts/**/*': [
                { 
                    // width: 600,
                }
            ],
            'talks/**/*': [
                { 
                    width: 300
                },
                // { 
                //     width: 600,
                //     rename: { suffix: '-600px' }
                // }
            ]
        }, 
        {
            quality: 70,
            progressive: true,
            compressionLevel: 6,
            withMetadata: false,
        }))
      .pipe(gulp.dest('content/images'));
  });

// const browserSync = BrowserSync.create();
const sassOpts = {
    outputStyle: 'compressed',
    includePaths: ['./node_modules/loomcss/assets'],
    errLogToConsole: true };

// Build Sass files into CSS
gulp.task('sass', () => { 
    return gulp.src('./assets/sass/*.scss')
        .pipe(sass(sassOpts))
        .pipe(gulp.dest('./content/css/'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(BrowserSync.stream());
});

// Serve files via Browser sync
gulp.task('browser-sync', () => {
    return BrowserSync.init({
        server: {
            baseDir: "./dist/"
        },
        open: false
    });
});

gulp.task('watch', () => {
    gulp.watch("./assets/sass/**/*.scss", gulp.series('sass'));
    gulp.watch('./content/**/*', gulp.series("smithy"));
    gulp.watch('./layouts/**/*', gulp.series("smithy"));
});

gulp.task(
    'default', 
    gulp.series(
        'getPinboard',
        'dropboxText',
        'dropboxImages',
        gulp.series(
            'sass', 
            'images', 
            'movies', 
            'favicons',
            'smithy', 
            gulp.parallel('watch', 'browser-sync')
        )
    )
);
gulp.task(
    'build', 
    gulp.series(
        'getPinboard',
        'dropboxText',
        'dropboxImages',
        gulp.series(
            'sass', 
            'images', 
            'movies', 
            'favicons',
            'smithy'
            )
    )
);

gulp.task(
    'db',
    gulp.series(
        'dropboxText',
        'dropboxImages'
    )
);

gulp.task(
    'pinboard',
    gulp.series(
        'getPinboardAll',
    )
);
