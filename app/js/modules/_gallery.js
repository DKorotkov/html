// ---------------------------Галерея изображений-----------------------------------
/**
 *
 *
 * data-gallery - для передачи больших изображений
 * 
 * Объект модального окна:
   selector - селектор модального окна с которым будем работать
   openBtnsSelector - кнопки открытия (могут быть указаны ввиде массива)
   closeBtnsSelector: - кнопки закрытия (могут быть указаны ввиде массива)
   description - требуется ли выводить описсание из тэга alt (true)
   imgsList - трбуется ли создавать список изображений (true)
   matchMedia - медиа запрос, в котором должен запускаться новый класс (none)

   data-close="true" - необходимо установить на элемент, который будет закрывать модальное окно (только на элементы внутри окна)
   data-select-last="true" - необходимо установить на элемент, который должн попасть в фокус в самый последний момент
   data-gallery="http://localhost:3000/img/cert/1-1.jpg" - ссылка на файл, большого размера

   g = new GalleryDK({
      selector: ".gallery", // селектор контейнера, который объединяет все изображения
      focusTrap: true,
      collapseOnFocusOut: false,
   });

   * TODO:
   * ?Добавить знак загрузки
   * ?При двойном нажатии увеличивать в точке нажатия

 */
class GalleryDK extends NodaDK {
   #defaultOptions = {
      description: true,
      imgsList: true,
   };
   #activeImgNum;
   #elPadding;
   #ANIMTAION_TIME = 300;
   #tapedTwice = false;

   constructor(options) {
      super(options);
      if (this.#check()) {
         this._options = Object.assign(this.#defaultOptions, this._options);
         this._$originalImgs = [...this._$el.querySelectorAll("img")];
         this.#init();
      }
   }

   #check() {
      return !this._hasErrors;
   }

   #init() {
      // Проходим по оригинальным изображениям
      this._$originalImgs.map((img, i) => {
         img.style.cursor = "zoom-in";
         img.setAttribute("data-id", i);
      });
   }

   #initOnOpen() {
      this.#createGallery();
      this.#elPadding = parseInt(getComputedStyle(this._$el).getPropertyValue("padding-left"));

      this._$galleryMainImg = this._$el.querySelector(".gallery-dk__img");
      this._$imgPreviewList = [...this._$el.querySelectorAll("[data-id]")];
      super._getFocusableContent();

      this._onTouchStart = this._onTouchStart.bind(this);
      this._onTouchEnd = this._onTouchEnd.bind(this);
      this._onTouchMove = this._onTouchMove.bind(this);

      this.#initTouchListners();
   }

   #initTouchListners() {
      // this._$galleryMainImg.addEventListener("pointerdown", this._onTouchStart);
      // this._$galleryMainImg.addEventListener("pointerup", this._onTouchEnd);
      // this._$galleryMainImg.addEventListener("pointermove", this._onTouchMove);
      this._$galleryMainImg.addEventListener("touchstart", this._onTouchStart);
      this._$galleryMainImg.addEventListener("touchend", this._onTouchEnd);
      this._$galleryMainImg.addEventListener("touchmove", this._onTouchMove);
   }

   #destroyTouchListners() {
      this._$galleryMainImg.removeEventListener("touchstart", this._onTouchStart);
      this._$galleryMainImg.removeEventListener("touchend", this._onTouchEnd);
      this._$galleryMainImg.removeEventListener("touchmove", this._onTouchMove);
   }

   #createGallery() {
      // Создаем галерею
      const $galleryDK = document.createElement("div");
      $galleryDK.classList.add("gallery-dk");
      if (!this._options.imgsList) $galleryDK.classList.add("gallery-dk--no-list");
      $galleryDK.setAttribute("hidden", "");
      $galleryDK.setAttribute("aria-live", "polite");
      $galleryDK.innerHTML = this.#getTemaplate();
      this._$el.insertAdjacentElement("beforeend", $galleryDK);

      const $imgsList = $galleryDK.querySelector(".gallery-dk__list");
      // Проходим по оригинальным изображениям
      this._$originalImgs.map((img, i) => {
         if (this._options.imgsList) {
            // Добавляем изображения
            const imgPreview = img.cloneNode(true);
            imgPreview.removeAttribute("class");
            imgPreview.removeAttribute("style");

            imgPreview.setAttribute("data-id", i);
            imgPreview.setAttribute("aria-selected", "false");
            imgPreview.tabIndex = 0;
            // imgPreview.addEventListener("click", (e) => {
            //    this.setImg(i);
            // });
            $imgsList.appendChild(imgPreview);
         }
      });

      this._$el = $galleryDK;
   }

   #getTemaplate() {
      const descriptionClipped = this._options.description ? "" : "clipped";
      const list = this._options.imgsList ? '<ul class="gallery-dk__list" role="list"></ul>' : "";
      return `<div class="gallery-dk__btns-wrapper">
                  <button class="gallery-dk__to-left" data-prev="true" aria-label="предыдущее изображение"></button>
                  <button class="gallery-dk__to-right" data-next="true"  aria-label="следующее изображение"></button>
                  <button class="gallery-dk__zoom" data-zoom="true" aria-label="увеличить изображение">

                    <?xml version="1.0" ?><svg class="gallery-dk__zoom-svg" data-zoom="true" enable-background="new 0 0 32 32" id="Editable-line" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="14" cy="14" fill="none" id="XMLID_94_" r="9"  stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><line fill="none" id="XMLID_93_"  stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="27" x2="20.366" y1="27" y2="20.366"/><line fill="none" id="XMLID_96_"  stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="14" x2="14" y1="10" y2="18"/><line fill="none" id="XMLID_97_"  stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="10" x2="18" y1="14" y2="14"/></svg>

                  </button>
                  <button class="gallery-dk__close" data-close="true" data-select-last="true" aria-label="закрыть галерею"></button>
               </div>
               <div class="gallery-dk__img-wrapper">
                  <div class="gallery-dk__img" aria-labelledby="gallery-dk-description" role="img"></div>
                  <span id="gallery-dk-description" class="gallery-dk__info scroll--v ${descriptionClipped}"></span>
                  
               </div>
               ${list}`;
   }

   destroy() {
      this.#destroyTouchListners();

      this._$el.remove();
      setTimeout(() => {
         this._$el = document.querySelector(this._options.selector);
      }, 1);
   }

   _checkPress(e) {
      if (e.keyCode === this._KEYS.ESC && this._$galleryMainImg.classList.contains("gallery-dk__img--zoom")) {
         this._stopZoom();
         return;
      }
      super._checkPress(e);

      if (e.keyCode === this._KEYS.ENTER) {
         if (e.target.dataset.id) this.setImg(e.target.dataset.id);
      }

      // стрелка вправо и вниз
      if (e.keyCode === this._KEYS.ARROW_RIGHT || e.keyCode === this._KEYS.ARROW_DOWN) {
         e.preventDefault();
         this.nextImg();
      }
      // стрелка влево и вверх
      if (e.keyCode === this._KEYS.ARROW_LEFT || e.keyCode === this._KEYS.ARROW_UP) {
         e.preventDefault();
         this.prevImg();
      }
   }

   _mainElClick(e) {
      super._mainElClick(e);
      // Если по кнопке закрытия
      if (e.target.dataset.id) {
         const id = e.target.dataset.id;
         if (!this._$el.classList.contains("gallery-dk--active")) this.open();
         this.setImg(id);
         this._$galleryMainImg.style.opacity = 0;
      } else if (e.target.closest('[data-next="true"]') || e.target.dataset.next) this.nextImg();
      else if (e.target.closest('[data-prev="true"]') || e.target.dataset.prev) this.prevImg();
      else if (e.target.closest('[data-zoom="true"]') || e.target.dataset.zoom) this._zoomImg();
   }

   open() {
      super.open();
      this.#initOnOpen();
      this._$el.classList.add("gallery-dk--active");
      if (this._$focusableContent.length > 0) this._$focusableContent[0].focus();
   }

   close() {
      super.close();
      this._$el.classList.remove("gallery-dk--active");
      this.destroy();
   }

   // ---------Работа с изображением----------
   setImg(imgNum) {
      this.#activeImgNum = imgNum;

      // Действия с центральным изображением
      this._$galleryMainImg.classList.add("gallery-dk__img--change");
      this._$galleryMainImg.style.backgroundImage = `url('${this._getImgSrc(imgNum)}')`;

      this._getImgBackgroundSize().then((data) => {
         const posEl = this._$galleryMainImg.parentNode.getBoundingClientRect();
         if (data.w < posEl.width && data.h < posEl.height) this._$galleryMainImg.style.backgroundSize = "auto";
         else this._$galleryMainImg.style.backgroundSize = "contain";
      });

      // Действия с листом привью
      if (this._options.imgsList) {
         this._$imgPreviewList.map((img) => {
            img.setAttribute("aria-selected", "false");
         });

         this._$imgPreviewList[imgNum].setAttribute("aria-selected", "true");
         this._$imgPreviewList[imgNum].focus();
      }

      // Действия с описанием
      this._$galleryMainImg.parentNode.querySelector(".gallery-dk__info").innerHTML = this._$originalImgs[imgNum].getAttribute("alt") ? this._$originalImgs[imgNum].getAttribute("alt") : "";

      // Сброс стилизаций и позиций
      setTimeout(() => {
         this._setMainImgStylePos("left", "0");
         this._$galleryMainImg.style.opacity = 1;
         this._$galleryMainImg.classList.remove("gallery-dk__img--change");
      }, 1);
   }

   _getImgSrc(imgNum) {
      let $currentImg = this._$originalImgs[imgNum];
      const imgClass = $currentImg.querySelector("img"); // !Проверяем тэг ли это picture или уже img
      $currentImg = imgClass ? imgClass : $currentImg;

      // Проверяем есть ли дата атрибут для большого изображения
      const dataSrc = $currentImg.dataset.gallery;
      if (typeof dataSrc !== "undefined") {
         const tempImg = new Image();
         tempImg.src = dataSrc;
         if (tempImg.width > 0) return dataSrc;
      }
      return $currentImg.src;
   }

   nextImg() {
      this._setMainImgStylePos("left", -1 * window.innerWidth);

      this.#activeImgNum = this.#activeImgNum++ === this._$originalImgs.length - 1 ? 0 : this.#activeImgNum;
      setTimeout(() => {
         this._setMainImgStylePos("left", window.innerWidth);
         this.setImg(this.#activeImgNum);
      }, this.#ANIMTAION_TIME);
   }

   prevImg() {
      this._setMainImgStylePos("left", window.innerWidth);
      this.#activeImgNum = this.#activeImgNum-- === 0 ? this._$originalImgs.length - 1 : this.#activeImgNum;
      setTimeout(() => {
         this._setMainImgStylePos("left", -1 * window.innerWidth);
         this.setImg(this.#activeImgNum);
      }, this.#ANIMTAION_TIME);
   }
   // ----------------------------------

   // ---------Работа с зумом----------
   _zoomImg(e) {
      let scaleBg = 1.2;
      this._isZooming = true;
      this._$galleryMainImg.classList.add("gallery-dk__img--zoom");
      this._$galleryMainImg.parentElement.classList.add("gallery-dk__img-wrapper--zoom");
      this._$galleryMainImg.style.backgroundSize = "cover";

      const parrentW = this._$galleryMainImg.parentElement.clientWidth - this.#elPadding * 2;
      const parrentH = this._$galleryMainImg.parentElement.clientHeight - this.#elPadding * 2;
      this._getImgBackgroundSize().then((data) => {
         let w = data.w;
         let h = data.h;
         // console.log(data.w > parrentW);
         // console.log(parrentH);
         if (data.w > parrentW * scaleBg || data.h > parrentH * scaleBg) {
            let zoomFactor;
            if (data.w > data.h) {
               zoomFactor = parrentW / data.w;
               w = parrentW;
               h = data.h * zoomFactor;
            } else {
               zoomFactor = parrentH / data.h;
               w = data.w * zoomFactor;
               h = parrentH;
            }
         }
         this._$galleryMainImg.style.backgroundSize = `${w * scaleBg}px ${h * scaleBg}px`;
         if (isTouchDevice()) {
            scaleBg = 2;
            // this._$galleryMainImg.classList.add("gallery-dk__img--touch");
            this._$galleryMainImg.style.backgroundSize = `cover`;
            this._$galleryMainImg.style.width = `${w * scaleBg}px`;
            this._$galleryMainImg.style.height = `${h * scaleBg}px`;
         } else this._startZoom();
      });

      // this._$galleryMainImg.style.backgroundSize = `${parrentW * scaleBg}px ${parrentH * scaleBg}px`;
   }

   _startZoom() {
      this._mouseMoveMainImg = this._mouseMoveMainImg.bind(this);
      this._$galleryMainImg.addEventListener("mousemove", this._mouseMoveMainImg, false);

      this._stopZoom = this._stopZoom.bind(this);
      this._$galleryMainImg.addEventListener("click", this._stopZoom, false);
   }

   _stopZoom() {
      this._isZooming = false;

      if (isTouchDevice()) {
         this.#initTouchListners();
         this._$galleryMainImg.style.width = "";
         this._$galleryMainImg.style.height = "";
         this._$galleryMainImg.classList.remove("gallery-dk__img--touch");
         document.body.style.zoom = "100%";
      }

      this._$galleryMainImg.style.backgroundPosition = ``;

      this._$galleryMainImg.classList.remove("gallery-dk__img--zoom");
      this._$galleryMainImg.parentElement.classList.remove("gallery-dk__img-wrapper--zoom");
      this._$galleryMainImg.removeEventListener("mousemove", this._mouseMoveMainImg, false);
      this._$galleryMainImg.removeEventListener("click", this._stopZoom, false);

      this._$imgPreviewList[this.#activeImgNum].focus();
      this.setImg(this.#activeImgNum);
   }

   _mouseMoveMainImg(e) {
      const posEl = this._$galleryMainImg.parentElement.getBoundingClientRect();

      const stepSizeX = +this._$galleryMainImg.style.backgroundSize.split("px")[0] > posEl.width ? (e.offsetX / (posEl.width - this.#elPadding * 2)) * 100 + "%" : "center";

      const stepSizeY = +this._$galleryMainImg.style.backgroundSize.split("px")[1] > posEl.height ? (e.offsetY / (posEl.height - this.#elPadding * 2)) * 100 + "%" : "center";

      this._$galleryMainImg.style.backgroundPosition = `${stepSizeX} ${stepSizeY}`;
   }

   _getImgBackgroundSize() {
      const imageSrc = this._$galleryMainImg.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, "$2").split(",")[0];
      const image = new Image();
      image.src = imageSrc;

      return new Promise(function (resolve, reject) {
         image.onload = function () {
            const w = image.width;
            const h = image.height;
            resolve({ w, h });
            // height = image.height;
         };
      });
   }
   // -----------------------------------------

   // ---------Работа с тач событиями----------
   _onTouchStart(e) {
      // Если двайное нажатие
      if (e.touches.length === 1 && this._tapTwiceDetection.bind(this)(e)) {
         // if (this._tapTwiceDetection.bind(this)(e)) {
         if (!this._isZooming) this._zoomImg(e);
         else this._stopZoom();
         return;
      }

      // Если тянут
      this._startDrag(e);
   }

   _onTouchEnd(e) {
      if (this._scaling) this._stopScale(e);
      else if (this._direction) this._stopDrag(e);
   }

   _onTouchMove(e) {
      if (this._scaling) this._onScaling(e);
      else this._dragging(e);
   }

   //  Тянем изображение влево\вправо, вверх\вниз
   _startDrag(e) {
      this._direction = false; // так же служит флагом это события

      this._clickX = e.pageX;
      this._clickY = e.pageY;
      this._$galleryMainImg.classList.add("gallery-dk__img--on-drag");
   }

   _stopDrag(e) {
      // window.removeEventListener("pointermove", this._dragging);
      const closePercent = 0.5;
      const posEl = this._$galleryMainImg.getBoundingClientRect();
      const closePos = posEl.height * closePercent;

      this._$galleryMainImg.classList.remove("gallery-dk__img--on-drag");
      if (this._direction === "left") {
         if (posEl.x < -70) this.nextImg();
         else if (posEl.x > 70) this.prevImg();
         else this._setMainImgStylePos("left", "0");
      } else if (this._direction === "top") if (posEl.y > closePos || posEl.y < -closePos) this.close();

      this._setMainImgStylePos("top", "0");
      this._$el.style.opacity = 1;

      this._direction = false;
   }

   _dragging(e) {
      if (this._isZooming) return;

      const dragX = e.pageX;
      const dragY = e.pageY;
      const dragShiftX = dragX - this._clickX;
      const dragShiftY = dragY - this._clickY;
      // if (Math.abs(dragShiftX) > 20 || Math.abs(dragShiftY) > 20) drag = true;
      if (!this._direction && Math.abs(dragShiftX) + Math.abs(dragShiftY) > 20) {
         if (Math.abs(dragShiftX) > Math.abs(dragShiftY)) {
            this._direction = "left";
         } else this._direction = "top";
      } else {
         if (this._direction === "left") this._setMainImgStylePos("left", dragShiftX);
         else if (this._direction === "top") {
            this._setMainImgStylePos("top", dragShiftY);
            this._makeGalleryTransparent();
         }
      }
   }

   _setMainImgStylePos(direction, shift) {
      this._$galleryMainImg.style.setProperty(direction, `${shift}px`);
   }

   _makeGalleryTransparent() {
      const posEl = this._$galleryMainImg.getBoundingClientRect();
      const transparentPercernt = 0.7;
      const transparentPos = posEl.height * transparentPercernt; // Количесвто пикселей, когда opacity будет 0 (от центра)
      this._$el.style.opacity = 1 - Math.abs(posEl.y) / transparentPos;
   }

   _tapTwiceDetection(e) {
      if (!this.#tapedTwice) {
         this.#tapedTwice = true;
         setTimeout(() => {
            this.#tapedTwice = false;
         }, 300);
         return false;
      }
      e.preventDefault();
      return true;
   }
   //_______________________
   // -----------------------------------------
}
