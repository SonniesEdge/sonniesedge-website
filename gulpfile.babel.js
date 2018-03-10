import gulp from "gulp";
import {exec} from "child_process";
// import hugoBin from "hugo-bin";
// import gutil from "gulp-util";
// import postcss from "gulp-postcss";
// import cssImport from "postcss-import";
// import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
// import webpack from "webpack";
// import webpackConfig from "./webpack.conf";
import sass from "gulp-sass";

// const browserSync = BrowserSync.create();
const sassOpts = {
  outputStyle: 'compressed',
  includePaths: ['./node_modules/loom/assets'],
  errLogToConsole: true };

// // Hugo arguments
// const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
// const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// // Development tasks
// gulp.task("hugo", (cb) => buildSite(cb, []));
// gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// // Build/production tasks
// gulp.task("build", ["sass", "js"], (cb) => buildSite(cb, [], "production"));
// gulp.task("build-preview", ["sass", "js"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

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

// // Development server with browsersync
// gulp.task("server", ["hugo", "sass", "js"], () => {
//   browserSync.init({
//     server: {
//       baseDir: "./dist"
//     }
//   });
//   gulp.watch("./src/js/**/*.js", ["js"]);
//   gulp.watch("./src/sass/**/*.scss", ["sass"]);
//   gulp.watch("./site/**/*", ["hugo"]);
// });

// Build markdown files into HTML via Metalsmith
gulp.task('metalsmith', function (cb) {
    console.log("Metalsmith run");
    exec('node build.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Build Sass files into CSS
gulp.task('sass', () => { 
    console.log('Sass run');
    return gulp.src('./assets/sass/**/*.scss')
        .pipe(sass(sassOpts))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(BrowserSync.stream());
});

// Serve files via Browser sync
gulp.task('browser-sync', () => {
    return BrowserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task('watch', () => {
    gulp.watch("./assets/sass/**/*.scss", gulp.series('sass'));
    gulp.watch('./dist/**/*.html', gulp.series(BrowserSync.reload)); 
    gulp.watch('./dist/js/**/*.md', gulp.series("metalsmith"));
});

gulp.task('default', gulp.series('metalsmith', 'sass', gulp.parallel('watch', 'browser-sync')));
gulp.task('build', gulp.series('metalsmith', 'sass'));