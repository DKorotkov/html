// ____________________________________Отслеживает изменения файлов___________________________
import { html } from "./html.js";
import { scss } from "./scss.js";
import { js } from "./js.js";
import { images } from "./images.js";
import { svg } from "./svg.js";
import { svgColor } from "./svgColor.js";
import { copyFiles } from "./copyFiles.js";
import { fonts } from "./fonts.js";

export function watcher() {
   gl.gulp.watch(gl.path.watch.html, html);
   gl.gulp.watch(gl.path.watch.scss, scss);
   gl.gulp.watch(gl.path.watch.js, js);
   gl.gulp.watch(gl.path.watch.img, images);
   gl.gulp.watch(gl.path.watch.svg, svg);
   gl.gulp.watch(gl.path.watch.svgColor, svgColor);
   gl.gulp.watch(gl.path.watch.files, copyFiles);
   gl.gulp.watch(gl.path.watch.fonts, fonts);
}
