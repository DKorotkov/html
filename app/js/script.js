(function () {
   "use strict";
   
    @@include("modules/keys.js"); // Набор описания кнопок

    // Загрузка шрифтов через скрипт
    var font = new FontFaceObserver('Pangolin');
    var html = document.documentElement;

    font.load().then(function () {
        html.classList.remove('fonts-loading');
        html.classList.add('fonts-loaded');
        sessionStorage.fontsLoaded = true;
    }).catch(function () {
        html.classList.remove('fonts-loading');
        html.classList.add('fonts-failed');
        sessionStorage.fontsLoaded = false;
    });

})();

