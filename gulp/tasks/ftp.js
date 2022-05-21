import v_ftp from "vinyl-ftp";

export const ftp = () => {
   let connection = v_ftp.create(gl.ftpSettings);
   let from = [gl.path.ftp.from.css, gl.path.ftp.from.js];

   return (
      gl.gulp
         .src(from, { base: gl.path.distFolder, buffer: false })
         // .pipe(connection.newer("/public_html")) // only upload newer files
         .pipe(connection.dest(`${gl.path.ftp.to}`))
   );
};
