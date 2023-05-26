// import 'focus-visible' //Скрипт полифил для корректной работы не стадартного фокуса (focus-visible)
import FormValid from "./modules/_formValidation"; // Загрузка класса Валидации форм - FormValid.init()
import './modules/_disableScroll'; //Загрузка класса "Запрета прокрутки"
FormValid.init();
// Загрузка шрифтов через скрипт
// include('modules/_fonts.js')
// @@include('./app/js/modules/__noda.js')
//Загрузка класса "Модальных окон"
// @@include('./app/js/modules/_modal.js')
//Загрузка класса "Вкладок (табов)"
// @@include('./app/js/modules/_tabs.js')
//Загрузка класса "Галереи"
// @@include('./app/js/modules/_gallery.js')
// -----------Модальное окно-----------------------------
//@ts-ignore
const m = new ModalDK({
    selector: "#modal",
    openBtnsSelector: ['[data-name="modal"]'],
    focusTrap: true,
    collapseOnFocusOut: false, // Требуется ли закрывать при потери фокуса
    // dialogFullScreen: false,
});
// ------------------------------------------------------
// -----------Галерея------------------------------------
//@ts-ignore
const g = new GalleryDK({
    selector: ".gallery",
    focusTrap: true,
    collapseOnFocusOut: false,
});
// ------------------------------------------------------
