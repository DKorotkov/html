const appFolder = `./app`;
const distFolder = `./dist`;

// Получаем имя папки проекта
import * as nodePath from "path";
const projectFolder = nodePath.basename(nodePath.resolve());
// ---------------------------

export const path = {
   app: {
      html: `${appFolder}/*.html`,
      scss: `${appFolder}/scss/*.scss`,
      js: `${appFolder}/js/**/*.js`,
      img: `${appFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
      svg: `${appFolder}/img/**/*.svg`,
      files: `${appFolder}/files/**/*.*`, // Для простого копирования в папку с результатом
   },
   dist: {
      html: `${distFolder}/`,
      css: `${distFolder}/css/`,
      js: `${distFolder}/js/`,
      img: `${distFolder}/img/`,
      files: `${distFolder}/files/`,
   },
   watch: {
      html: `${appFolder}/**/*.html`,
      scss: `${appFolder}/scss/**/*.scss`,
      js: `${appFolder}/js/**/*.js`,
      img: `${appFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg}`,
      files: `${appFolder}/files/**/*.*`,
   },
   clean: distFolder,
   appFolder: appFolder,
   distFolder: distFolder,
   projectFolder: projectFolder,
   ftp: ``,
};
