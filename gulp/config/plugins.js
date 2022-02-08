import replace from "gulp-replace"; // Поиск и замена
import plumber from "gulp-plumber"; // Обработка ошибок
import notify from "gulp-notify"; // Сообщения (подсказки) в окне уведомлений Windows
import rename from "gulp-rename";
import newer from "gulp-newer"; // Отслеживает только измененные файлы
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";
import gulpIf from "gulp-if";
import fileinclude from "gulp-file-include";

export const plugins = {
   replace,
   plumber,
   notify,
   browserSync,
   rename,
   sourcemaps,
   newer,
   gulpIf,
   fileinclude,
};
