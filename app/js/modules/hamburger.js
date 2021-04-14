// Работа с меню бургером, управление клавиатурой и фокусом

hamburger(
   (hum = {
      button: ".hamburger", // Кнопка открытия\закрытия меню
      navigation: ".nav", // Меню с навгицаией по сайту
      itemNavigation: ".nav__item", // элемент навигации, по которому проходим фокусом.
   })
);

function hamburger(hamburger) {
   const button = document.querySelector(hamburger.button);
   const navigation = document.querySelector(hamburger.navigation);
   const itemNavigation = document.querySelectorAll(hamburger.itemNavigation);

   button.addEventListener("click", open);
   button.addEventListener("keydown", checkPress);
   button.addEventListener("focusout", checkFocus);

   navigation.addEventListener("keydown", checkPress);

   function open() {
      if (button.classList.contains("is-active")) {
         close();
         return;
      }

      button.classList.add("is-active");
      navigation.setAttribute("tabindex", "-1");
      setTimeout(function () {
         itemNavigation[0].focus();
      }, 100);

      itemNavigation.forEach((element) => {
         element.addEventListener("focusout", checkFocus);
      });

      navigation.classList.add("nav--active");
   }

   function checkPress(e) {
      if (e.keyCode === KEY.ESC) {
         close();
      }
   }

   function close() {
      button.classList.remove("is-active");
      navigation.setAttribute("tabindex", "");
      itemNavigation.forEach((element) => {
         element.removeEventListener("focusout", checkFocus);
      });

      if (document.activeElement.classList.contains(hamburger.itemNavigation.slice(1))) button.focus();

      navigation.classList.remove("nav--active");
   }

   function checkFocus() {
      setTimeout(function () {
         if (!document.activeElement.classList.contains(hamburger.itemNavigation.slice(1)) & !document.activeElement.classList.contains(hamburger.button.slice(1)) & !document.activeElement.classList.contains(hamburger.navigation.slice(1))) close();
      }, 1);
   }
}
