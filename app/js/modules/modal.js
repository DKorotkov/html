/*

   Появляеющиеся меню (эффекты появления настраиваются дополнительно).
   Возможно использовать для основной навгиации на сайте и любых других меню.
   При объявлении кнопки закрытия меню фокус перемещяется только по элементам меню (trap focus)

*/

modal(
   (modalObj = {
      activeButton: ".hamburger", // Кнопка открытия\закрытия меню
      modal: ".nav", // Меню
      itemModal: ".nav__item", // элемент меню, по которому проходим фокусом.
      closeButton: ".nav__close", // Кнопка закрытия меню
   })
);

function modal(modalObj) {
   const activeButton = document.querySelector(modalObj.activeButton);
   const modal = document.querySelector(modalObj.modal);
   const itemModal = document.querySelectorAll(modalObj.itemModal);
   const closeButton = document.querySelector(modalObj.closeButton);

   const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
   const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
   const focusableContent = modal.querySelectorAll(focusableElements);
   const lastFocusableElement = focusableContent[focusableContent.length - 1];

   activeButton.addEventListener("mousedown", open);
   activeButton.addEventListener("keydown", checkPress);
   activeButton.setAttribute("aria-expanded", "false");

   function open() {
      if (activeButton.classList.contains("is-active")) {
         close();
         return;
      }
      activeButton.addEventListener("focusout", checkFocus);

      modal.addEventListener("keydown", checkPress);
      // modal.addEventListener("focusout", checkFocus);

      itemModal.forEach((element) => {
         element.addEventListener("focusout", checkFocus);
      });

      if (closeButton) closeButton.addEventListener("click", close);

      activeButton.classList.add("is-active");
      activeButton.setAttribute("aria-expanded", "true");

      modal.setAttribute("tabindex", "-1");
      modal.classList.add("nav--active");

      setTimeout(function () {
         itemModal[0].focus();
      }, 100);
   }

   function checkPress(e) {
      if (e.keyCode === KEY.ESC) {
         close();
      }
      if (e.keyCode === KEY.ENTER || e.keyCode === KEY.SPACE) {
         if (!activeButton.classList.contains("is-active")) open();
      }
      if (e.keyCode === KEY.TAB) {
         if (closeButton) {
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
         }
      }
   }

   function close() {
      activeButton.removeEventListener("focusout", checkFocus);

      modal.removeEventListener("keydown", checkPress);
      // modal.removeEventListener("focusout", checkFocus);

      itemModal.forEach((element) => {
         element.removeEventListener("focusout", checkFocus);
      });

      if (closeButton) closeButton.removeEventListener("click", close);

      activeButton.classList.remove("is-active");
      activeButton.setAttribute("aria-expanded", "false");

      modal.setAttribute("tabindex", "");
      modal.classList.remove("nav--active");

      activeButton.focus();
   }

   function checkFocus() {
      setTimeout(function () {
         if (!document.activeElement.closest(modalObj.modal)) {
            close();
         }
      }, 1);
   }
}
