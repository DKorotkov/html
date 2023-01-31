/**
 *
 * Структа по созданию кастомного select
 *
 * Для мобильных версий должен отражаться нативный select, для пк кастомный
 *
 * Для отслеживания изменений в кастомном select можно использовать: addEventListener("menuchange", {})
 *
 */

export default class SelectDK {
	constructor(options) {
		this.constructorOptions = options
		this.init()
	}

	static init() {
		this._KEYS = {
			ESC: 27,
			SPACE: 32,
			ENTER: 13,
			TAB: 9,
			ARROW_LEFT: 37,
			ARROW_UP: 38,
			ARROW_RIGHT: 39,
			ARROW_DOWN: 40,
		}
		this._defaultOptions = {
			selectClassName: 'select',
		}
		this._options = Object.assign(this._defaultOptions, this.constructorOptions)
		this._selectMultiple = []

		this._$selects = document.querySelectorAll('select')
		if (!this._$selects) return

		this._$selects.forEach((select, i) => {
			this._selectMultiple[i] = select.hasAttribute('multiple')
			this._makeCustom(select, i)

			select.addEventListener('change', (e) => this._setCustomValue(e, i))
		})
		this._initCustom()
		this.menuEvent = new Event('menuchange')
	}

	static _makeCustom(select, i) {
		const _$selectParent = select.parentElement
		const _$selectOptions = [...select.querySelectorAll('option')]
		const _$selectMenu = document.createElement('div')
		const _$selectButton = document.createElement('button')
		const _$selectPopup = document.createElement('ul')

		const _selectedOption = {
			value: _$selectOptions[0].getAttribute('value'),
			text: _$selectOptions[0].innerHTML,
		}

		_$selectParent.classList.add(`${this._options.selectClassName}`)
		select.classList.add(`${this._options.selectClassName}__native`)
		_$selectMenu.classList.add(`${this._options.selectClassName}__menu`)
		_$selectButton.classList.add(`${this._options.selectClassName}__button`)
		_$selectPopup.classList.add(`${this._options.selectClassName}__popup`)

		_$selectOptions.forEach((option, l) => {
			const _$selectOption = document.createElement('li')
			_$selectOption.tabIndex = -1
			if (this._selectMultiple[i]) {
				_$selectOption.setAttribute('role', 'menuitemcheckbox')
				_$selectOption.setAttribute('aria-checked', 'false')
			} else {
				_$selectOption.setAttribute('role', 'menuitem')
			}

			if (l === 0) {
				if (!this._selectMultiple[i]) _$selectOption.setAttribute('aria-checked', 'true')
				_$selectOption.tabIndex = 0
			}

			if (option.hasAttribute('selected') && i !== 0) {
				_selectedOption.value = option.getAttribute('value')
				_selectedOption.text = option.innerHTML
				_$selectOption.setAttribute('aria-checked', 'true')

				if (!this._selectMultiple[i]) {
					_$selectOption.tabIndex = 0
					_$selectPopup.firstChild.removeAttribute('aria-checked')
					_$selectPopup.firstChild.tabIndex = -1
				}
			}

			_$selectOption.classList.add(`${this._options.selectClassName}__option`)
			_$selectOption.setAttribute('data-value', option.getAttribute('value'))
			_$selectOption.innerHTML = option.innerHTML
			_$selectPopup.appendChild(_$selectOption)
			// Трудоемко и требует отслеживания по родитею, но blur без фокусировки не работает
			_$selectOption.addEventListener('blur', (e) => this._handleBlur(e, i))
		})

		_$selectButton.innerHTML = _selectedOption.text

		//----Стилизация-----
		if (select.hasAttribute('disabled')) _$selectButton.setAttribute('disabled', '')
		if (this._selectMultiple[i]) _$selectMenu.setAttribute('multiple', '')
		if (select.hasAttribute('size')) _$selectMenu.style.setProperty('--size', select.getAttribute('size'))
		if (!select.hasAttribute('open') && !this._selectMultiple[i]) _$selectPopup.hidden = true

		//----ARIA-----------
		_$selectMenu.setAttribute('role', 'menu')
		_$selectButton.setAttribute('type', 'button')
		_$selectButton.setAttribute('aria-expanded', 'false')
		_$selectButton.setAttribute('aria-haspopup', 'true')

		//----Events---------
		_$selectMenu.addEventListener('click', (e) => this._click(e, i))
		_$selectMenu.addEventListener('keydown', (e) => this._checkPress(e, i), true)

		_$selectMenu.appendChild(_$selectButton)
		_$selectMenu.appendChild(_$selectPopup)
		_$selectParent.appendChild(_$selectMenu)
	}

