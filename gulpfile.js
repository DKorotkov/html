//npm i - установка всех пакетов
//npm-check-updates - обновление всех плагинов !!!  ncu  !!

//gulp fb - запускает первый запуск: генерирует шрифты.

let project_folder = "dist";
//let project_folder = require("path").basename(__dirname); //Папка по имени проекта
let source_folder = "app";

let fs = require("fs");

let path = {
   dest: {
      html: project_folder + "/",
      css: project_folder + "/css/",
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      imgToResponsSRC: project_folder + "/img/ImgToResp/",
      imgToRespons: [project_folder + "/img/**/*.{jpeg,jpg,png}", "!" + project_folder + "/img/favicon/*"],
      fonts: project_folder + "/fonts/",
   },
   app: {
      html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
      css: source_folder + "/scss/style.scss",
      js: source_folder + "/js/*.js",
      img: [source_folder + "/img/*.{jpeg,jpg,png,svg,gif,ico,webp}", "!" + source_folder + "/img/ImgToResp/*", "!" + source_folder + "/img/favicon/*"],
      imgToRespons: source_folder + "/img/ImgToResp/*.{jpg,jpeg,png}",
      fav: source_folder + "/img/favicon/**/*",
      fonts: source_folder + "/fonts/*.ttf",
   },
   watch: {
      html: source_folder + "/**/*.html",
      css: source_folder + "/scss/**/*.scss",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpeg,jpg,png}",
      svg: source_folder + "/img/icons/svg/*.svg",
   },
   clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp"),
   gulp = require("gulp"),
   browsersync = require("browser-sync").create(),
   fileinclude = require("gulp-file-include"),
   scss = require("gulp-sass"),
   autoPrefixer = require("gulp-autoprefixer"),
   group_media = require("gulp-group-css-media-queries"),
   clean_css = require("gulp-clean-css"),
   rename = require("gulp-rename"),
   uglify = require("gulp-uglify-es").default,
   // imagemin = require("gulp-imagemin"),
   webp = require("gulp-webp"),
   // webphtml = require("gulp-webp-html"),
   GulpWebpHtml2 = require("dk-webp-in-html"),
   webpcss = require("dk-webp-css"),
   svgSprite = require("gulp-svg-sprite"),
   ttf2woff = require("gulp-ttf2woff"),
   ttf2woff2 = require("gulp-ttf2woff2"),
   fonter = require("gulp-fonter"),
   // changed = require("gulp-changed"),
   responsiveImg = require("gulp-responsive"),
   never = require("gulp-newer"),
   lqipBase64 = require("gulp-lqip-base64"),
   del = require("del");

function browserSync(params) {
   browsersync.init({
      server: {
         baseDir: "./" + project_folder + "/",
      },
      port: 3000,
      notify: false,
   });
}

function html() {
   return (
      src(path.app.html)
         .pipe(fileinclude())

         .pipe(lqipBase64({ srcAttr: "data-src", attribute: "src" })) // Для корректной работы плагина необходимо передавать в случае если эти изображения необходимо подготовить для разный разрешений -
         //  <img class="lazyload"  data-was-processed="true" data-src="/img/hello.jpg" alt="Hello!" />
         // в случает, если разные разрешения не нужны, а нужен только webp
         // <img src="/img/user.jpeg" alt="Быстров Борис Викторович" />
         // в случае если надо создать несколько вариантов изображений для загрузки через laziload в background
         // <section class="test lazyload" data-bgset="../img/projects.jpg" data-sizes="auto"> Это для lazyload background-image
         .pipe(GulpWebpHtml2())
         .pipe(dest(path.dest.html))
         .pipe(browsersync.stream())
   );
}

