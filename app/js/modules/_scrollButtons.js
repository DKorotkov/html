//
/**
 * Задает кнопкам функционал пролистывания элементов в блоках с переполнением. Например: при создании галереи требуется пролистывать изображения
 * 
 * el - элемент, которым необходимо управлять
 * classBtnNext - кнопка перехода к следующему элементу
 * classPrevNext - кнопка перехода к прошлому элементу
 * 
 * const navBtns = new ScrollerBtns(el, {
 * 	classBtnNext: '',
 * 	classPrevNext: '',
 * })
 * Пример html:
 * <div class="section__btns">
		<button class="btn btn-navigation btn-navigation--prev" aria-label="следующие карточки">туда</button>
		<button class="btn btn-navigation btn-navigation--next" aria-label="предыдущие карточки">сюда</button>
	</div>

	<ul class="list">
		<li class="item">Единица пролистывания</li>
		<li class="item">Единица пролистывания</li>
		<li class="item">Единица пролистывания</li>
	</ul>
 */
export class ScrollBtns {
	// #defaultOptions = {}
	constructor(obj, _options) {
		// this._options = Object.assign(this.#defaultOptions, this._options)
		// if (!this.obj) {
		// 	console.error(`Не найден объект ${obj} для создания управления пролистыванием`)
		// 	return
		// }
		// this.init()
	}

	init() {
		// this.scroll = this.scrollerObj.querySelector(this.obj.classScroll)
		const nextBtn = this.scrollerObj.querySelector(this.obj.classBtnNext)
		const prevBtn = this.scrollerObj.querySelector(this.obj.classPrevNext)

		nextBtn.addEventListener('click', () => this.next())
		prevBtn.addEventListener('click', () => this.prev())

		this.stepSize = this.obj.clientWidth
		this.items = this.obj.childNodes

		console.log(this.stepSize, this.items)
	}

	next() {
		const itemPos = this.items[this.items.length - 1].getBoundingClientRect().left + this.stepSize
		const scrollerWidth = this.scrollerObj.offsetWidth + this.scrollerObj.offsetLeft
		if (itemPos < scrollerWidth) this.scroll.scrollLeft = 0
		else this.scroll.scrollLeft = this.scroll.scrollLeft + this.stepSize * this.obj.step
	}

	prev() {
		if (this.scroll.scrollLeft === 0) this.scroll.scrollLeft = this.scrollerObj.clientWidth
		else this.scroll.scrollLeft = this.scroll.scrollLeft - this.stepSize * this.obj.step
	}
}
