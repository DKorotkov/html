import webpHtmlNosvg from 'gulp-webp-html-nosvg' // Создает тэг для поддержки webp
import versionNumber from 'gulp-version-number' // Для обновления версий файлов стилей и скриптов (проблема кэширования на сервере)
import htmlmin from 'gulp-htmlmin'

export const html = () => {
	return (
		gl.gulp
			.src(gl.path.app.html)
			// Можно выводить ошибки в оконо уведомления Windows
			// .pipe(
			//    gl.plugins.plumber(
			//       gl.plugins.notify.onError({
			//          title: "HTML",
			//          message: "Error: <%= error.message %>",
			//       })
			//    )
			// )
			.pipe(gl.plugins.fileinclude())
			.pipe(gl.plugins.replace(/@img\//g, 'img/'))
			.pipe(webpHtmlNosvg())
			.pipe(
				gl.plugins.gulpIf(
					gl.isBuild,
					versionNumber({
						value: '%DT%',
						append: {
							key: '_v',
							cover: 0,
							to: ['css', 'js'],
						},
						output: {
							file: 'gulp/version.json',
						},
					})
				)
			)
			.pipe(
				gl.plugins.gulpIf(
					gl.isBuild,
					htmlmin({
						// collapseWhitespace: true, // удаляем все переносы
						removeComments: true, // удаляем все комментарии
						// minifyJS: true,
						// removeCommentsFromCDATA: true,
					})
				)
			)
			.pipe(gl.gulp.dest(gl.path.dist.html))
			.pipe(gl.plugins.browserSync.stream())
	)
}
