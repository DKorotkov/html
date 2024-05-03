//----------------------------ШРИФТЫ------------------------------------------------------------
// var Raleway = new FontFaceObserver("Raleway");

// Загружаем все шрифты сразу Здесь лучше загружать шрифты, которые не являются основными, но находяться в верхней части страницы.
// Promise.all([Montserrat.load()]).then(function () {
//    console.log("Montserrat загружен");
// });
var FontFaceObserver = require('fontfaceobserver')

export function loadFont() {
	var mainFont = new FontFaceObserver('Fira Sans')
	var html = document.documentElement

	if (html.classList.contains('fonts-loading')) {
		mainFont
			.load()
			.then(function () {
				html.classList.remove('fonts-loading')
				html.classList.add('fonts-loaded')
				sessionStorage.fontsLoaded = true // Загружаем в кэш
			})
			.catch(function () {
				html.classList.remove('fonts-loading')
				html.classList.add('fonts-failed')
				sessionStorage.fontsLoaded = false
			})
	}
}
// Добавлем необходимые классы при загрузке нужного шрифта

// Здесь лучше загружать шрифты которые не основные и находяться в нижней части страницы
// Montserrat.load().then(function () {
//    console.log("Загружен Input Mono");
// });
// ________________________________________________________________________________________________________________
