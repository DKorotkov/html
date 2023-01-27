import gts from 'gulp-typescript'
const tsProject = gts.createProject('tsconfig.json')

export const ts = () => {
	return tsProject
		.src()
		.pipe(tsProject())
		.js.pipe(
			gl.gulp.dest(function (file) {
				return file.base
			})
		)
}
