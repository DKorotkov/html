(function () {
   "use strict";

   // Загрузка шрифтов через скрипт
   //    var font = new FontFaceObserver("Pangolin");
   //    var html = document.documentElement;

   //    font
   //       .load()
   //       .then(function () {
   //          html.classList.remove("fonts-loading");
   //          html.classList.add("fonts-loaded");
   //          sessionStorage.fontsLoaded = true;
   //       })
   //       .catch(function () {
   //          html.classList.remove("fonts-loading");
   //          html.classList.add("fonts-failed");
   //          sessionStorage.fontsLoaded = false;
   //       });
   gsap.registerPlugin(ScrollTrigger);

   let sections = gsap.utils.toArray(".section");
   sections.forEach((section, i) => {
      // Анимация пролистывания страниц
      gsap.to(section, {
         scrollTrigger: {
            trigger: section,
            start: "top top",
            snap: 1,
         },
      });
      // Секция Инфо
      section.info = section.querySelector(".info");
      // gsap.fromTo(
      //    section.info,
      //    { yPercent: 200 },
      //    {
      //       yPercent: -200,
      //       scrollTrigger: {
      //          trigger: section,
      //          start: "top center",
      //          // end: "bottom center",
      //          markers: true,
      //          scrub: 1,
      //       },
      //    }
      // );
      // Секция img
      section.img = section.querySelector(".section__img-wrapper");
      gsap.fromTo(
         section.img,
         { opacity: 0, className: "section__img-wrapper--fixed" },
         {
            opacity: 1,
            scrollTrigger: {
               trigger: section,
               start: "top center",
               end: "bottom center",
               // markers: true,
               toggleActions: "restart reverse restart reverse",
            },
         }
      );
   });

   // ---------
})();
