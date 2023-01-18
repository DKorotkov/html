(function () {
   ("use strict");

   // Загрузка шрифтов через скрипт
   // include('modules/_fonts.js')

   // Загузка класса Аккардион
   // include('modules/_accordion.js')

   // Загрузка класса Валидации форм
   @@include('modules/_formValidation.js')

   // Загрузка класса кастомизации Select
   // include('modules/_select.js')

   // Загрузка класса Событий "касаний
   // include('modules/_eventTouch.js')

   // Загрузка класса "Общего класса"
   @@include('modules/__noda.js')

   //Загрузка класса "Модальных окон"
   @@include('modules/_modal.js')

   //Загрузка класса "Вкладок (табов)"
   @@include('modules/_tabs.js')

   //Загрузка класса "Запрета прокрутки"
   @@include('modules/_disableScroll.js')

   //Загрузка класса "Галереи"
   @@include('modules/_gallery.js')
   

   // -----------Модальное окно-----------------------------
   m = new ModalDK({
      selector: "#modal",
      openBtnsSelector: ['[data-name="modal"]'],
      focusTrap: true, // Требуется ли перемещаться табом только внутри объекта (default: false)
      collapseOnFocusOut: false, // Требуется ли закрывать при потери фокуса
      // dialogFullScreen: false,
   });
   // ------------------------------------------------------

   // -----------Галерея------------------------------------
   g = new GalleryDK({
      selector: ".gallery", // селектор контейнера, который объединяет все изображения
      focusTrap: true,
      collapseOnFocusOut: false,
   });
   // ------------------------------------------------------

})();