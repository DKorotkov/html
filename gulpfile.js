//npm-check-updates - обновление всех плагинов !!!  ncu -u  !!
//npm i - установка всех пакетов.
// npm install gulp-imagemin@7.1.0 - установка конкретной версии плагина для корректной работы
//git subtree push --prefix dist origin gh-pages - добавляет в репозиторий новую ветку, для отображения страницы в github pages
// git clone https://github.com/DKorotkov/html.git .

// .git/info/exclude - локальный gitignore
//npm outdated - выводит информацию о версиях плагинов, если есть обновление

import gulp from 'gulp'

// Конфиг
import { path } from './gulp/config/path.js'
import { plugins } from './gulp/config/plugins.js'
import { ftpSettings } from './gulp/config/ftp.js'

// Задачи
import { watcher } from './gulp/tasks/watcher.js'
import { clean } from './gulp/tasks/clean.js'
import { copyFiles } from './gulp/tasks/copyFiles.js'
import { html } from './gulp/tasks/html.js'
import { scss } from './gulp/tasks/scss.js'
import { js } from './gulp/tasks/js.js'
import { images } from './gulp/tasks/images.js'
import { svg } from './gulp/tasks/svg.js'
import { svgColor } from './gulp/tasks/svgColor.js'
import { fonts } from './gulp/tasks/fonts.js'
import { server } from './gulp/tasks/server.js'
import { ftp } from './gulp/tasks/ftp.js'

// Объявдяем глобальную переменную для вызова из функций
global.gl = {
	path: path,
	gulp: gulp,
	plugins: plugins,
	isBuild: !process.argv.includes('build'),
	isDev: !process.argv.includes('build'),
	ftpSettings: ftpSettings,
}

const dev = gulp.series(clean, html, scss, js, images, svg, svgColor, fonts, copyFiles, gulp.parallel(watcher, server))
const build = gulp.series(clean, html, scss, js, images, svg, svgColor, fonts, copyFiles)

gulp.task('default', dev)
gulp.task('build', build)
