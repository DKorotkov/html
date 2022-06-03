const KEY = {
   ESC: 27,
   SPACE: 32,
   ENTER: 13,
   ARROW_LEFT: 37,
   ARROW_UP: 38,
   ARROW_RIGHT: 39,
   ARROW_DOWN: 40,
};

// Функция для перемещения фокуса по списку со стрелок и группирования элементов списка в один при переходе с помощью клавиши tab
// l - Список с элементами, i - элементы, r - требуется ли бесконечный переход между элементами
function rovingTabIndex(m = "", l, i, r = false) {
   let list;
   if (m != "") {
      let menu = document.querySelector(m);
      list = menu.querySelector(l);
   } else list = document.querySelector(l);
   let items = list.querySelectorAll(i);
   let round = r; // Определяет нужно ли перемещаться по кругу (с последнего на первый и наоборот)
   if (items.length == 0 || document.querySelector(l) === null) {
      return;
   } else {
      // Устанавливает начальные значения для элементов списка
      items.forEach((element) => {
         let role = element.getAttribute("role");
         element.setAttribute("tabindex", "-1");
         if (role === "menuitemradio" || role === "menuitemcheckbox") if (!element.hasAttribute("aria-checked")) element.setAttribute("aria-checked", "false");
      });
      list.addEventListener("keydown", checkPress);
      if (!list.hasAttribute("selected")) roving(1);
   }

   // Перемещает указатель (фокус) на заданый элемент
   function roving(n) {
      if (list.hasAttribute("selected")) {
         let n_prev = list.getAttribute("selected");
         items[n_prev - 1].setAttribute("tabindex", "-1");
      }
      list.setAttribute("selected", n);
      items[n - 1].setAttribute("tabindex", "0");
      items[n - 1].focus();
      // if (items[n-1].getAttribute("role") === 'menuitemradio' || items[n-1].getAttribute("role") === 'menuitemcheckbox')
      //    items[n-1].setAttribute('aria-checked', true);
   }

   // функция отслеживания нажатия клавиш клавиатуры
   function checkPress(e) {
      let n_prev = list.getAttribute("selected");
      if (e.keyCode === KEY.ARROW_LEFT || e.keyCode === KEY.ARROW_UP) {
         e.preventDefault();
         if (Number(n_prev) - 1 == 0 && round == true) roving(items.length);
         else if (Number(n_prev) - 1 != 0) roving(Number(n_prev) - 1);
      }
      if (e.keyCode === KEY.ARROW_RIGHT || e.keyCode === KEY.ARROW_DOWN) {
         e.preventDefault();
         if (Number(n_prev) + 1 == items.length + 1 && round == true) roving(1);
         else if (Number(n_prev) + 1 != items.length + 1) roving(Number(n_prev) + 1);
      }
   }
}

// первый параметр отвечает за определение уникального родителя для списка
// если первый параметр не задан, то имя списка(второй параметр) должен быть уникальным
// rovingTabIndex("", ".cont", ".div", true);
