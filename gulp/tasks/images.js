import gulpWebp from "gulp-webp";
import imagemin from "gulp-imagemin"; // "gulp-imagemin": "^7.1.0"

export const images = () => {
   return gl.gulp
      .src(gl.path.app.img)
      .pipe(gl.plugins.newer(gl.path.dist.img))
      .pipe(gulpWebp())
      .pipe(gl.gulp.dest(gl.path.dist.img))
      .pipe(gl.gulp.src(gl.path.app.img))
      .pipe(
         gl.plugins.gulpIf(
            gl.isBuild,
            imagemin([
               imagemin.gifsicle({ interlaced: true }),
               imagemin.mozjpeg({ quality: 75, progressive: true }),
               imagemin.optipng({ optimizationLevel: 5 }),
               imagemin.svgo({
                  plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
               }),
            ])
         )
      )
      .pipe(gl.gulp.dest(gl.path.dist.img))
      .pipe(gl.gulp.src(gl.path.app.svg))
      .pipe(gl.gulp.dest(gl.path.dist.img))
      .pipe(gl.plugins.browserSync.stream());
};
