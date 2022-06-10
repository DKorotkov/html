/*

   Появляеющиеся модальное окно (эффекты появления настраиваются дополнительно).
   Возможно использовать для основной навгиации на сайте и любых других меню или модальных окон.
   
   !нет реализации! data-select-first="true" - необходимо установить на элемент, который должн попасть в фокус при открытии модального окна
   

   data-select-last="true" - необходимо установить на элемент, который должн попасть в фокус в самый последний момент
   data-close="true" - необходимо установить на элемент, который будет закрывать модальное окно (только на элементы внутри окна)


   Объект модального окна:
   selector - селектор модального окна с которым будем работать
   openBtnsSelector - кнопки открытия (могут быть указаны ввиде массива)
   closeBtnsSelector: - кнопки закрытия (могут быть указаны ввиде массива)
   focusTrap - Требуется ли перемещаться табом только внутри объекта (default: false)
   collapseOnFocusOut - Требуется ли закрывать при потери фокуса (default: false)
   activeClass - класс, который будет добавлен при открытии

   focusTrap - требуется ли переходить табом только по модальному окну (default: false) не работает с collapseOnFocusOut = true 
   collapseOnFocusOut - требуется ли закрывать окно при потери фокуса (default: false)

   overlay - требуется ли оверлей (default: true)
   overlayBg - цвет bg (defult: "rgba(0,0,0, 0.5)")
   overlayZindex - zindex оверлея (default: "0"),

   onClose() - Функция при закрытии
   
   m = new ModalDK({
      selector: "#modal",
      openBtnsSelector: [".btn--open"],
      focusTrap: true, // Требуется ли перемещаться табом только внутри объекта (default: false)
      collapseOnFocusOut: true, // Требуется ли закрывать при потери фокуса
      activeClass: "--active",
      Функция при закрытии
      onClose() {
         console.log("closing");
      },
   });

   Реализация в html 
   <div class="modal">
      <div class="modal__container"></div>
   </div>
    

   TODO:
   Когда добавлю aria атрибуты, то использовать их вместо класса active
   aria указывать что окно появилось
*/

class ModalDK extends NodaDK {
   #defaultOptions = {
      overlay: true,
      overlayBg: "rgba(0,0,0, 0.5)",
      overlayZindex: "0",
   };
   #OVERLAY_ANIMTAION_TIME = 300;
   #$activeOpenBtn; // Храним ноду кнопки, которой открыли, для перевода на нее фокусе, когд закроем окно
   constructor(options) {
      super(options);
      this._options = Object.assign(this.#defaultOptions, this._options);
      this._$openBtns = document.querySelectorAll(this._options.openBtnsSelector);

      this.#check();
      this.#init();
   }

   #check() {}

   #init() {
      this._$el.setAttribute("role", "dialog");
      this._$el.setAttribute("aria-modal", "true");
      this._$el.setAttribute("aria-hidden", "true");

      // Добавляем оверлей
      if (this._options.overlay) {
         const overlay = document.createElement("div");

         overlay.style.backgroundColor = this._options.overlayBg;
         overlay.style.position = "fixed";
         overlay.style.inset = "auto";
         overlay.style.opacity = 0;
         // overlay.style.display = "none";
         overlay.classList.add(this._options.selector.slice(1) + "__overlay");
         overlay.style.zIndex = this._options.overlayZindex;
         overlay.style.transition = `all ${this.#OVERLAY_ANIMTAION_TIME}ms ease`;
         overlay.addEventListener("click", this.close.bind(this));
         if (this._$el.querySelector(":first-child").style.position === "static") this._$el.querySelector(":first-child").style.position = "relative";
         this._$el.querySelector(":first-child").style.zIndex = toString(parseInt(this._options.overlayZindex) + 1);
         this._$el.insertBefore(overlay, this._$el.firstChild);
      }

      if (this._options.activeClass)
         // Убираем возможность фокуса на элементах для скрытого меню
         this._$focusableContent.forEach((element) => {
            element.tabIndex = -1;
         });

      if (this._$openBtns) {
         // События
         this._$openBtns.forEach((openBtn) => {
            openBtn.setAttribute("aria-haspopup", "dialog");
            openBtn.addEventListener("click", this.open.bind(this));
         });
      }
   }

   open() {
      setTimeout(() => {
         this.#$activeOpenBtn = document.activeElement;

         if (this._options.activeClass) {
            this._$el.classList.add(this._options.selector.slice(1) + this._options.activeClass);
            // Убираем возможность фокуса на элементах для скрытого меню
            this._$focusableContent.forEach((element) => {
               if (!element.dataset.selectLast) element.removeAttribute("tabindex");
            });
         } else super.open();
         this._$el.setAttribute("aria-hidden", "false");
         if (this._$focusableContent.length > 0) this._$focusableContent[0].focus();
         // Работа с оверлеем
         this._$el.querySelector(":first-child").style.inset = "0";
         this._$el.querySelector(":first-child").style.opacity = "1";

         document.querySelector("main").setAttribute("inert", "");
      }, 1);
   }

   close() {
      if (this._options.activeClass) {
         this._$el.classList.remove(this._options.selector.slice(1) + this._options.activeClass);
         // Убираем возможность фокуса на элементах для скрытого меню
         this._$focusableContent.forEach((element) => {
            element.tabIndex = -1;
         });
      } else super.close();

      setTimeout(() => {
         if (this.#$activeOpenBtn.tabIndex !== -1) this.#$activeOpenBtn.focus();
         if (typeof this._options.onClose === "function") this._options.onClose();
      }, 1);

      // Работа с оверлеем
      this._$el.querySelector(":first-child").style.opacity = "0";
      setTimeout(() => {
         this._$el.querySelector(":first-child").style.inset = "auto";
      }, this.#OVERLAY_ANIMTAION_TIME);

      this._$el.setAttribute("aria-hidden", "true");
      document.querySelector("main").removeAttribute("inert", "");
   }
}
