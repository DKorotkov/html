/*! lazysizes - v5.2.2 */

!(function (e, t) {
   var a = function () {
      t(e.lazySizes), e.removeEventListener("lazyunveilread", a, !0);
   };
   (t = t.bind(null, e, e.document)),
      "object" == typeof module && module.exports
         ? t(require("lazysizes"))
         : "function" == typeof define && define.amd
         ? define(["lazysizes"], t)
         : e.lazySizes
         ? a()
         : e.addEventListener("lazyunveilread", a, !0);
})(window, function (e, z, g) {
   "use strict";
   var c, y, b, f, i, s, n, v, m;
   e.addEventListener &&
      ((c = g.cfg),
      (y = /\s+/g),
      (b = /\s*\|\s+|\s+\|\s*/g),
      (f = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/),
      (i = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/),
      (s = /\(|\)|'/),
      (n = { contain: 1, cover: 1 }),
      (v = function (e, t) {
         var a;
         t &&
            ((a = t.match(i)) && a[1]
               ? e.setAttribute("type", a[1])
               : e.setAttribute("media", c.customMedia[t] || t));
      }),
      (m = function (e) {
         var t, a, i, r;
         e.target._lazybgset &&
            ((a = (t = e.target)._lazybgset),
            (i = t.currentSrc || t.src) &&
               ((r = g.fire(a, "bgsetproxy", {
                  src: i,
                  useSrc: s.test(i) ? JSON.stringify(i) : i,
               })).defaultPrevented ||
                  (a.style.backgroundImage = "url(" + r.detail.useSrc + ")")),
            t._lazybgsetLoading &&
               (g.fire(a, "_lazyloaded", {}, !1, !0),
               delete t._lazybgsetLoading));
      }),
      addEventListener("lazybeforeunveil", function (e) {
         var t, a, i, r, s, n, l, d, o, u;
         !e.defaultPrevented &&
            (t = e.target.getAttribute("data-bgset")) &&
            ((o = e.target),
            ((u = z.createElement("img")).alt = ""),
            (u._lazybgsetLoading = !0),
            (e.detail.firesLoad = !0),
            (a = t),
            (i = o),
            (r = u),
            (s = z.createElement("picture")),
            (n = i.getAttribute(c.sizesAttr)),
            (l = i.getAttribute("data-ratio")),
            (d = i.getAttribute("data-optimumx")),
            i._lazybgset &&
               i._lazybgset.parentNode == i &&
               i.removeChild(i._lazybgset),
            Object.defineProperty(r, "_lazybgset", { value: i, writable: !0 }),
            Object.defineProperty(i, "_lazybgset", { value: s, writable: !0 }),
            (a = a.replace(y, " ").split(b)),
            (s.style.display = "none"),
            (r.className = c.lazyClass),
            1 != a.length || n || (n = "auto"),
            a.forEach(function (e) {
               var t,
                  a = z.createElement("source");
               n && "auto" != n && a.setAttribute("sizes", n),
                  (t = e.match(f))
                     ? (a.setAttribute(c.srcsetAttr, t[1]),
                       v(a, t[2]),
                       v(a, t[3]))
                     : a.setAttribute(c.srcsetAttr, e),
                  s.appendChild(a);
            }),
            n &&
               (r.setAttribute(c.sizesAttr, n),
               i.removeAttribute(c.sizesAttr),
               i.removeAttribute("sizes")),
            d && r.setAttribute("data-optimumx", d),
            l && r.setAttribute("data-ratio", l),
            s.appendChild(r),
            i.appendChild(s),
            setTimeout(function () {
               g.loader.unveil(u),
                  g.rAF(function () {
                     g.fire(u, "_lazyloaded", {}, !0, !0),
                        u.complete && m({ target: u });
                  });
            }));
      }),
      z.addEventListener("load", m, !0),
      e.addEventListener(
         "lazybeforesizes",
         function (e) {
            var t, a, i, r;
            e.detail.instance == g &&
               e.target._lazybgset &&
               e.detail.dataAttr &&
               ((t = e.target._lazybgset),
               (i = t),
               (r = (
                  getComputedStyle(i) || { getPropertyValue: function () {} }
               ).getPropertyValue("background-size")),
               !n[r] &&
                  n[i.style.backgroundSize] &&
                  (r = i.style.backgroundSize),
               n[(a = r)] &&
                  ((e.target._lazysizesParentFit = a),
                  g.rAF(function () {
                     e.target.setAttribute("data-parent-fit", a),
                        e.target._lazysizesParentFit &&
                           delete e.target._lazysizesParentFit;
                  })));
         },
         !0
      ),
      z.documentElement.addEventListener("lazybeforesizes", function (e) {
         var t, a;
         !e.defaultPrevented &&
            e.target._lazybgset &&
            e.detail.instance == g &&
            (e.detail.width =
               ((t = e.target._lazybgset),
               (a = g.gW(t, t.parentNode)),
               (!t._lazysizesWidth || a > t._lazysizesWidth) &&
                  (t._lazysizesWidth = a),
               t._lazysizesWidth));
      }));
});
