(function () {
   "use strict";

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

   const actionBtn = document.querySelector(".action-btn");
   actionBtn.addEventListener("click", actionClick);

   function actionClick() {
      const bkContainer = document.querySelector(".block1__container");
      bkContainer.classList.toggle("block1__container--action");

      const block3 = document.querySelector(".block3");
      block3.classList.toggle("block3--active");
   }
})();
