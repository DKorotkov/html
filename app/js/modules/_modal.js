//
/*

   Появляеющиеся модальное окно (эффекты появления настраиваются дополнительно).
   Возможно использовать для основной навгиации на сайте и любых других меню или модальных окон.
   
   !нет реализации! data-select-first="true" - необходимо установить на элемент, который должн попасть в фокус при открытии модального окна
   

   data-select-last="true" - необходимо установить на элемент, который должн попасть в фокус в самый последний момент
   data-close="true" - необходимо установить на элемент, который будет закрывать модальное окно (только на элементы внутри окна)


   Объект модального окна:
   selector - селектор модального окна с которым будем работать
   openBtnsSelector - кнопки открытия (могут быть указаны ввиде массива)
   contentClass - класс, который используется для обертки содержимого "content",
   matchMedia - медиа запрос, в котором должен запускаться новый класс (none)
   dialogFullScreen - указывает открывать ли диалог (dialog) на весь экарн (default: true)

   focusTrap - требуется ли переходить табом только по модальному окну (default: false) не работает с collapseOnFocusOut = true 
   collapseOnFocusOut - требуется ли закрывать окно при потери фокуса (default: false)
   
   overlay - требуется ли оверлей (default: true)
   ovarlayClass - класс для оверлэя (default: "ovarlay")
   overlayBg - цвет bg (defult: "rgba(0,0,0, 0.5)")

   onOpen() - Функция при открытии
   onClose() - Функция при закрытии
   
   modal = new ModalDK({
      selector: "#modal",
      openBtnsSelector: [".btn--open"],
      contentClass: "content",
      mathcMedia: '(max-width: 50rem)',
      dialogFullScreen: true,
      focusTrap: true, // Требуется ли перемещаться табом только внутри объекта (default: false)
      collapseOnFocusOut: true, // Требуется ли закрывать при потери фокуса
      ovarlayClass: "overlay",
      overlay: true,
      overlayBg: "rgba(0,0,0, 0.5)",
      onOpen() {
         console.log("modal opening");
      },
      onClose() {
         console.log("modal closing");
      },
   });

   Реализация в html для dialog
   <dialog class="modal" id="modal">
      <button class="btn-modal-close" data-close="true">х</button>
      <p>Это модальное окно</p>
   </dialog>

   Реализация в html 
   <div class="modal" id="modal" hidden>
      <button class="btn-modal-close" data-close="true">х</button>
      <p>Это модальное окно</p>
   </div>
    

   TODO:
   Когда добавлю aria атрибуты, то использовать их вместо класса active
   aria указывать что окно появилось
*/

class ModalDK extends NodaDK {
	#defaultOptions = {
		dialogFullScreen: true,
		contentClass: 'content',
		overlay: true,
		ovarlayClass: 'overlay',
		overlayBg: 'rgba(0,0,0, 0.5)',
	}
	#$activeOpenBtn // Храним ноду кнопки, которой открыли, для перевода на нее фокусе, когд закроем окно
	constructor(options) {
		super(options)
		if (this.#check()) {
			this._options = Object.assign(this.#defaultOptions, this._options)
			this._$openBtns = document.querySelectorAll(this._options.openBtnsSelector)

			this.#init()
		}
	}

	#check() {
		return !this._hasErrors
	}

	#init() {
		if (this._$el.nodeName !== 'DIALOG') {
			this._$el.setAttribute('role', 'dialog')
			this._$el.setAttribute('aria-modal', 'true')
			this._$el.setAttribute('aria-hidden', 'true')
		}

		// Добавялем элемент обертку (content)
		const content = document.createElement('div')
		content.classList.add(`${this._options.selector.slice(1)}__${this._options.contentClass}`)
		content.innerHTML = this._$el.innerHTML
		this._$el.innerHTML = ''
		this._$el.appendChild(content)

		// Добавляем оверлей
		if (this._options.overlay && this._$el.nodeName !== 'DIALOG') {
			const overlay = document.createElement('div')

			overlay.style.backgroundColor = this._options.overlayBg
			overlay.style.position = 'fixed'
			overlay.style.inset = '0'
			overlay.classList.add(this._options.selector.slice(1) + '__' + this._options.ovarlayClass)
			overlay.addEventListener('click', this.close.bind(this))
			if (this._$el.querySelector(':first-child').style.position === 'static') this._$el.querySelector(':first-child').style.position = 'relative'
			this._$el.insertBefore(overlay, this._$el.firstChild)
		}

		if (this._$openBtns) {
			// События
			this._$openBtns.forEach((openBtn) => {
				openBtn.setAttribute('aria-haspopup', 'dialog')
				openBtn.addEventListener('click', this.open.bind(this))
			})
		}
	}

	_mainElClick(e) {
		super._mainElClick(e)
		if (e.target.nodeName === 'DIALOG') {
			this.close()
			return
		}
	}

	open() {
		setTimeout(() => {
			if (this._$el.getAttribute('aria-hidden') === 'false' || this._$el.hasAttribute('open')) {
				this.close()
				return
			}
			this.#$activeOpenBtn = document.activeElement

			if (this._$el.nodeName === 'DIALOG') {
				if (this._options.dialogFullScreen) this._$el.showModal()
				else this._$el.show()
			} else {
				super.open()
				this._$el.setAttribute('aria-hidden', 'false')
			}

			if (this._$focusableContent.length > 0 && !isTouchDevice()) this._$focusableContent[0].focus()
			if (typeof this._options.onOpen === 'function') this._options.onOpen()
			// setTimeout(() => {

			// }, 1);
		}, 1)
	}

	close() {
		this._$el.setAttribute('closing', '')
		const _$elLsAnim = this._$el.nodeName === 'DIALOG' ? this._$el : this._$el.querySelector(`.${this._options.selector.slice(1)}__${this._options.contentClass}`)
		if (_$elLsAnim.getAnimations().length === 0) {
			console.error(`Необходимо добавить анимацию для`, _$elLsAnim)
			this.#closing()
		} else {
			_$elLsAnim.addEventListener(
				'animationend',
				() => {
					this.#closing()
				},
				{ once: true }
			)
		}

		setTimeout(() => {
			if (this.#$activeOpenBtn.tabIndex !== -1) this.#$activeOpenBtn.focus()
			if (typeof this._options.onClose === 'function') this._options.onClose()
		}, 1)

		// document.querySelector("main").removeAttribute("inert", "");
	}

	#closing() {
		this._$el.removeAttribute('closing')
		if (this._$el.nodeName === 'DIALOG') {
			this._$el.close()
			super.destroy()
		} else {
			this._$el.setAttribute('aria-hidden', 'true')
			super.close()
		}
	}
}
