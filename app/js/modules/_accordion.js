/*

   Управление аккардионом

*/

// const accordionEl = document.querySelector('.accordion')
// if (accordionEl) {
// 	new Accordion(accordionEl)
// }
export class Accordion {
	constructor(el) {
		this.el = el
		this.init()
	}

	init() {
		this.detailsItems = this.el.querySelectorAll('details')
		this.accList = []
		this.detailsItems.forEach((detail) => {
			const currentAccordion = new AccordionAnimation(detail)
			this.accList.push(currentAccordion)
			detail.addEventListener('toggle', (e) => this.onToggle(e, currentAccordion))
		})
	}

	onToggle(e, currentAccordion) {
		if (e.target.open) {
			this.el.querySelectorAll('details[open]').forEach((el) => {
				// Исключаем из перебора елемент который мы только что открыли
				if (el === e.target) return
				// Закрываем все остальные елементы <details>
				this.accList.forEach((item) => {
					if (currentAccordion !== item) {
						item.el.style.overflow = 'hidden'
						item.shrink()
					}
				})
			})
		}
	}
}

class AccordionAnimation {
	constructor(el) {
		// Store the <details> element
		this.el = el
		// Store the <summary> element
		this.summary = el.querySelector('summary')
		// Store the <div class="content"> element
		this.content = el.querySelector('.accordion__content')

		// Store the animation object (so we can cancel it if needed)
		this.animation = null
		// Store if the element is closing
		this.isClosing = false
		// Store if the element is expanding
		this.isExpanding = false
		// Detect user clicks on the summary element
		this.summary.addEventListener('click', (e) => this.onClick(e))
	}

	onClick(e) {
		// Stop default behaviour from the browser
		e.preventDefault()
		// Add an overflow on the <details> to avoid content overflowing
		this.el.style.overflow = 'hidden'
		// Check if the element is being closed or is already closed
		if (this.isClosing || !this.el.open) {
			this.open()
			// Check if the element is being openned or is already open
		} else if (this.isExpanding || this.el.open) {
			this.shrink()
		}
	}

	shrink() {
		// Set the element as "being closed"
		this.isClosing = true

		// Store the current height of the element
		const startHeight = `${this.el.offsetHeight}px`
		// Calculate the height of the summary
		const endHeight = `${this.summary.offsetHeight}px`

		// If there is already an animation running
		if (this.animation) {
			// Cancel the current animation
			this.animation.cancel()
		}

		// Start a WAAPI animation
		this.animation = this.el.animate(
			{
				// Set the keyframes from the startHeight to endHeight
				height: [startHeight, endHeight],
			},
			{
				duration: 300,
				easing: 'ease-out',
			}
		)

		// When the animation is complete, call onAnimationFinish()
		this.animation.onfinish = () => this.onAnimationFinish(false)
		// If the animation is cancelled, isClosing variable is set to false
		this.animation.oncancel = () => (this.isClosing = false)
	}

	open() {
		// Apply a fixed height on the element
		this.el.style.height = `${this.el.offsetHeight}px`
		// Force the [open] attribute on the details element
		this.el.open = true
		// Wait for the next frame to call the expand function
		window.requestAnimationFrame(() => this.expand())
	}

	expand() {
		// Set the element as "being expanding"
		this.isExpanding = true
		// Get the current fixed height of the element
		const startHeight = `${this.el.offsetHeight}px`
		// Calculate the open height of the element (summary height + content height)
		const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`

		// If there is already an animation running
		if (this.animation) {
			// Cancel the current animation
			this.animation.cancel()
		}

		// Start a WAAPI animation
		this.animation = this.el.animate(
			{
				// Set the keyframes from the startHeight to endHeight
				height: [startHeight, endHeight],
			},
			{
				duration: 400,
				easing: 'ease-out',
			}
		)
		// When the animation is complete, call onAnimationFinish()
		this.animation.onfinish = () => this.onAnimationFinish(true)
		// If the animation is cancelled, isExpanding variable is set to false
		this.animation.oncancel = () => (this.isExpanding = false)
	}

	onAnimationFinish(open) {
		// Set the open attribute based on the parameter
		this.el.open = open
		// Clear the stored animation
		this.animation = null
		// Reset isClosing & isExpanding
		this.isClosing = false
		this.isExpanding = false
		// Remove the overflow hidden and the fixed height
		this.el.style.height = this.el.style.overflow = ''
	}
}

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
