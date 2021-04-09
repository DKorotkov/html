//----------------------------ШРИФТЫ------------------------------------------------------------
var mainFont = new FontFaceObserver("Fira Sans");
// var Raleway = new FontFaceObserver("Raleway");

// // Загружаем все шрифты сразу Здесь лучше загружать шрифты, которые не являются основными, но находяться в верхней части страницы.
// Promise.all([Montserrat.load()]).then(function () {
//    console.log("Montserrat загружен");
// });

// Добавлем необходимые классы при загрузке нужного шрифта
var html = document.documentElement;

if (html.classList.contains("fonts-loading")) {
   mainFont
      .load()
      .then(function () {
         html.classList.remove("fonts-loading");
         html.classList.add("fonts-loaded");
         sessionStorage.fontsLoaded = true; // Загружаем в кэш
      })
      .catch(function () {
         html.classList.remove("fonts-loading");
         html.classList.add("fonts-failed");
         sessionStorage.fontsLoaded = false;
      });
}

// Здесь лучше загружать шрифты которые не основные и находяться в нижней части страницы
// Montserrat.load().then(function () {
//    console.log("Загружен Input Mono");
// });
// ________________________________________________________________________________________________________________

let checkBox = document.querySelectorAll(".course__check-input");

for (let check of checkBox) {
   check.onclick = function () {
      if (check.checked == true) {
         check.closest(".course__footer").parentElement.lastElementChild.classList.add("course__bg--viewed");
      } else {
         check.closest(".course__footer").parentElement.lastElementChild.classList.remove("course__bg--viewed");
      }
   };
}
