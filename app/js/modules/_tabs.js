//
/**
 *
 * Структа работы с Вкладками (табами)
 *
 * selector - определяет корневую ноду, это "tablist"
 * tabItem - определяет ноду для "tabitem"
 * initialIndex - индекс вкладки, которая открыта по умолчанию (default: 0)
 * matchMedia - медиа запрос, в котором должен запускаться новый класс (none)
 * focusTrap - требуется ли переходить табом только по модальному окну (default: false) не работает с collapseOnFocusOut = true 
   collapseOnFocusOut - требуется ли закрывать окно при потери фокуса (default: false)
 * 
 * const tabs = new TabsDk({
      selector: ".tablist",
      tabItem: ".tabitem",
      initialIndex: 0,
      focusTrap: true, // Требуется ли перемещаться табом только внутри объекта (default: false)
      collapseOnFocusOut: true, // Требуется ли закрывать при потери фокуса
      mathcMedia: '(max-width: 50rem)',
   });


   Пример html:
   tabs:
   <ul class="resume__tablist">
      <li class="resume__tabitem"><a href="#education">Образование</a></li>
      <li class="resume__tabitem"><a href="#experience">Работа</a></li>
   </ul>

   panels:
   <div class="resume__tabpanel" id="education">education</div>
   <div class="resume__tabpanel" id="experience">experience</div>

 */

class TabsDk extends NodaDK {
	#defaultOptions = {
		initialIndex: 0,
	}
	constructor(options) {
		super(options)
		if (this.#check()) {
			this._options = Object.assign(this.#defaultOptions, this._options)

			this.#init()
			this.#initARIA()
		}
	}

	#check() {
		return !this._hasErrors
	}

	#init() {
		this._initialIndex = this._options.initialIndex
		this._$tabList = this._$el
		this._$tabs = [...this._$el.querySelectorAll(this._options.tabItem)]
		this._$links = [...this._$el.querySelectorAll(`${this._options.tabItem} > a`)]
		this._$panels = []
		if (this._$tabs.length !== this._$links.length) console.error(`Недопустимое количество ссылок в элементах табов - ${this._options.tabItem}`)
		this._$links.forEach((link) => {
			const id = link.getAttribute('href').slice(1)
			this._$panels.push(document.querySelector(`#${id}`))
		})
		this._$panels.filter((el, i) => i !== this._initialIndex).forEach((el) => (el.hidden = true))
	}

	#initARIA() {
		this._$tabList.setAttribute('role', 'tablist')
		this._$tabs.forEach((el) => el.setAttribute('role', 'tab'))
		this._$panels.forEach((el) => {
			const id = el.getAttribute('id')
			el.setAttribute('role', 'tabpanel')
			el.setAttribute('aria-labelledby', 'tab-' + id)
		})
		this._$links.forEach((el) => {
			const id = el.getAttribute('href').slice(1)
			el.setAttribute('role', 'presentation')
			el.setAttribute('id', 'tab-' + id)
			el.setAttribute('aria-controls', id)
			el.removeAttribute('href')
		})
		this._$tabs[this._initialIndex].setAttribute('aria-selected', 'true')
		this._$tabs[this._initialIndex].tabIndex = 0
	}

	_checkPress(e) {
		let index = this._initialIndex
		if (e.keyCode === this._KEYS.ARROW_RIGHT || e.keyCode === this._KEYS.ARROW_DOWN) {
			index++
			if (index === this._$tabs.length) index = 0
			this.open(index)
			e.preventDefault()
		} else if (e.keyCode === this._KEYS.ARROW_LEFT || e.keyCode === this._KEYS.ARROW_UP) {
			index--
			if (index < 0) index = this._$tabs.length - 1
			this.open(index)
			e.preventDefault()
		}
	}

	_mainElClick(e) {
		if (e.target.getAttribute('role') === 'presentation') this.open(this._$tabs.indexOf(e.target.parentElement))
	}

	open(index) {
		this._close()
		this._$tabs[index].setAttribute('aria-selected', 'true')
		this._$tabs[index].tabIndex = 0
		this._$tabs[index].focus()
		this._$panels[index].hidden = false
		this._initialIndex = index
	}

	_close() {
		this._$tabs[this._initialIndex].setAttribute('aria-selected', 'false')
		this._$tabs[this._initialIndex].removeAttribute('tabindex')
		this._$panels[this._initialIndex].hidden = true
	}
}
