// Для валидации формы на сайте
class FormValid {
   constructor(options) {
      this.constructorOptions = options;
      this.init();
   }

   static init() {
      const defaultOptions = {
         errorClassName: "error",
         inputClassName: "input",
         invalidClassName: "invalid",
         errors: {
            required: "Это поле обязательное",
            email: "Пожалуйста, введите правильный email",
            type: "Не соответствует формату поля",
            pattern: "Не соответствует формату поля",
            tooShort: "Слишком короткое",
            tooLong: "Слишком динное",
            stepMismatch: "Неверный шаг (введенный диапозон)",
            rangeUnderflow: "Меньше диапозона",
            rangeOverflow: "Больше диапозона",
            customError: "Ошибка",
            badInput: "badInput",
         },
      };
      this.options = Object.assign(defaultOptions, this.constructorOptions);

      this.forms = document.querySelectorAll("form");
      if (!this.forms) {
         console.error("Форма на странице не найдена");
         return;
      }

      this.forms.forEach((form) => {
         // form.setAttribute("novalidate", "");
         const inputs = form.querySelectorAll("input");

         inputs.forEach((input) => {
            // Добавялем елемент для вывода ошибок
            const error = document.createElement("span");
            error.classList.add(this.options.errorClassName);
            error.setAttribute("aria-live", "polite");
            input.insertAdjacentElement("afterend", error);

            input.addEventListener("blur", (e) => this.validate(e));
         });

         form.addEventListener("submit", (e) => {
            this.checkValid(e, inputs);
         });
      });
   }

   // Проверяем поля на валидацию
   static validate(input) {
      if (input.target) input = input.target;
      const error = input.nextElementSibling;
      // const inputType = input.getAttribute("type");
      // let pattern = input.getAttribute("pattern");

      if (!input.validity.valid) {
         // Проверка на обязательное поле
         console.log(input.validity);
         if (input.validity.valueMissing) {
            this.setInvalid(input, this.options.errors.required);
            return error;
         }
         // Проверка по типу
         if (input.validity.typeMismatch) {
            this.setInvalid(input, this.options.errors.type);
            return error;
         }
         // Проверка по паттерну
         if (input.validity.patternMismatch) {
            this.setInvalid(input, this.options.errors.pattern);
            return error;
         }
         // Проверка слишком короткое
         if (input.validity.tooShort) {
            this.setInvalid(input, this.options.errors.tooShort);
            return error;
         }
         // Проверка слишком короткое
         if (input.validity.tooLong) {
            this.setInvalid(input, this.options.errors.tooLong);
            return error;
         }
         // Проверка слишком короткое
         if (input.validity.stepMismatch) {
            this.setInvalid(input, this.options.errors.stepMismatch);
            return error;
         }
         // Проверка меньше диапозона
         if (input.validity.rangeUnderflow) {
            this.setInvalid(input, this.options.errors.rangeUnderflow);
            return error;
         }
         // Проверка больше диапозона
         if (input.validity.rangeOverflow) {
            this.setInvalid(input, this.options.errors.rangeOverflow);
            return error;
         }
         // Проверка кастомная ошибка
         if (input.validity.customError) {
            this.setInvalid(input, this.options.errors.customError);
            return error;
         }
         // Проверка badInput
         if (input.validity.badInput) {
            this.setInvalid(input, this.options.errors.badInput);
            return error;
         }
      }

      // Проверка на required
      // if (input.hasAttribute("required") && input.value == "") {
      //    this.setInvalid(input, this.options.errors.required);
      //    return error;
      // }
      // // Проверка по паттерну
      // if (pattern) {
      //    const ptr = new RegExp(pattern, "g");
      //    const patternResult = input.value.match(ptr);
      //    if (!patternResult) {
      //       this.setInvalid(input, this.options.errors.pattern);
      //       return error;
      //    }
      // }
      // // Проверки для поля "почта"
      // if (inputType === "email")
      //    if (!input.value.includes("@")) {
      //       // заменить данную проверку на паттерн, который будет браться из html данного input
      //       this.setInvalid(input, this.options.errors.email);
      //       return error;
      //    }

      input.classList.remove(`${this.options.inputClassName}--${this.options.invalidClassName}`);
      error.innerHTML = "";
   }

   // Сообщаем об ошибке валидации
   static setInvalid(input, text) {
      const error = input.nextElementSibling;
      input.classList.add(`${this.options.inputClassName}--${this.options.invalidClassName}`);
      error.innerHTML = text;
   }

   // Проверят поля перед отправкой, в случае, если по ним не проходили или не заметили ошибку
   static checkValid(e, inputs) {
      let errorElements = new Array();
      e.preventDefault();
      inputs.forEach((input) => {
         errorElements.push(this.validate(input));
      });

      errorElements = errorElements.filter(function (element) {
         return element !== undefined;
      });

      if (errorElements.length === 0) {
         e.target.closest("form").submit();
         return;
      }

      errorElements[0].previousSibling.focus();
   }
}

// Вынести этот модуль ввиде отдельного проекта, вывести на гитхаб с описанием
// Кнопка если не субмит
// ввиде заданного экземпляра как работать будет
