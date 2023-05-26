import uglify from 'gulp-uglify' // Минифицирует файл
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import tsify from 'tsify'
import esmify from 'esmify'
import buffer from 'vinyl-buffer'

export const js = () => {
	return browserify({
		basedir: '.',
		debug: true,
		entries: ['app/js/main.js'],
		cache: {},
		packageCache: {},
		plugin: [[esmify, {}]],
	})
		.plugin(tsify)
		.bundle()
		.pipe(source('bundle.min.js'))
		.pipe(gl.plugins.fileinclude())
		.pipe(gl.plugins.gulpIf(gl.isBuild, buffer()))
		.pipe(gl.plugins.gulpIf(gl.isBuild, uglify()))
		.pipe(gl.gulp.dest(gl.path.dist.js))
		.pipe(gl.plugins.browserSync.stream())
}
