//npm-check-updates - обновление всех плагинов !!!  ncu -u  !!
//npm i - установка всех пакетов.
//git subtree push --prefix dist origin gh-pages - добавляет в репозиторий новую ветку, для отображения страницы в github pages

import gulp from "gulp";

// Конфиг
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

// Задачи
import { watcher } from "./gulp/tasks/watcher.js";
import { clean } from "./gulp/tasks/clean.js";
import { copyFiles } from "./gulp/tasks/copyFiles.js";
import { html } from "./gulp/tasks/html.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { server } from "./gulp/tasks/server.js";

// Объявдяем глобальную переменную для вызова из функций
global.gl = {
   path: path,
   gulp: gulp,
   plugins: plugins,
   isBuild: false,
};

const dev = gulp.series(clean, html, scss, js, images, copyFiles, gulp.parallel(watcher, server));
const build = gulp.series(clean, html, scss, js, images, copyFiles, server);

gulp.task("default", dev);
gulp.task("build", build, function () {
   gl.isBuild = true;
});
