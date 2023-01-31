// import 'focus-visible' //Скрипт полифил для корректной работы не стадартного фокуса (focus-visible)
import FormValid from "./modules/_formValidation"; // Загрузка класса Валидации форм - FormValid.init()
import './modules/_disableScroll'; //Загрузка класса "Запрета прокрутки"
'use strict';
FormValid.init();
// Загрузка шрифтов через скрипт
// include('modules/_fonts.js')
// @@include('modules/__noda.js')
//Загрузка класса "Модальных окон"
// @@include('modules/_modal.js')
//Загрузка класса "Вкладок (табов)"
// @@include('modules/_tabs.js')
//Загрузка класса "Галереи"
// @@include('modules/_gallery.js')
// -----------Модальное окно-----------------------------
// const m = new ModalDK({
//    selector: "#modal",
//    openBtnsSelector: ['[data-name="modal"]'],
//    focusTrap: true, // Требуется ли перемещаться табом только внутри объекта (default: false)
//    collapseOnFocusOut: false, // Требуется ли закрывать при потери фокуса
//    // dialogFullScreen: false,
// });
// ------------------------------------------------------
// // -----------Галерея------------------------------------
// g = new GalleryDK({
//    selector: ".gallery", // селектор контейнера, который объединяет все изображения
//    focusTrap: true,
//    collapseOnFocusOut: false,
// });
// // ------------------------------------------------------
