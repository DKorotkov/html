function menuButton(menuBtn) {
   let menu = document.querySelector(menuBtn.menu);
   let button = menu.querySelector(menuBtn.button);
   let list = menu.querySelector(menuBtn.list);
   let items = list.querySelectorAll(menuBtn.item);
   let label;
   if (menuBtn.label) label = menu.querySelector(menuBtn.label);
   rovingTabIndex(menuBtn.menu, menuBtn.list, menuBtn.item, menuBtn.roving);
   button.addEventListener("click", open);
   button.addEventListener("keydown", checkPress);

   function open() {
      list.hidden = false;
      list.setAttribute("tabindex", "-1");
      items[list.getAttribute("selected") - 1].focus();
      list.addEventListener("keydown", checkPress);
      items.forEach((element, index) => {
         element.addEventListener("click", () => {
            select(index);
            close();
         });
         if (menuBtn.collapseOnFocusOut == true) element.addEventListener("focusout", checkFocus);
      });
   }

   function checkPress(e) {
      if (list.hidden == false) {
         if (e.keyCode === KEY.ENTER || e.keyCode === KEY.SPACE) {
            e.preventDefault();
            select(list.getAttribute("selected") - 1);
            close();
         }
         if (e.keyCode === KEY.ESC) {
            e.preventDefault();
            close();
         }
      }
      if (list.hidden == true) {
         let n_prev = list.getAttribute("selected");
         let n;

         n = Number(n_prev) - 1;
         if (e.keyCode === KEY.ARROW_LEFT) {
            // e.preventDefault();
            if (n != 0) select(n - 1);
         }
         if (e.keyCode === KEY.ARROW_RIGHT) {
            // e.preventDefault();
            if (n_prev < items.length) select(Number(n_prev));
         }
      }
   }

   function select(n) {
      list.setAttribute("selected", n + 1);
      items.forEach((element) => {
         element.setAttribute("tabindex", "-1");
      });
      items[n].setAttribute("tabindex", "0");
      button.textContent = items[n].textContent;
      if (label) label.classList.remove("clipped");
   }

   function close() {
      list.hidden = true;
      list.setAttribute("tabindex", "");
      button.focus();
      list.removeEventListener("keydown", checkPress);
      items.forEach((element, index) => {
         element.removeEventListener("click", () => {
            select(index);
            close();
         });
         if (menuBtn.collapseOnFocusOut == true) element.removeEventListener("focusout", checkFocus);
      });
   }

   function checkFocus() {
      setTimeout(function () {
         if (!document.activeElement.classList.contains(menuBtn.item.slice(1)) && !document.activeElement.classList.contains(menuBtn.list.slice(1))) close();
      }, 1);
   }
}

// menuButton(
//    (menu1 = {
//       menu: ".menu-button__price", // Уникальный элемент с которым необходимо взаимодействие
//       button: ".menu-button__button", // Главные элемент управления меню
//       list: ".menu-button__menu", // Блок одержащий список всех элементов
//       item: ".menu-button__item", // Элементы которыми будем управлять
//       roving: true, // Требуется ли повтор хождения фокуса по элементам
//       collapseOnFocusOut: false, // Требуется ли закрывать при потери фокуса
//       label: ".menu-button__label", // подсказка к меню выбора (появляется когда был сделан выбор)
//    })
// );