	static _initCustom() {
		// this._$selectList = [...document.querySelectorAll(`.${this._options.selectClassName}__menu`)];
		this._$popups = [...document.querySelectorAll(`.${this._options.selectClassName}__popup`)]
		this._$buttons = [...document.querySelectorAll(`.${this._options.selectClassName}__button`)]
	}

	static _handleBlur(e, selectNumber) {
		if (this._selectMultiple[selectNumber]) return
		const currentTarget = e.currentTarget
		requestAnimationFrame(() => {
			if (!currentTarget.closest(`.${this._options.selectClassName}__menu`).contains(document.activeElement)) {
				this._closeSelect(selectNumber)
			}
		})
	}

	static _click(e, selectNumber = null) {
		if (e.target.classList.contains(`${this._options.selectClassName}__option`)) {
			this._changeOptionByClick(e.target, selectNumber)
			if (!this._selectMultiple[selectNumber]) this._closeSelect(selectNumber)
		} else if (e.target.classList.contains(`${this._options.selectClassName}__button`)) this.toggleOpenSelect(selectNumber)
	}

	static _checkPress(e, selectNumber) {
		if (e.keyCode === this._KEYS.ESC && !this._selectMultiple[selectNumber]) {
			this._closeSelect(selectNumber)
			return
		}

		if (e.keyCode === this._KEYS.ARROW_UP || e.keyCode === this._KEYS.ARROW_LEFT) {
			e.preventDefault()
			this._changeOptionToPrev(selectNumber)
			return
		}

		if (e.keyCode === this._KEYS.ARROW_DOWN || e.keyCode === this._KEYS.ARROW_RIGHT) {
			e.preventDefault()
			this._changeOptionToNext(selectNumber)
			return
		}

		// Если открыт select
		if (!this._$popups[selectNumber].hasAttribute('hidden')) {
			if (e.keyCode === this._KEYS.ENTER) {
				e.preventDefault()
				if (!this._selectMultiple[selectNumber]) this._closeSelect(selectNumber)
				else this._changeOptionByClick(e.target, selectNumber)
				return
			}
		}
	}

	//select func
	static toggleOpenSelect(selectNumber) {
		if (this._$popups[selectNumber].hasAttribute('hidden')) this._openSelect(selectNumber)
		else this._closeSelect(selectNumber)
	}

	static _openSelect(selectNumber) {
		this._$popups[selectNumber].hidden = false
		this._$popups[selectNumber].previousSibling.setAttribute('aria-expanded', 'true')
		this._$popups[selectNumber].querySelector('[tabindex="0"]').focus({ focusVisible: true })
	}

	static _closeSelect(selectNumber) {
		this._$popups[selectNumber].hidden = true
		this._$popups[selectNumber].previousSibling.setAttribute('aria-expanded', 'false')
		this._$popups[selectNumber].previousSibling.focus({ focusVisible: true })
	}

	// btn func
	static _setButtonByOption(option, selectNumber) {
		this._$buttons[selectNumber].innerText = option.innerText
	}

	// option func
	static _getCurrentOption(selectNumber) {
		return this._$popups[selectNumber].querySelector('[tabindex="0"]')
	}

