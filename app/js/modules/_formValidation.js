// Для валидации формы на сайте
export default class FormValid {
	constructor(options) {
		this.constructorOptions = options
		this.init()
	}

	static init() {
		const defaultOptions = {
			formClassName: 'form',
			errorClassName: 'error',
			inputClassName: 'form__input',
			invalidClassName: 'invalid',
			withValueClassName: 'not-empty',
			errors: {
				required: 'Заполните обязательное поле',
				email: 'Пожалуйста, введите правильный email',
				type: 'Не соответствует формату поля',
				pattern: 'Не соответствует формату поля',
				tooShort: 'Слишком короткое',
				tooLong: 'Слишком динное',
				stepMismatch: 'Неверный шаг (введенный диапозон)',
				rangeUnderflow: 'Меньше диапозона',
				rangeOverflow: 'Больше диапозона',
				customError: 'Ошибка',
				badInput: 'badInput',
			},
		}
		this.options = Object.assign(defaultOptions, this.constructorOptions)

		this.forms = document.querySelectorAll('form')
		if (!this.forms) console.error('Форма на странице не найдена')

		this.forms.forEach((form) => {
			// form.setAttribute("novalidate", "");
			let inputs = [...form.querySelectorAll('input')]
			const textarea = [...form.querySelectorAll('textarea')]
			inputs = inputs.concat(textarea)

			inputs.forEach((input) => {
				// Добавялем елемент для вывода ошибок
				const error = document.createElement('span')
				error.classList.add(`${this.options.formClassName}__${this.options.errorClassName}`)
				error.setAttribute('aria-live', 'polite')
				input.insertAdjacentElement('afterend', error)

				input.addEventListener('blur', (e) => {
					this.validate(e)
					this.isEmpty(e)
				})
			})

			form.addEventListener('submit', (e) => {
				this.checkValid(e)
			})
		})
	}

	// Проверяем пустое ли поле
	static isEmpty(input) {
		if (input.target) input = input.target
		if (input.value.length > 0) input.classList.add(`${this.options.inputClassName}--${this.options.withValueClassName}`)
		else input.classList.remove(`${this.options.inputClassName}--${this.options.withValueClassName}`)
	}

	// Проверяем поля на валидацию
	static validate(input) {
		if (input.target) input = input.target
		const error = input.nextElementSibling
		// const inputType = input.getAttribute("type");
		// let pattern = input.getAttribute("pattern");

		if (!input.validity.valid) {
			// Проверка на обязательное поле
			if (input.validity.valueMissing) {
				this.setInvalid(input, this.options.errors.required)
				return error
			}
			// Проверка по типу
			if (input.validity.typeMismatch) {
				this.setInvalid(input, this.options.errors.type)
				return error
			}
			// Проверка по паттерну
			if (input.validity.patternMismatch) {
				this.setInvalid(input, this.options.errors.pattern)
				return error
			}
			// Проверка слишком короткое
			if (input.validity.tooShort) {
				this.setInvalid(input, this.options.errors.tooShort)
				return error
			}
			// Проверка слишком короткое
			if (input.validity.tooLong) {
				this.setInvalid(input, this.options.errors.tooLong)
				return error
			}
			// Проверка слишком короткое
			if (input.validity.stepMismatch) {
				this.setInvalid(input, this.options.errors.stepMismatch)
				return error
			}
			// Проверка меньше диапозона
			if (input.validity.rangeUnderflow) {
				this.setInvalid(input, this.options.errors.rangeUnderflow)
				return error
			}
			// Проверка больше диапозона
			if (input.validity.rangeOverflow) {
				this.setInvalid(input, this.options.errors.rangeOverflow)
				return error
			}
			// Проверка кастомная ошибка
			if (input.validity.customError) {
				this.setInvalid(input, this.options.errors.customError)
				return error
			}
			// Проверка badInput
			if (input.validity.badInput) {
				this.setInvalid(input, this.options.errors.badInput)
				return error
			}
		}

		input.classList.remove(`${this.options.inputClassName}--${this.options.invalidClassName}`)
		error.innerHTML = ''
	}

	// Сообщаем об ошибке валидации
	static setInvalid(input, text) {
		const error = input.nextElementSibling
		input.classList.add(`${this.options.inputClassName}--${this.options.invalidClassName}`)
		error.innerHTML = text
	}

	// Проверят поля перед отправкой, в случае, если по ним не проходили или не заметили ошибку
	static checkValid(e) {
		let errorElements = new Array()
		const form = typeof e.currentTarget === 'object' ? e.currentTarget : e
		const inputs = form.querySelectorAll('input')

		if (typeof e.currentTarget === 'object') e.preventDefault()
		inputs.forEach((input) => {
			errorElements.push(this.validate(input))
		})

		errorElements = errorElements.filter(function (element) {
			return element !== undefined
		})

		if (errorElements.length === 0) {
			form.submit()
			return true
		}

		errorElements[0].previousSibling.focus()
	}
}

// -----------Проверка валидация формы-------------------
FormValid.init()
// ------------------------------------------------------

// Вынести этот модуль ввиде отдельного проекта, вывести на гитхаб с описанием

// -----------Пример работы с кнопкой формы отправки без submit----------------
// const submitBtns = document.querySelectorAll(".appointment-form__submit");
// submitBtns.forEach((submitBtn) => {
//    submitBtn.addEventListener("click", (e) => {
//       const thisForm = e.currentTarget.closest("form");
//       if (FormValid.checkValid(thisForm)) {
//          console.log("Отправляем форму");
//       }
//    });
// });
