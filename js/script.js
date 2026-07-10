/* =========================================================
   ñHASH — Café & Kitchen · Interactions
   NOTE: All content (menu, sections) is in the HTML and is
   visible without JavaScript. This file only ADDS polish.
   Nothing here can hide content.
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     3D TILT on menu cards (enhancement)
  --------------------------------------------------------- */
  if (!prefersReduced) {
    document.querySelectorAll(".mcard").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(800px) rotateY(" + x * 9 + "deg) rotateX(" + -y * 9 + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)";
      });
    });
  }

  /* ---------------------------------------------------------
     MENU FILTERS
  --------------------------------------------------------- */
  var filters = document.getElementById("menuFilters");
  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      filters.querySelectorAll(".chip").forEach(function (c) {
        c.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      var f = btn.dataset.filter;
      document.querySelectorAll(".mcard").forEach(function (card) {
        var show = f === "all" || card.dataset.cat === f;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------------------------------------------------------
     NAV — sticky state + scroll beam + mobile drawer
  --------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 30);
    var beam = document.getElementById("scrollBeam");
    if (beam) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      beam.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     CURSOR GLOW
  --------------------------------------------------------- */
  var glow = document.getElementById("cursorGlow");
  if (glow && !prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    var gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.16;
      cy += (gy - cy) * 0.16;
      glow.style.transform = "translate(" + cx + "px, " + cy + "px)";
      requestAnimationFrame(loop);
    })();
  } else if (glow) {
    glow.style.display = "none";
  }

  /* ---------------------------------------------------------
     FLOATING PARTICLES (subtle, futuristic)
  --------------------------------------------------------- */
  var canvas = document.getElementById("particles");
  if (canvas && canvas.getContext && !prefersReduced) {
    var ctx = canvas.getContext("2d");
    var dots = [], w, h, raf;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      var count = Math.min(90, Math.floor((w * h) / 20000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vy: Math.random() * 0.25 + 0.05,
          vx: (Math.random() - 0.5) * 0.15,
          tw: Math.random() * Math.PI * 2
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.tw += 0.02;
        d.y += d.vy;
        d.x += d.vx;
        if (d.y > h) { d.y = -4; d.x = Math.random() * w; }
        if (d.x < -4) d.x = w; else if (d.x > w + 4) d.x = 0;
        var a = 0.25 + Math.sin(d.tw) * 0.25;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(199,242,39," + a + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(resize, 200);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  /* ---------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
