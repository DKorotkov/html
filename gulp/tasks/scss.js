import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import group_media from "gulp-group-css-media-queries";
import GulpCleanCss from "gulp-clean-css";

// import webpCss from "gulp-webpcss";

const sass = gulpSass(dartSass);

export const scss = () => {
   return (
      gl.gulp
         .src(gl.path.app.scss)
         .pipe(gl.plugins.newer(gl.path.dist.css))
         .pipe(
            gl.plugins.rename({
               extname: ".min.css",
            })
         )
         .pipe(gl.plugins.sourcemaps.init())
         .pipe(gl.plugins.replace(/@img\//g, "img/"))
         .pipe(
            sass({
               outputStyle: "compressed",
            }).on("error", sass.logError)
         )
         .pipe(
            autoprefixer({
               grid: true,
               overrideBrowserslist: ["last 5 versions"],
               cascade: true,
            })
         )
         .pipe(gl.plugins.gulpIf(gl.isBuild, group_media()))
         // .pipe(
         //    webpCss({
         //       webpClass: ".webp",
         //       noWebpClass: ".no-webp",
         //    })
         // )
         .pipe(gl.plugins.gulpIf(gl.isBuild, GulpCleanCss()))
         .pipe(gl.plugins.sourcemaps.write("./maps"))
         .pipe(gl.gulp.dest(gl.path.dist.css))
         .pipe(gl.plugins.browserSync.stream())
   );
};
