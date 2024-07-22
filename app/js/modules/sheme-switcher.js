/**
 * Переключатель светлой и темной темы
 * 
 * 
const schemeSwitcherEl = document.querySelector('.scheme-switcher')

const schemeSwitcher = new SchemeSwitcher({
	el: schemeSwitcherEl

	В head необходимо добавить скрипт для предотвращения мерцания:
	// Загружаем цветовую схему
		const clrScheme = localStorage.getItem('color-scheme')
		if (clrScheme) {
			console.log(clrScheme)
			document.querySelector('html').style.colorScheme = clrScheme
		}
})
 */
export class SchemeSwitcher {
	constructor(options) {
		this.el = options.el
		this.radios = this.el.querySelectorAll('input[type="radio"]')

		this.setupSwitcher()
		this.setupScheme()
	}

	// Подгатавливаем переключатели при запуске
	setupSwitcher() {
		const savedScheme = this.getSavedScheme()

		if (savedScheme !== null) {
			const currentRadio = document.querySelector(`input[value=${savedScheme}]`)
			currentRadio.checked = true
		}

		;[...this.radios].forEach((radio) => {
			radio.addEventListener('change', (event) => {
				this.switchMedia(event.target.value)
			})
		})
	}
	// Устанавливаем сохраненную(системную) схемы при запуске
	setupScheme() {
		const savedScheme = this.getSavedScheme()

		if (savedScheme === null) return
		this.switchMedia(savedScheme)
	}
	// Применям схему
	switchMedia(scheme) {
		if (scheme !== 'auto') {
			const html = document.querySelector('html')
			html.style.colorScheme = scheme
			this.saveScheme(scheme)
		} else {
			html.style.colorScheme = ''
			this.clearScheme()
		}

		;[...this.radios].forEach((radio) => {
			if (scheme === 'dark') radio.style.webkitFilter = 'invert(1)'
			else radio.style.webkitFilter = 'none'
		})
	}
	// Получаем схеу из localStorage
	getSavedScheme() {
		return localStorage.getItem('color-scheme')
	}
	// Сохраняем схему в localStorage
	saveScheme(scheme) {
		localStorage.setItem('color-scheme', scheme)
	}
	// Очищаем значение в localStorage
	clearScheme() {
		localStorage.removeItem('color-scheme')
	}
}
