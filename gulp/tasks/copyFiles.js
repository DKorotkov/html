export const copyFiles = () => {
   return gl.gulp.src(gl.path.app.files).pipe(gl.gulp.dest(gl.path.dist.files));
};
