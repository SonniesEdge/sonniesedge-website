import gulp from "gulp";
// import {spawn} from "child_process";
// import hugoBin from "hugo-bin";
// import gutil from "gulp-util";
// import postcss from "gulp-postcss";
// import cssImport from "postcss-import";
// import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
// import webpack from "webpack";
// import webpackConfig from "./webpack.conf";
// import sass from "gulp-sass";

// const browserSync = BrowserSync.create();
// const sassOpts = {
//   outputStyle: 'compressed',
//   includePaths: ['./node_modules/loomcss/assets'],
//   errLogToConsole: true };

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

// gulp.task('sass', () => {
//    gulp.src('./src/sass/**/*.scss')
//     .pipe(sass(sassOpts))
//     .pipe(gulp.dest('./dist/css'));
//  });



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
// });§

// Static server
gulp.task('browser-sync', () => {
  BrowserSync.init({
      server: {
          baseDir: "./dist/"
      }
  });
});
