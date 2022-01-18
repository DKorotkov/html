export const server = (done) => {
   gl.plugins.browserSync.init({
      server: {
         baseDir: `${gl.path.dist.html}`,
      },
      notify: false,
      port: 3000,
   });
};
