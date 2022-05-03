import svgSprite from "gulp-svg-sprite";
import gulpCheerio from "gulp-cheerio";
import replace from "gulp-replace";
import svgo from "gulp-svgo";

// <svg role="img">
//    <use xlink:href="/sprite.svg#icon1"></use>
// </svg>;
// Создать миксин, который будем передлывать ссылку на конкретную svg в ссылку на спрайт с указанием id этого конкретного svg

export const svg = () => {
   return (
      gl.gulp
         .src(gl.path.app.svg)
         .pipe(gl.plugins.newer(gl.path.dist.svg))
         .pipe(
            svgo({
               plugins: [{ removeViewBox: false }],
            })
         )
         .pipe(
            gulpCheerio({
               run: function ($) {
                  $("[id]").removeAttr("id");
                  $("[fill]").removeAttr("fill");
                  $("[clip]").removeAttr("clip");
                  $("[stroke]").removeAttr("stroke");
                  $("[mask]").removeAttr("mask");
                  $("[opacity]").removeAttr("opacity");
                  $("[width]").removeAttr("width");
                  $("[height]").removeAttr("height");
                  $("[class]").removeAttr("class");
               },
               parserOptions: {
                  xmlMode: true,
               },
            })
         )

         // У cheerio есть один баг — иногда он преобразовывает символ '>' в кодировку '&gt;'.
         .pipe(replace("&gt;", ">"))
         .pipe(
            svgSprite({
               mode: {
                  symbol: {
                     sprite: "icons.svg",
                     dest: "./", // Убираем папку с названием мода.
                  },
               },
               // shape: {
               //    // Убирает префикс с путями.
               //    id: {
               //       generator: function (name) {
               //          return path.basename(name, ".svg");
               //       },
               //    },
               // },
            })
         )
         .pipe(gl.gulp.dest(gl.path.dist.svg))
         .pipe(gl.plugins.browserSync.stream())
   );
};