function css() {
   return (
      src(path.app.css)
         .pipe(
            scss({
               outputStyle: "expanded",
            })
         )
         .pipe(group_media())
         .pipe(
            autoPrefixer({
               grid: true,
               overrideBrowserslist: ["last 5 versions"],
               cascade: true,
            })
         )
         // Для того чтобы создать разные разрешения для разный экранов надо: url(../img/ImgToResp/bg-small.jpg) top left repeat;

         // Просто для webp надо: background: url(../img/bg.jpg) top left repeat;
         .pipe(
            webpcss({
               replace_from: /\.(png|jpg|jpeg)/,
               replace_to: ".webp",
            })
         )
         .pipe(dest(path.dest.css))
         .pipe(clean_css())
         .pipe(
            rename({
               extname: ".min.css",
            })
         )
         .pipe(dest(path.dest.css))
         .pipe(browsersync.stream())
   );
}

function js() {
   return src(path.app.js)
      .pipe(fileinclude())
      .pipe(dest(path.dest.js))
      .pipe(uglify())
      .pipe(
         rename({
            extname: ".min.js",
         })
      )
      .pipe(dest(path.dest.js))
      .pipe(browsersync.stream());
}

// var o = {
//    width: [600, 1024, 2560],
//    suffix: ["-small", "-large", "-extralarge"],
//    resolution: [" ", "@2x", "@3x"],
//    extname: [".jpg", ".webp"],
// };

