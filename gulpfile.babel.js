import gulp from "gulp";
import {exec} from "child_process";
// import gutil from "gulp-util";
// import postcss from "gulp-postcss";
// import cssImport from "postcss-import";
// import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
// import webpack from "webpack";
// import webpackConfig from "./webpack.conf";
import sass from "gulp-sass";
import responsive from 'gulp-responsive';

// // Compile CSS with PostCSS
// // gulp.task("css", () => (
// //   gulp.src("./src/css/*.css")
// //     .pipe(postcss([cssImport({from: "./src/css/main.css"}), cssnext()]))
// //     .pipe(gulp.dest("./dist/css"))
// //     .pipe(browserSync.stream())
// // ));

// // Compile Javascript
// gulp.task("js", (cb) => {
//   const myConfig = Object.assign({}, webpackConfig);

//   webpack(myConfig, (err, stats) => {
//     if (err) throw new gutil.PluginError("webpack", err);
//     gutil.log("[webpack]", stats.toString({
//       colors: true,
//       progress: true
//     }));
//     browserSync.reload();
//     cb();
//   });
// });

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

// Build markdown files into HTML via Metalsmith
gulp.task('metalsmith', function (cb) {
    console.log("Metalsmith run");
    exec('node build.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    BrowserSync.reload();
});

// const browserSync = BrowserSync.create();
const sassOpts = {
    outputStyle: 'compressed',
    includePaths: ['./node_modules/loom/assets'],
    errLogToConsole: true };

// Build Sass files into CSS
gulp.task('sass', () => { 
    console.log('Sass run');
    return gulp.src('./assets/sass/main.scss')
        .pipe(sass(sassOpts))
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
    gulp.watch('./dist/**/*.html', gulp.series(BrowserSync.reload)); 
    gulp.watch('./layouts/*.njk', gulp.series("metalsmith", "sass"));
    gulp.watch('./content/**/*.md', gulp.series("metalsmith", "sass"));
});

gulp.task('default', gulp.series('metalsmith', 'sass', gulp.parallel('watch', 'browser-sync')));
gulp.task('build', gulp.series('metalsmith', 'sass'));