// gulp 모듈 호출
const { series, parallel, src, dest, lastRun, watch } = require('gulp');

// gulp 플러그인 호출
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const runSequence = require('gulp4-run-sequence');
const del = require('del');
const fileinclude = require('gulp-file-include');
const minifyCss = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

const path = {
  // 작업경로
  temp: './src/template/',
  assets: {
    scss: './src/assets/scss/',
    css: './src/assets/css/',
    js: './src/assets/js/',
    images: './src/assets/images/',
    font: './src/assets/font/',
  },
};

const destPath = {
  // 배포경로
  _: './dist/',
  assets: {
    css: './dist/assets/css/',
    js: './dist/assets/js/',
    images: './dist/assets/images/',
    font: './dist/assets/font/',
  },
};

/**
 * ==============================+
 * HTML Config(환경설정)
 * ==============================+
 */
const Template = () => {
  // html 템플릿
  return src([`${path.temp}**/*.html`, `!${path.temp}include/*.html`])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(dest(destPath._))
    .pipe(browserSync.reload({ stream: true }));
};

/**
 * ==============================+
 * JS Config(환경설정)
 * ==============================+
 */
const Js_library = () => {
  // 라이브러리 묶음
  return src(`${path.assets.js}lib/*.js`, { sourcemaps: true })
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(dest(destPath.assets.js), { sourcemaps: true })
    .pipe(browserSync.reload({ stream: true }));
};

const Js_common = () => {
  // 작업용 JS 묶음
  return src(`${path.assets.js}*.js`)
    .pipe(concat('common.js'))
    .pipe(dest(destPath.assets.js))
    .pipe(browserSync.reload({ stream: true }));
};

/**
 * ==============================+
 * IMAGE, WEBFONT Config(환경설정)
 * ==============================+
 */
const Images = () => {
  // 이미지 경량화
  return src(`${path.assets.images}**/*`, { since: lastRun(Images) })
    .pipe(imagemin())
    .pipe(dest(destPath.assets.images))
    .pipe(browserSync.reload({ stream: true }));
};

const Webfont = () => {
  // 웹 폰트 배포 경로로 복사
  return src(`${path.assets.font}**/*`)
    .pipe(dest(destPath.assets.font))
    .pipe(browserSync.reload({ stream: true }));
};

const Watch = () => {
  watch(`${path.assets.js}*.js`, Js_common);
  watch(`${path.assets.css}*.css`, Css);
  watch(`${path.assets.scss}*.scss`, Sass_compile);
  watch(`${path.assets.images}**/*`, Images);
  watch(`${path.temp}**/*.html`, Template);
};

const Clean = () => {
  // 컴파일 시 배포폴더 내 파일 제거
  return del(['dist/**/*', '!dist'], { force: true });
};

const browserSyncInit = () => {
  // browser-sync (reload)
  return browserSync.init({
    port: 5500,
    server: {
      baseDir: destPath._,
    },
  });
};

/**
 * ==============================+
 * CSS Config(환경설정)
 * ==============================+
 */
const Css = () => {
  // css 배포 경로로 복사
  return src(`${path.assets.css}**/*`)
    .pipe(dest(destPath.assets.css))
    .pipe(browserSync.reload({ stream: true }));
};

/**
 * ==============================+
 * tgplayer(환경설정)
 * ==============================+
 */
const Tgplayer = () => {
  // Tgplayer 배포 경로로 복사
  return src(`./src/tgplayer/**/*`)
    .pipe(dest('./dist/tgplayer/'))
    .pipe(browserSync.reload({ stream: true }));
};

/**
 * ==============================+
 * SCSS Config(환경설정)
 * ==============================+
 */
const Scss_options = {
  outputStyle: 'expanded',
  indentType: 'tab',
  indentWidth: 1,
  precision: 6,
  sourceComments: true,
};

const Sass_compile = () => {
  return src(`${path.assets.scss}**/*.scss`, { sourcemaps: true })
    .pipe(scss(Scss_options).on('error', scss.logError))
    .pipe(minifyCss())
    .pipe(dest(destPath.assets.css), { sourcemaps: true })
    .pipe(browserSync.reload({ stream: true }));
};

exports.prod = series(Clean, Js_library, Js_common, Sass_compile, Css, Images, Webfont, Template, Tgplayer);
exports.watch = parallel(Watch, browserSyncInit);