function imgToResp() {
   //Формирует изображения для разных размеров экрана из оригинального.
   return (
      src(path.app.imgToRespons)
         .pipe(
            responsiveImg(
               {
                  "*": [
                     {
                        width: 600,
                        rename: {
                           suffix: "-small",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     {
                        width: 600 * 2,
                        rename: {
                           suffix: "-small@2x",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     {
                        width: 600 * 3,
                        rename: {
                           suffix: "-small@3x",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     {
                        width: 1024,
                        rename: {
                           suffix: "-large",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     {
                        width: 1024 * 2,
                        rename: {
                           suffix: "-large@2x",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     {
                        width: 1024 * 3,
                        rename: {
                           suffix: "-large@3x",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },

                     {
                        width: 2560,
                        rename: {
                           suffix: "-extralarge",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     {
                        width: 2560 * 2,
                        rename: {
                           suffix: "-extralarge@2x",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     {
                        width: 2560 * 3,
                        rename: {
                           suffix: "-extralarge@3x",
                           extname: ".jpg",
                        },
                        withoutEnlargement: true,
                     },
                     // {
                     //    rename: { dirname: path.basename },
                     // },
                  ],
               },
               {
                  // Global configuration for all images
                  // The output quality for JPEG, WebP and TIFF output formats
                  quality: 80,
                  // Use progressive (interlace) scan for JPEG and PNG output
                  progressive: true,
                  // Zlib compression level of PNG output format
                  compressionLevel: 6,
                  // Strip all metadata
                  withMetadata: false,
                  errorOnEnlargement: false,
               }
            )
         )
         .pipe(
            rename(function (path) {
               // Updates the object in-place
               if (path.basename.indexOf("-") > 0) {
                  path.dirname += "/" + path.basename.slice(0, path.basename.lastIndexOf("-"));
               } else path.dirname += "/" + path.basename;
            })
         )
         // .pipe(never(path.dest.img)) // Отслеживает только измененные файлы

         .pipe(dest(path.dest.imgToResponsSRC))

         .pipe(browsersync.stream())
   );
}

function img() {
   return src(path.app.img)
      .pipe(dest(path.dest.img))

      .pipe(browsersync.stream());
}

// Преобразует файлы изображений в webp.
function towebp() {
   return (
      gulp
         .src(path.dest.imgToRespons)

         .pipe(
            webp({
               quality: 70,
            })
         )
         // .pipe(never(path.dest.img)) // Отслеживает только измененные файлы
         // .pipe(never(path.dest.img)) // Отслеживает только измененные файлы
         .pipe(dest(path.dest.img))
   );
}

function favicon() {
   // return gulp.src(source_folder + "/fonts/*.{woff, woff2}").pipe(dest(path.dest.fonts));
   return gulp.src(path.app.fav).pipe(dest(path.dest.img + "/favicon/"));
}

function svgsprite() {
   return gulp
      .src([source_folder + "/img/svg/*.svg", "!" + source_folder + "/img/svg/icons.svg"])
      .pipe(never(path.dest.img)) // Отслеживает только измененные файлы
      .pipe(
         svgSprite({
            mode: {
               stack: {
                  sprite: "../svg/icons.svg",
                  example: true,
               },
            },
         })
      )
      .pipe(dest(path.dest.img))
      .pipe(browsersync.stream());
}

function fonts(params) {
   src(`${source_folder}/fonts/*.{woff,woff2}`).pipe(dest(path.dest.fonts));
   src(path.app.fonts).pipe(ttf2woff()).pipe(dest(path.dest.fonts));
   return src(path.app.fonts).pipe(ttf2woff2()).pipe(dest(path.dest.fonts));
}

function otf2ttf() {
   return src([source_folder + "/fonts/*.otf"])
      .pipe(
         fonter({
            formats: ["ttf"],
         })
      )
      .pipe(dest(source_folder + "/fonts"));
}

//Записывает имена файлов в файл fons.scss
function fontsStyle(params) {
   let file_content = fs.readFileSync(source_folder + "/scss/_fonts.scss");
   /*   // if (file_content == '') {*/
   fs.writeFile(source_folder + "/scss/_fonts.scss", "", cb);
   return fs.readdir(path.dest.fonts, function (err, items) {
      if (items) {
         let c_fontname;
         let name;
         let weight = "400";
         let style;
         for (var i = 0; i < items.length; i++) {
            let fontname = items[i].split(".");
            fontname = fontname[0];
            if (c_fontname != fontname) {
               if (~fontname.indexOf("-")) name = fontname.slice(0, fontname.indexOf("-"));
               else name = fontname;

               if (~fontname.toLowerCase().indexOf("thin")) weight = "100";
               else if (~fontname.toLowerCase().indexOf("extralight")) weight = "200";
               else if (~fontname.toLowerCase().indexOf("light")) weight = "300";
               else if (~fontname.toLowerCase().indexOf("normal")) weight = "400";
               else if (~fontname.toLowerCase().indexOf("medium")) weight = "500";
               else if (~fontname.toLowerCase().indexOf("semibold")) weight = "600";
               else if (~fontname.toLowerCase().indexOf("bold")) weight = "700";
               else if (~fontname.toLowerCase().indexOf("heavy") || ~fontname.toLowerCase().indexOf("extrabold")) weight = "800";
               else if (~fontname.toLowerCase().indexOf("black")) weight = "900";
               else weight = "400";

               if (~fontname.toLowerCase().indexOf("italic")) style = "italic";
               else style = "normal";

               fs.appendFile(source_folder + "/scss/_fonts.scss", '@include font("' + name + '", "' + fontname + '", " ' + weight + '", "' + style + '");\r\n', cb);
            }
            c_fontname = fontname;
         }
      }
   });
   /* }*/
}

function cb() {}

function watchFiles(params) {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], img);
   gulp.watch([path.watch.svg], svgsprite);
}

function clean(params) {
   return del(path.clean);
}

let fb = gulp.parallel(otf2ttf);
let build = gulp.series(clean, gulp.parallel(js, css, html, imgToResp, img, svgsprite, favicon, fonts), towebp, fontsStyle);
//let build = gulp.series(clean, gulp.parallel(js, css, html, img));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.otf2ttf = otf2ttf;
exports.svgsprite = svgsprite;
exports.fonts = fonts;
exports.imgToResp = imgToResp;
exports.img = img;
exports.towebp = towebp;
exports.favicon = favicon;
exports.js = js;
exports.css = css;
exports.build = build;
exports.html = html;
exports.fb = fb;
exports.watch = watch;
exports.default = watch;