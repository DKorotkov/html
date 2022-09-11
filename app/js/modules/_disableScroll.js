// // left: 37, up: 38, right: 39, down: 40,
// // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
// var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function scrollPreventDefault(e) {
   e.preventDefault();
}

// function preventDefaultForScrollKeys(e) {
//    if (keys[e.keyCode]) {
//       preventDefault(e);
//       return false;
//    }
// }

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
   window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
         get: function () {
            supportsPassive = true;
         },
      })
   );
} catch (e) {}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// call this to Disable
window.disableScroll = () => {
   window.addEventListener("DOMMouseScroll", scrollPreventDefault, false); // older FF
   window.addEventListener(wheelEvent, scrollPreventDefault, wheelOpt); // modern desktop
   window.addEventListener("touchmove", scrollPreventDefault, wheelOpt); // mobile
   // window.addEventListener("keydown", scrollPreventDefaultForScrollKeys, false);
};

// call this to Enable
window.enableScroll = () => {
   window.removeEventListener("DOMMouseScroll", scrollPreventDefault, false);
   window.removeEventListener(wheelEvent, scrollPreventDefault, wheelOpt);
   window.removeEventListener("touchmove", scrollPreventDefault, wheelOpt);
   // window.removeEventListener("keydown", scrollPreventDefaultForScrollKeys, false);
};

// class DisableScroll {
//    constructor() {
//       this.supportsPassive = false;
//       this.init();
//    }

//    init() {
//       try {
//          window.addEventListener(
//             "test",
//             null,
//             Object.defineProperty({}, "passive", {
//                get: function () {
//                   this.supportsPassive = true;
//                },
//             })
//          );
//       } catch (e) {}

//       this.wheelOpt = this.supportsPassive ? { passive: false } : false;
//       this.wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
//    }

//    preventDefault(e) {
//       e.preventDefault();
//    }

//    // call this to Disable
//    disable() {
//       console.log(this.supportsPassive);
//       window.addEventListener("DOMMouseScroll", this.preventDefault, false); // older FF
//       window.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt); // modern desktop
//       window.addEventListener("touchmove", this.preventDefault, this.wheelOpt); // mobile
//       // window.addEventListener("keydown", this.preventDefaultForScrollKeys, false);
//    }

//    // call this to Enable
//    enable() {
//       window.removeEventListener("DOMMouseScroll", this.preventDefault, false);
//       window.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt);
//       window.removeEventListener("touchmove", this.preventDefault, this.wheelOpt);
//       // window.removeEventListener("keydown", this.preventDefaultForScrollKeys, false);
//    }
// }

// const disableScroll = new DisableScroll();