	static _getOptionsValues(selectNumber) {
		const options = [...this._$popups[selectNumber].querySelectorAll(`.${this._options.selectClassName}__option`)]
		return options.map((option) => {
			return option.getAttribute('aria-checked')
		})
	}

	static _resetOption(option) {
		option.tabIndex = -1
		option.removeAttribute('aria-checked')
	}

	static _setOption(option) {
		option.tabIndex = 0
		option.setAttribute('aria-checked', 'true')
		option.focus({ focusVisible: true })
	}

	static _changeOptionByClick(option, selectNumber) {
		const _$currentOption = this._getCurrentOption(selectNumber)
		if (!this._selectMultiple[selectNumber]) {
			this._resetOption(_$currentOption)
			this._setOption(option)

			this._setButtonByOption(option, selectNumber)
			this._setNativeValue(selectNumber, option.dataset.value)
		}
		// если multiple
		else {
			const ariaChecked = option.getAttribute('aria-checked') === 'true' ? false : true
			// _$currentOption.tabIndex = -1;
			option.setAttribute('aria-checked', ariaChecked)
			// option.tabIndex = 0;
			this._setNativeValue(selectNumber, this._getOptionsValues(selectNumber))
		}
	}

	static _changeOptionToNext(selectNumber) {
		const _$currentOption = this._getCurrentOption(selectNumber)
		if (_$currentOption.nextSibling !== null) {
			if (!this._selectMultiple[selectNumber]) {
				this._resetOption(_$currentOption)
				this._setOption(_$currentOption.nextSibling)

				this._setButtonByOption(_$currentOption.nextSibling, selectNumber)
				this._setNativeValue(selectNumber, _$currentOption.nextSibling.dataset.value)
			} else {
				_$currentOption.tabIndex = -1
				_$currentOption.nextSibling.tabIndex = 0
				_$currentOption.nextSibling.focus({ focusVisible: true })
			}
		}
	}

	static _changeOptionToPrev(selectNumber) {
		const _$currentOption = this._getCurrentOption(selectNumber)
		if (_$currentOption.previousSibling !== null) {
			if (!this._selectMultiple[selectNumber]) {
				this._resetOption(_$currentOption)
				this._setOption(_$currentOption.previousSibling)

				this._setButtonByOption(_$currentOption.previousSibling, selectNumber)
				this._setNativeValue(selectNumber, _$currentOption.previousSibling.dataset.value)
			} else {
				_$currentOption.tabIndex = -1
				_$currentOption.previousSibling.tabIndex = 0
				_$currentOption.previousSibling.focus({ focusVisible: true })
			}
		}
	}

	//native select func
	static _setNativeValue(selectNumber, value) {
		if (!this._selectMultiple[selectNumber]) this._$selects[selectNumber].value = value
		// если multiple
		else {
			const nativeOptions = this._$selects[selectNumber].options

			value.forEach((optionCustomValue, i) => {
				optionCustomValue = optionCustomValue === 'true' ? true : false
				nativeOptions[i].selected = optionCustomValue
			})
		}
		this._$selects[selectNumber].dispatchEvent(this.menuEvent)
	}

	static _setCustomValue(e, selectNumber) {
		if (!this._selectMultiple[selectNumber]) {
			const value = e.currentTarget.value
			const _$currentOption = this._getCurrentOption(selectNumber)
			const _$toSetOption = this._$popups[selectNumber].querySelector(`[data-value="${value}"]`)
			this._resetOption(_$currentOption)
			this._setOption(_$toSetOption)
			this._setButtonByOption(_$toSetOption, selectNumber)
		} else {
			const nativeOptions = this._$selects[selectNumber].options
			const customOptions = this._$popups[selectNumber].querySelectorAll(`.${this._options.selectClassName}__option`)
			for (let i = 0; i < nativeOptions.length; i++) {
				customOptions[i].setAttribute('aria-checked', nativeOptions[i].selected)
			}
		}
	}
}
