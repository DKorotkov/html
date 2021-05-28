/*

   Управление аккардионом

*/
class Accordion {
   constructor(heading) {
      this.heading = heading;
   }
   // Закрывает все панели, при открытии новой
   showOne() {
      const accordionHeading = document.querySelectorAll(this.heading);

      accordionHeading.forEach((item, key) => {
         item.addEventListener("click", () => {
            item.open
               ? setTimeout(function () {
                    item.open = false;
                 }, 100)
               : accordionHeading.forEach((element) => {
                    element.open ? (element.open = false) : null;
                 });
         });
      });
   }
}

// const accordion = new Accordion(".brands__item-details");
// accordion.showOne();
