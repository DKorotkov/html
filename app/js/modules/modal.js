/*

   Появляеющиеся меню (эффекты появления настраиваются дополнительно).
   Возможно использовать для основной навгиации на сайте и любых других меню.
   При объявлении кнопки закрытия меню фокус перемещяется только по элементам меню (trap focus)

   data-selectFirst="true" - необходимо установить на элемент, который должн попасть в фокус при открытии модального окна 

*/

// Модальное окно основной навигации на сатйе
// modal(
//    (modalObj = {
//       activeButton: ".hamburger", // Кнопка открытия\закрытия модального окна | Обязательно для заполнения
//       modal: ".nav", // Модальное окно | Обязательно для заполнения
//       closeButton: ".nav__close", // Кнопка закрытия модального окна
//       overlay: ".overlay", // Класс для оверлэя
//       activeClass: "--active", // Класс, который будет добавляться при активации | Обязательно для заполнения
//       isRoving: "true", // Необходимо ли переещать фокус только внутри открытого модального окна
//    })
// );

function modal(modalObj) {
   const activeButton = document.querySelector(modalObj.activeButton);
   const modal = document.querySelector(modalObj.modal);
   const closeButton = document.querySelector(modalObj.closeButton);
   const overlay = document.querySelector(modalObj.overlay);
   const isRoving = modalObj.isRoving ? modalObj.isRoving : false;

   const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
   const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
   const focusableContent = modal.querySelectorAll(focusableElements);
   const lastFocusableElement = focusableContent[focusableContent.length - 1];
   const firstSelectedElement = modal.querySelector('[data-selectFirst="true"]');

   let countPressTab = 0;

   activeButton.addEventListener("mousedown", open);
   activeButton.addEventListener("keydown", checkPress);
   activeButton.setAttribute("aria-expanded", "false");

   function open() {
      if (activeButton.classList.contains(modalObj.activeButton.slice(1) + modalObj.activeClass)) {
         close();
         return;
      }
      activeButton.addEventListener("focusout", checkFocus);

      modal.addEventListener("keydown", checkPress);
      // modal.addEventListener("focusout", checkFocus);

      focusableContent.forEach((element) => {
         element.addEventListener("focusout", checkFocus);
      });

      if (closeButton) closeButton.addEventListener("click", close);

      activeButton.classList.add(modalObj.activeButton.slice(1) + modalObj.activeClass);
      activeButton.setAttribute("aria-expanded", "true");

      modal.setAttribute("tabindex", "-1");
      modal.classList.add(modalObj.modal.slice(1) + modalObj.activeClass);

      if (overlay) overlay.classList.add(modalObj.overlay.slice(1) + modalObj.activeClass);

      setTimeout(function () {
         if (firstSelectedElement) firstSelectedElement.focus();
         else firstFocusableElement.focus();
      }, 100);
   }

   function checkPress(e) {
      if (e.keyCode === KEY.ESC) {
         close();
      }
      if (e.keyCode === KEY.ENTER || e.keyCode === KEY.SPACE) {
         if (!activeButton.classList.contains(modalObj.activeButton.slice(1) + modalObj.activeClass)) open();
      }
      if (e.keyCode === KEY.TAB) {
         if (isRoving) {
            if (e.shiftKey) {
               // if shift key pressed for shift + tab combination
               if (document.activeElement === firstFocusableElement) {
                  lastFocusableElement.focus(); // add focus for the last focusable element
                  e.preventDefault();
               }
            } else {
               // if tab key is pressed
               if (document.activeElement === lastFocusableElement) {
                  // if focused has reached to last focusable element then focus first focusable element after pressing tab
                  firstFocusableElement.focus(); // add focus for the first focusable element
                  e.preventDefault();
               }
            }
         } else if (firstSelectedElement) {
            countPressTab++;
            if (countPressTab === focusableContent.length) {
               close();
               countPressTab = 0;
            }
            if (document.activeElement === lastFocusableElement) {
               // if focused has reached to last focusable element then focus first focusable element after pressing tab
               firstFocusableElement.focus(); // add focus for the first focusable element
               e.preventDefault();
            }
         }
      }
   }

   function close() {
      activeButton.removeEventListener("focusout", checkFocus);

      modal.removeEventListener("keydown", checkPress);
      // modal.removeEventListener("focusout", checkFocus);

      focusableContent.forEach((element) => {
         element.removeEventListener("focusout", checkFocus);
      });

      if (closeButton) closeButton.removeEventListener("click", close);

      activeButton.classList.remove(modalObj.activeButton.slice(1) + modalObj.activeClass);
      activeButton.setAttribute("aria-expanded", "false");

      modal.setAttribute("tabindex", "");
      modal.classList.remove(modalObj.modal.slice(1) + modalObj.activeClass);

      if (overlay) overlay.classList.remove(modalObj.overlay.slice(1) + modalObj.activeClass);

      setTimeout(function () {
         activeButton.focus();
      }, 100);
   }

   function checkFocus() {
      setTimeout(function () {
         if (!document.activeElement.closest(modalObj.modal)) {
            close();
         }
      }, 1);
   }
}
