import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";
import * as fs from "fs";

export const fonts = () => {
   try {
      return gl.gulp
         .src(gl.path.app.fonts + "*.otf")
         .pipe(gl.plugins.newer(gl.path.dist.fonts + "*.*"))
         .pipe(
            fonter({
               formats: ["woff", "ttf"],
            })
         )
         .pipe(gl.gulp.dest(gl.path.app.fonts))
         .pipe(ttf2woff2())
         .pipe(gl.gulp.dest(gl.path.dist.fonts))
         .pipe(gl.plugins.browserSync.stream());
   } finally {
      fontsStyle();
   }
};

//Записывает имена файлов в файл fons.scss
function fontsStyle() {
   // удаляем строчки, которые начинаются с @include
   fs.readFile(gl.path.fontImportFile, "utf8", function (err, data) {
      if (err) throw err;

      fs.writeFile(gl.path.fontImportFile, removeLines(data), "utf8", function (err) {
         if (err) throw err;
         fs.readdir(gl.path.app.fonts, function (err, items) {
            if (items) {
               let c_fontname;
               let name;
               let weight = "400";
               let style;
               for (var i = 0; i < items.length; i++) {
                  let fontname = items[i].split(".");
                  fontname = fontname[0];
                  if (c_fontname != fontname) {
                     if (~fontname.indexOf("-")) name = fontname.slice(0, fontname.indexOf("-"));
                     else name = fontname;

                     if (~fontname.toLowerCase().indexOf("thin")) weight = "100";
                     else if (~fontname.toLowerCase().indexOf("extralight")) weight = "200";
                     else if (~fontname.toLowerCase().indexOf("light")) weight = "300";
                     else if (~fontname.toLowerCase().indexOf("normal")) weight = "400";
                     else if (~fontname.toLowerCase().indexOf("medium")) weight = "500";
                     else if (~fontname.toLowerCase().indexOf("semibold")) weight = "600";
                     else if (~fontname.toLowerCase().indexOf("bold")) weight = "700";
                     else if (~fontname.toLowerCase().indexOf("heavy") || ~fontname.toLowerCase().indexOf("extrabold")) weight = "800";
                     else if (~fontname.toLowerCase().indexOf("black")) weight = "900";
                     else weight = "400";

                     if (~fontname.toLowerCase().indexOf("italic")) style = "italic";
                     else style = "normal";

                     fs.appendFile(gl.path.fontImportFile, '@include font("' + name.trim() + '", "' + fontname + '", " ' + weight.trim() + '", "' + style + '");\r\n', cb);
                  }
                  c_fontname = fontname;
               }
            }
         });
      });
   });
   // fs.writeFile(gl.path.fontImportFile, "", cb);
}

function removeLines(data) {
   return data
      .split("\n")
      .filter((val) => !val.includes("@include font"))
      .join("\n");
}

function cb() {}
