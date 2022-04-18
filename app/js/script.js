// import { formValid } from "/js/modules/formValidation.min.js";

(function () {
   ("use strict");

   // Загрузка шрифтов через скрипт
   //    var font = new FontFaceObserver("Pangolin");
   //    var html = document.documentElement;

   //    font
   //       .load()
   //       .then(function () {
   //          html.classList.remove("fonts-loading");
   //          html.classList.add("fonts-loaded");
   //          sessionStorage.fontsLoaded = true;
   //       })
   //       .catch(function () {
   //          html.classList.remove("fonts-loading");
   //          html.classList.add("fonts-failed");
   //          sessionStorage.fontsLoaded = false;
   //       });

   // -----------Проверка валидация формы-------------------

   // const form1 = document.querySelector("form[novalidate]");
   // const form = new FormValid(form1);
   // console.log(form);
   FormValid.init();

   // ------------------------------------------------------
})();
