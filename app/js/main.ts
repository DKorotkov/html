// import 'focus-visible' //Скрипт полифил для корректной работы не стадартного фокуса (focus-visible)
import FormValid from "./modules/_formValidation" // Загрузка класса Валидации форм - FormValid.init()
import { Accordion, AccordionBtn } from './modules/_accordion' // Загузка класса Аккардион
import SelectDk from './modules/_select' //Загрузка класса кастомизации Select SelectDK.init();
import EventTouch from './modules/_eventTouch' // Загрузка класса Событий "касаний"
import ScrollBtns from './modules/_scrollButtons' // Загрузка класс управления списком элемтов с прокруткой
import './modules/_disableScroll' //Загрузка класса "Запрета прокрутки"
import './modules/_inputPhone.js' //Загрузка маски для телефона

FormValid.init() 
SelectDk.init()


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
      focusTrap: true, // Требуется ли перемещаться табом только внутри объекта (default: false)
      collapseOnFocusOut: false, // Требуется ли закрывать при потери фокуса
      // dialogFullScreen: false,
   });
   // ------------------------------------------------------

   // -----------Галерея------------------------------------
   //@ts-ignore
   const g = new GalleryDK({
      selector: ".gallery", // селектор контейнера, который объединяет все изображения
      focusTrap: true,
      collapseOnFocusOut: false,
   });
   // ------------------------------------------------------

   // -------------Табы-----------------------
   //@ts-ignore
   const tabs = new TabsDk({
      selector: ".tablist",
      tabItem: ".tabitem",
      initialIndex: 0,
      focusTrap: true, // Требуется ли перемещаться табом только внутри объекта (default: false)
      collapseOnFocusOut: true, // Требуется ли закрывать при потери фокуса
      mathcMedia: '(max-width: 50rem)',
   });
   // -------------КОНЕЦ Табы-----------------------

   // -------------Прокрутка изображений-----------------------
   const tkEl = document.querySelector('.gallery')
   // const tк = new ScrollBtns(tkEl, {
   //    classBtnNext: 'btn-navigation--prev',
   //    classPrevNext: 'btn-navigation--next',
   // })
   // -------------КОНЕЦ Прокрутка-----------------

