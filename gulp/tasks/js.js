import uglify from "gulp-uglify"; // Минифицирует файл

export const js = () => {
   return gl.gulp
      .src(gl.path.app.js)
      .pipe(gl.plugins.newer(gl.path.dist.js))
      .pipe(
         gl.plugins.rename(function (path) {
            path.basename += ".min";
         })
      )
      .pipe(gl.plugins.fileinclude())
      .pipe(gl.plugins.sourcemaps.init())
      .pipe(uglify())
      .pipe(gl.plugins.sourcemaps.write())
      .pipe(gl.gulp.dest(gl.path.dist.js))
      .pipe(gl.plugins.browserSync.stream());
};
