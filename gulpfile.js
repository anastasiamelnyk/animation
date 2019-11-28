const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require ('gulp-plumber');
const postCSS = require('gulp-postcss');
const autopref = require('autoprefixer');
const postcssNorm = require('postcss-normalize');
const maps = require('gulp-sourcemaps');
const minCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sync = require('browser-sync');
const babel = require('gulp-babel');
const jsMinBabel = require('gulp-babel-minify');
// const img = require('gulp-imagemin');
// const svgstore = require('gulp-svgstore');
// const pug = require('gulp-pug');
// const postHTML = require('gulp-posthtml');
// const include = require('posthtml-include');
const minHtml = require('gulp-htmlmin');
const clean = require('del');


//style task
gulp.task('style', () => {
  return gulp.src('src/style/style.scss')
  .pipe(plumber())
  .pipe(maps.init())
  .pipe(sass())
  .pipe(postCSS([
    autopref(),
    postcssNorm()
  ]))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('prod/style'))
  .pipe(minCSS())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('prod/style'))
  .pipe(sync.reload({stream:true}));
});

//js task
gulp.task('jsMin', () => {
  return gulp.src('src/js/script.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(gulp.dest('prod/js'))
  .pipe(jsMinBabel())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('prod/js'));
});


//image tasks
// gulp.task('minImg', () => {
//   return gulp.src('src/img/*.{png,jpg,svg}')
//   .pipe(img([
//     img.optipng({optimizationLevel: 3}),
//     img.jpegtran({progressive: true}),
//     img.svgo({
//         plugins: [
//             {removeViewBox: false}
//         ]
//     })
//     ]))
//   .pipe(gulp.dest('prod/img'));
// });

// gulp.task('svgSprite', () => {
//   return gulp.src(
//     ['src/img/fb.svg', 'src/img/insta.svg',
//     'src/img/logo.svg', 'src/img/twitter.svg',
//     'src/img/arrow-left.svg', 'src/img/arrow-right.svg'])
//   .pipe(svgstore({
//     inlineSvg: true
//   }))
//   .pipe(rename('sprite.svg'))
//   .pipe(gulp.dest('prod/img'));
// });

// gulp.task('images', gulp.series(
//   'minImg',
//   'svgSprite'
//   ));



// //pug task
// gulp.task('pug', () => {
//   return gulp.src('src/pug/**/index.pug')
//   .pipe(pug({pretty: true}))
//   .pipe(gulp.dest('src'));
// });


//html tasks
gulp.task('html', () => {
  return gulp.src('src/index.html')
  // .pipe(postHTML([
  //   include()
  //   ]))
  .pipe(minHtml(
    { collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true
    }))
  .pipe(gulp.dest('prod'));
});

// gulp.task('html', gulp.series('pug', 'htmlMin'));


//build tasks
gulp.task('cleanProd', () => {
  return clean('prod');
});

gulp.task('copy', () => {
  return gulp.src('src/fonts/**', { base: 'src' })
  .pipe(gulp.dest('prod'));
});

gulp.task('prod', gulp.series(
  'cleanProd',
  gulp.parallel(
    'copy',
    'style',
    // 'images',
    'jsMin',
    'html'
    ),
  ));


//live watching
gulp.task('default', gulp.series('prod', () => {
  sync.init({
    server: 'prod'
  });
  gulp.watch('src/style/*.scss', gulp.series('style'));
  gulp.watch('src/index.html', gulp.series('html'));
  gulp.watch('src/js/*.js', gulp.series('jsMin'));
}));