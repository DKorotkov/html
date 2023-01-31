// --------------------------------Свайп события---------------------------------------

// const element = {
//    className: "#contacts",
//    swipeRightFunction: function () {
//       alert("right");
//    },
//    swipeLeftFunction: function () {
//       alert("left");
//    },
//    swipeDownFunction: function () {
//       alert("down");
//    },
//    swipeUpFunction: function () {
//       alert("up");
//    },
// };

// const cont = new EventTouch(element);
export default class EventTouch {
	constructor(element) {
		this.element = element
		this.object = document.querySelector(this.element.className)

		if (!this.object) {
			console.error(`Не найден объект ${className} для свайп событий`)
			return
		}

		this.init()
	}

	init() {
		// this.object.addEventListener("touchstart", (e) => this.handleTouchStart(e), false);
		// this.object.addEventListener("touchmove", (e) => this.handleTouchMove(e), false);

		this.object.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true })
		this.object.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true })

		this.xDown = null
		this.yDown = null
	}

	getTouches(evt) {
		return (
			evt.touches || // browser API
			evt.originalEvent.touches
		) // jQuery
	}

	handleTouchStart(evt) {
		const firstTouch = this.getTouches(evt)[0]
		this.xDown = firstTouch.clientX
		this.yDown = firstTouch.clientY
	}

	handleTouchMove(evt) {
		if (!this.xDown || !this.yDown) {
			return
		}

		const xUp = evt.touches[0].clientX
		const yUp = evt.touches[0].clientY

		const xDiff = this.xDown - xUp
		const yDiff = this.yDown - yUp

		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			/*most significant*/
			if (xDiff > 0) {
				this.element.swipeRightFunction()
			} else {
				this.element.swipeLeftFunction()
			}
		} else {
			if (yDiff > 0) {
				this.element.swipeDownFunction()
			} else {
				this.element.swipeUpFunction()
			}
		}
		/* reset values */
		this.xDown = null
		this.yDown = null
	}
}

// ------------------------------------------------------------------------------------
