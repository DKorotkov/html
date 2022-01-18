// ____________________________________Отслеживает изменения файлов___________________________
import { html } from "./html.js";
import { scss } from "./scss.js";
import { js } from "./js.js";
import { images } from "./images.js";
import { copyFiles } from "./copyFiles.js";

export function watcher() {
   gl.gulp.watch(gl.path.watch.html, html);
   gl.gulp.watch(gl.path.watch.scss, scss);
   gl.gulp.watch(gl.path.watch.js, js);
   gl.gulp.watch(gl.path.watch.img, images);
   gl.gulp.watch(gl.path.watch.files, copyFiles);
}
