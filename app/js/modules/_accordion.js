/*

   Управление аккардионом

*/
export class Accordion {
	constructor(heading) {
		this.heading = heading
	}
	// Закрывает все панели, при открытии новой
	showOne() {
		const accordionHeading = document.querySelectorAll(this.heading)

		accordionHeading.forEach((item, key) => {
			item.addEventListener('click', () => {
				item.open
					? setTimeout(function () {
							item.open = false
					  }, 100)
					: accordionHeading.forEach((element) => {
							element.open ? (element.open = false) : null
					  })
			})
		})
	}
}

// const accordion = new Accordion(".brands__item-details");
// accordion.showOne();

/**
 * Аккордеон с анимацией (через button)
 * el - класс аккордеона
 * closeAll - определят, требуется ли закрывать остальные вкладки при открытии
 */

// const accServices = new AccordionBtn(".services__list", true);
export class AccordionBtn {
	constructor(el, closeAll = false) {
		this.accrdion = document.querySelector(el)
		this.closeAll = closeAll
		if (!this.accrdion) {
			console.error(`Не найден аккордеон - ${el}!`)
			return
		}
		this.init()
	}

	init() {
		this.accItmesBtns = this.accrdion.querySelectorAll('button[aria-expanded]')
		if (!this.accItmesBtns) console.error('Не найдены кнопки содержащие аттрибут aria-expanded')

		this.accItmesBtns.forEach((itemBtn) => {
			itemBtn.addEventListener('click', (e) => {
				const btn = e.currentTarget
				const openBtn = btn.getAttribute('aria-expanded') === 'true' ? true : false

				if (this.closeAll) {
					this.showOne(btn)
				}
				const context = btn.nextElementSibling
				if (!context || !context.hasAttribute('aria-hidden')) console.error('Не найден блок с контентом содержащий аттрибут aria-hidden')
				const openContext = context.getAttribute('aria-hidden') === 'true' ? true : false
				const heightContext = context.style.maxHeight === '' || context.style.maxHeight === '0px' ? context.scrollHeight : 0

				btn.setAttribute('aria-expanded', !openBtn)
				context.setAttribute('aria-hidden', !openContext)
				context.style.maxHeight = heightContext + 'px'
			})
		})
	}

	showOne(btn) {
		this.accItmesBtns.forEach((itemBtn) => {
			if (itemBtn !== btn) {
				itemBtn.setAttribute('aria-expanded', 'false')
				if (itemBtn.nextElementSibling.hasAttribute('aria-hidden')) {
					itemBtn.nextElementSibling.setAttribute('aria-hidden', 'true')
					itemBtn.nextElementSibling.style.maxHeight = '0px'
				}
			}
		})
	}
}
