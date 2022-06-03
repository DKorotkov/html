/**
 * Общий класс для работы с модулями DK
 *
 *
 */

class NodaDK {
   _KEYS = {
      ESC: 27,
      SPACE: 32,
      ENTER: 13,
      TAB: 9,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40,
   };
   #focusableElements = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), select, details, audio, video, object, [contenteditable=""], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
   #defaultOptions = {
      focusTrap: false,
      collapseOnFocusOut: false,
   };

   #destroyed = false; // Храним информации о том уничтежен ли объект

   constructor(options) {
      this._options = Object.assign(this.#defaultOptions, options);
      this._$el = document.querySelector(this._options.selector);
      this._$focusableContent = [...this._$el.querySelectorAll(this.#focusableElements)];
      this._$lastFocusableEl = this._$el.querySelector('[data-select-last="true"]');

      this.#check();
      this.#init();
   }

   #check() {
      if (!this._$el) {
         console.error(`Не найден класс - ${this._options.selector}`);
         return;
      }
   }

   #init() {
      this._$el.addEventListener("click", (e) => this._mainElClick(e));
      this._$el.addEventListener("keydown", (e) => this._checkPress(e), true);

      // Последний элемент который будет в фокусе
      if (this._$lastFocusableEl) this._$lastFocusableEl.tabIndex = -1;
   }

   #focusTrapAndCollapse(e) {
      const firstFocusableEl = this._$focusableContent[0];
      const lastFocusableEl = this._$focusableContent[this._$focusableContent.length - 1];
      const needLastFocusableEl = this._$lastFocusableEl;

      if (e.shiftKey) {
         /* shift + tab */ if (document.activeElement === firstFocusableEl || document.activeElement === needLastFocusableEl) {
            if (needLastFocusableEl && document.activeElement !== needLastFocusableEl && !this._options.collapseOnFocusOut) needLastFocusableEl.focus();
            else {
               if (this._options.collapseOnFocusOut) this.close();
               lastFocusableEl.focus();
            }
            e.preventDefault();
         }
      } /* tab */ else {
         if (document.activeElement === lastFocusableEl || document.activeElement === needLastFocusableEl) {
            if (needLastFocusableEl && document.activeElement !== needLastFocusableEl) needLastFocusableEl.focus();
            else {
               if (this._options.collapseOnFocusOut) this.close();
               firstFocusableEl.focus();
            }
            e.preventDefault();
         }
      }
   }

   _checkPress(e) {
      if (e.keyCode === this._KEYS.ESC) this.close();

      // Если требуется захватить фокус на элементе
      if (e.key === "Tab" || e.keyCode === this._KEYS.TAB) {
         if (this._options.focusTrap || this._options.collapseOnFocusOut) this.#focusTrapAndCollapse(e);
      }
   }

   _mainElClick(e) {
      // Если по кнопке закрытия
      if (e.target.dataset.close) {
         this.close();
      }
   }

   open() {
      if (this.#destroyed) return console.error(`Объект с классом - ${this._options.selector} уничтожен и не может быть "Открыт"`);
      this._$el.removeAttribute("hidden", "");
   }

   close() {
      this.destroy();
      this._$el.setAttribute("hidden", "");
   }

   destroy() {
      this.#destroyed = true;
      this._$el.removeEventListener("click", (e) => this._mainElClick(e));
      this._$el.removeEventListener("keydown", (e) => this._checkPress(e), true);
   }
}
