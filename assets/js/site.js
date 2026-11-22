/* Theme toggle and section reveals. The page works fully without this file: it only adds the toggle
   (hidden until this runs) and the fade-in of sections, which are visible by default. */
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "theme";
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function stored() {
    try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : null; } catch (e) { return null; }
  }
  function current() { return root.getAttribute("data-theme") || (media && media.matches ? "dark" : "light"); }

  var button = document.querySelector(".theme-toggle");
  function label() {
    if (!button) return;
    var next = current() === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", "Switch to " + next + " theme");
    button.setAttribute("title", "Switch to " + next + " theme");
  }
  function apply(theme, remember) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#151827" : "#F5F0E7");
    if (remember) { try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode: the choice lasts this visit */ } }
    label();
  }

  apply(current(), false);
  if (button) {
    button.addEventListener("click", function () { apply(current() === "dark" ? "light" : "dark", true); });
  }
  // Follow the system until the visitor picks a theme themselves.
  if (media) {
    var follow = function (e) { if (!stored()) apply(e.matches ? "dark" : "light", false); };
    if (media.addEventListener) media.addEventListener("change", follow); else if (media.addListener) media.addListener(follow);
  }
  // Colours may ease between themes from now on (never on first paint).
  window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { root.classList.add("theme-ready"); }); });

  // Sections fade up once as they come into view.
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach(function (el) {
    // Anything already on screen is shown at once, so nothing visible ever blinks out.
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in"); else io.observe(el);
  });
  root.classList.add("reveal-ready");
})();
