var gulp =        require('gulp'),
    sass =        require('gulp-sass'),
    concat =      require('gulp-concat'),
    browsersync = require('browser-sync').create();

gulp.task('serve', ['sass', 'scripts'], function(){
  browsersync.init({
    server: './'
  });

  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch('./js/*.js', ['scripts']);
  gulp.watch('./*.html').on('change', browsersync.reload);
  gulp.watch('./js/app.js').on('change', browsersync.reload);
  gulp.watch('./data/data.json').on('change', browsersync.reload);
});

gulp.task('scripts', function() {
  return gulp.src(['./js/modernizr.js', './js/vue.js', './js/app.js'])
    .pipe(concat('./js/scripts.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('sass', function(){
  return gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browsersync.stream());
});

gulp.task('default', ['serve']);
