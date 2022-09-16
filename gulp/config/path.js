const appFolder = `./app`;
const distFolder = `./dist`;
const ftpFolder = `/domains/a0675453.xsph.ru/public_html/wp-content/themes/medcial-center-angel/assets`;

// Получаем имя папки проекта
import * as nodePath from "path";
const projectFolder = nodePath.basename(nodePath.resolve());
// ---------------------------

export const path = {
   app: {
      html: `${appFolder}/*.html`,
      scss: `${appFolder}/scss/*.scss`,
      js: `${appFolder}/js/*.js`,
      img: `${appFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
      svg: `${appFolder}/img/svg_icons/*.svg`,
      fonts: `${appFolder}/fonts/`,
      files: `${appFolder}/files/**/*.*`, // Для простого копирования в папку с результатом
   },
   dist: {
      html: `${distFolder}/`,
      css: `${distFolder}/css/`,
      js: `${distFolder}/js/`,
      img: `${distFolder}/img/`,
      svg: `${distFolder}/img/icons/`,
      fonts: `${distFolder}/fonts/`,
      files: `${distFolder}/files/`,
   },
   watch: {
      html: `${appFolder}/**/*.html`,
      scss: `${appFolder}/scss/**/*.scss`,
      js: `${appFolder}/js/**/*.js`,
      img: `${appFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
      svg: `${appFolder}/img/svg_icons/*.svg`,
      fonts: `${appFolder}/fonts/**/*.*`,
      files: `${appFolder}/files/**/*.*`,
   },
   clean: distFolder,
   appFolder: appFolder,
   distFolder: distFolder,
   projectFolder: projectFolder,
   ftp: {
      from: {
         css: `${distFolder}/css/*.css`,
         js: `${distFolder}/js/*.js`,
      },
      to: ftpFolder,
   },
   fontImportFile: `${appFolder}/scss/_base/_fonts.scss`,
};
