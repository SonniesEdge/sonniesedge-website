import gulp from "gulp";
import {exec} from "child_process";
import BrowserSync from "browser-sync";
import sass from "gulp-sass";
import responsive from 'gulp-responsive';
import metalsmith from 'gulp-metalsmith';

import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdown';
import rename from 'metalsmith-rename';
import collections from 'metalsmith-collections';
import permalinks from 'metalsmith-permalinks';
import metalsmithPrism from 'metalsmith-prism';

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
            collections({ // why u no work?
                posts: {
                  pattern: [
                      'content/posts/*.md', 
                      '!content/posts/index.md'
                    ],
                  sortBy: 'date',
                  reverse: true
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
            permalinks({
                linksets: [
                    {
                        match: { collection: 'posts' },
                        pattern: '/posts/:title'
                    }
                ],
                relative: false
              }),
            layouts({
                engine: 'nunjucks',
                default: 'default.njk',
                pattern: '**/*.html'
            }),
            metalsmithPrism({
                lineNumbers: true
            })
        ],
        metadata: {
          site_title: 'Sample static site'
        }
      }))
      .pipe(gulp.dest('./dist'))
      .pipe(BrowserSync.stream());
});


gulp.task('images', function () {
    return gulp.src(['./static/images/**/*.{png,jpg}'])
      .pipe(responsive(
        {
            '**/*.jpg': { 
                width: 200 
            },
            '**/*.png': { 
                width: '50%' 
            },
            '**/*': {
                rename: { suffix: '-thumbnail' },
            },
        }, 
        {
            quality: 70,
            progressive: true,
            compressionLevel: 6,
            withMetadata: false,
        }))
      .pipe(gulp.dest('dist/images'));
  });

// const browserSync = BrowserSync.create();
const sassOpts = {
    outputStyle: 'compressed',
    includePaths: ['./node_modules/loom/assets'],
    errLogToConsole: true };

// Build Sass files into CSS
gulp.task('sass', () => { 
    return gulp.src('./assets/sass/*.scss')
        .pipe(sass(sassOpts))
        .pipe(gulp.dest('./content/css/'))
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
    gulp.watch('./content/posts/**/*', gulp.series("smithy"));
    gulp.watch('./layouts/**/*', gulp.series("smithy"));
});

gulp.task('default', gulp.series( 'sass', 'smithy', gulp.parallel('watch', 'browser-sync')));
gulp.task('build', gulp.series('sass', 'smithy'));