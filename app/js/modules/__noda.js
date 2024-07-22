//
/**
 * Общий класс для работы с модулями DK
 *
 */

export class NodaDK {
	_KEYS = {
		ESC: 27,
		SPACE: 32,
		ENTER: 13,
		TAB: 9,
		ARROW_LEFT: 37,
		ARROW_UP: 38,
		ARROW_RIGHT: 39,
		ARROW_DOWN: 40,
	}
	#focusableElements = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), select, details, audio, video, object, [contenteditable=""], [contenteditable="true"], [tabindex]:not([tabindex="-1"])'
	#defaultOptions = {
		focusTrap: false,
		collapseOnFocusOut: false,
		setAttributeHidden: false, // Определяет необходимо ли к закрытому элементу добавлять аттрибут "hidden"
	}

	// #destroyed = false; // Храним информации о том уничтежен ли объект

	constructor(options) {
		this._options = Object.assign(this.#defaultOptions, options)
		this._$el = document.querySelector(this._options.selector)
	}

	check() {
		if (!this._$el) {
			console.warn(`Не найден класс - ${this._options.selector}`)
			return false
		}
		// Проверяет на соответсвие к медиа запросу
		if (typeof this._options.matchMedia !== 'undefined' && !window.matchMedia(this._options.matchMedia).matches) {
			return false
		}
		return true
	}

	init() {
		this._$el.addEventListener('click', (e) => this._mainElClick(e))
		this._$el.addEventListener('keydown', (e) => this._checkPress(e), true)
	}

	_initFocusableContent() {
		this._$lastFocusableEl = this._$el.querySelector('[data-select-last="true"]')
		this._getFocusableContent()

		// Последний элемент который будет в фокусе
		if (this._$lastFocusableEl) this._$lastFocusableEl.tabIndex = -1
		// Удаляем этот элемент (который последний в фокусе) из спсика всех элементов фокуса
		this._$focusableContent = this._$focusableContent.filter((el) => {
			if (el !== this._$lastFocusableEl) return el
		})
	}

	#focusTrapAndCollapse(e) {
		const firstFocusableEl = this._$focusableContent[0]
		const lastFocusableEl = this._$focusableContent[this._$focusableContent.length - 1]
		const needLastFocusableEl = this._$lastFocusableEl

		if (e.shiftKey) {
			/* shift + tab */ if (document.activeElement === firstFocusableEl || document.activeElement === needLastFocusableEl) {
				if (needLastFocusableEl && document.activeElement !== needLastFocusableEl && !this._options.collapseOnFocusOut) needLastFocusableEl.focus()
				else {
					if (this._options.collapseOnFocusOut) this.close()
					lastFocusableEl.focus()
				}
				e.preventDefault()
			}
		} /* tab */ else {
			if (document.activeElement === lastFocusableEl || document.activeElement === needLastFocusableEl) {
				if (needLastFocusableEl && document.activeElement !== needLastFocusableEl) needLastFocusableEl.focus()
				else {
					if (this._options.collapseOnFocusOut) this.close()
					firstFocusableEl.focus()
				}
				e.preventDefault()
			}
		}
	}

	_checkPress(e) {
		if (e.keyCode === this._KEYS.ESC) this.close()

		// Если требуется захватить фокус на элементе
		if (e.key === 'Tab' || e.keyCode === this._KEYS.TAB) {
			if (this._options.focusTrap || this._options.collapseOnFocusOut) this.#focusTrapAndCollapse(e)
		}
	}

	_mainElClick(e) {
		// Если по кнопке закрытия
		if (e.target.closest('[data-close="true"]') || e.target.dataset.close) {
			this.close()
		}
	}

	_getFocusableContent() {
		this._$focusableContent = [...this._$el.querySelectorAll(this.#focusableElements)]
	}

	open() {
		// if (this.#destroyed) return console.error(`Объект с классом - ${this._options.selector} уничтожен и не может быть "Открыт"`);
		if (this._options.activeClass) this._$el.classList.add(this._options.selector.slice(1) + this._options.activeClass)
		else this._$el.removeAttribute('hidden')

		if (typeof this._$focusableContent === 'undefined') this._initFocusableContent()

		// Для запрета прокрутки основного контента
		// window.disableScroll()
		document.body.style.overflow = 'hidden'
	}

	close() {
		if (this._options.activeClass) this._$el.classList.remove(this._options.selector.slice(1) + this._options.activeClass)
		else if (this._options.setAttributeHidden) this._$el.setAttribute('hidden', '')
		this.destroy()

		// Для прокрутки основного контента
		document.body.style.overflow = ''
	}

	destroy() {
		this._$el.removeEventListener('click', (e) => this._mainElClick(e))
		this._$el.removeEventListener('keydown', (e) => this._checkPress(e), true)
		// window.enableScroll()
		// this.#destroyed = true;
	}
}

/**
 *  ПРАВИЛА ПО СОЗДАНИЮ МОДУЛЯ
 *
 * 1. Использовать вместо селектро готовый объект. Это значит, что на вход
 * необходимо получать:
 * const el = document.qeurySelect(".el")
 *
 * const noda = New NodaDK(el, {options});
 *
 * 2. Если в процессе работы модуля создается новая нода в html, то необходимо
 * ее создавать каждый раз при открытии и удалять при закрытии, включая все
 * event Listners
 *
 * 3. Разделять функции по направляению или элемента
 */

/**
 *
 * TODO:
 * 1. переделать вывод ошибок через throw New Error
 */

export function isTouchDevice() {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
}
