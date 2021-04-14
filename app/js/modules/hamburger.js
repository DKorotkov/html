// Работа с меню бургером, управление клавиатурой и фокусом

// Скопировать в основной файл во избежании дублирования

class Hamburger {
   constructor(hamburger) {
      this.button = document.querySelector(hamburger.button);
      this.navigation = document.querySelector(hamburger.navigation);
      this.itemNavigation = document.querySelectorAll(hamburger.itemNavigation);

      this.button.addEventListener("click", this.open);
      this.button.addEventListener("keydown", this.checkPress);
      this.navigation.addEventListener("keydown", this.checkPress);

      this.test = "test";
   }

   open() {
      console.log(this);
      if (this.button.classList.contains("is-active")) {
         this.close();
         return;
      }

      this.button.classList.add("is-active");
      this.navigation.setAttribute("tabindex", "-1");
      let itemNav = this.itemNavigation;
      setTimeout(function () {
         itemNav[0].focus();
      }, 100);

      this.itemNavigation.forEach((element) => {
         element.addEventListener("focusout", this.checkFocus());
      });

      // Команды нестандартного поведения
      this.navigation.classList.add("nav--active");
      // navigation.classList.remove("nav--not-active");

      // if (!navigation.classList.contains("nav--active") && pageYOffset < 70) {
      //    header.classList.remove("header-main--before-scrolling");
      //    header.classList.remove("header-main--scrolling");
      // } else header.classList.add("header-main--scrolling");
      // if (!onceClick) addBtnInformation();
      // -------------------------------------------
   }

   checkPress(e) {
      if (e.keyCode === KEY.ESC) {
         this.close();
      }
   }

   close() {
      this.button.classList.remove("is-active");
      this.navigation.setAttribute("tabindex", "");
      this.itemNavigation.forEach((element) => {
         element.removeEventListener("focusout", this.checkFocus());
      });

      // Команды нестандартного поведения

      this.navigation.classList.remove("nav--active");
      // navigation.classList.add("nav--not-active");
      // if (!navigation.classList.contains("nav--active") && pageYOffset < 70) {
      //    header.classList.remove("header-main--before-scrolling");
      //    header.classList.remove("header-main--scrolling");
      // } else header.classList.add("header-main--scrolling");
      //--------------------------------------

      this.button.focus();
   }

   checkFocus() {
      // setTimeout(function () {
      //    if (!document.activeElement.classList.contains(hamburger.itemNavigation.slice(1)) & !document.activeElement.classList.contains(hamburger.button.slice(1)) & !document.activeElement.classList.contains(hamburger.navigation.slice(1))) close();
      // }, 1);
   }
}

let hamburger_1 = new Hamburger({
   button: ".hamburger", // Кнопка открытия\закрытия меню
   navigation: ".nav", // Меню с навгицаией по сайту
   itemNavigation: ".nav__item", // элемент навигации, по которому проходим фокусом.
});

// hamburger_1.open();
