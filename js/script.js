/* =========================================================
   ñHASH — Café & Kitchen · Interactions
   ========================================================= */
(function () {
  "use strict";

  /* Mark JS as available FIRST so reveal animations can hide-then-show.
     Without this class, all content stays visible (no-JS fallback). */
  document.documentElement.classList.add("js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     MENU DATA — edit names / prices / items freely
     category: momos | burgers | coffee | desserts
  --------------------------------------------------------- */
  const MENU = [
    /* ---- MOMOS ---- */
    {
      cat: "momos", tag: "steamed", name: "Classic Veg Momos", price: "₹120",
      desc: "Eight juicy hand-folded dumplings stuffed with spiced cabbage & carrot. Served with fiery red chutney.",
      meta: ["Veg", "8 pcs"]
    },
    {
      cat: "momos", tag: "fried", name: "Crispy Chicken Momos", price: "₹160",
      desc: "Golden pan-fried dumplings loaded with juicy minced chicken and a crunchy shell.",
      meta: ["Non-veg", "8 pcs", "Best seller"]
    },
    {
      cat: "momos", tag: "tandoori", name: "Tandoori Paneer Momos", price: "₹180",
      desc: "Char-grilled momos tossed in smoky tandoori masala with a cooling mint dip.",
      meta: ["Veg", "6 pcs"]
    },
    {
      cat: "momos", tag: "loaded", name: "Cheese Corn Momos", price: "₹150",
      desc: "Molten cheese and sweet corn packed into soft steamed pockets. Gooey in every bite.",
      meta: ["Veg", "8 pcs"]
    },

    /* ---- BURGERS & FRIES ---- */
    {
      cat: "burgers", tag: "signature", name: "ñHASH Veg Burger", price: "₹140",
      desc: "Crispy potato-veggie patty, fresh lettuce, tomato and house sauce in a toasted bun.",
      meta: ["Veg", "Filling"]
    },
    {
      cat: "burgers", tag: "grill", name: "Crispy Chicken Burger", price: "₹190",
      desc: "Fried chicken fillet, melted cheese and smoky mayo stacked tall. A proper handful.",
      meta: ["Non-veg", "Best seller"]
    },
    {
      cat: "burgers", tag: "peri-peri", name: "Peri-Peri Fries", price: "₹110",
      desc: "Golden fries dusted with tangy peri-peri seasoning. Crispy outside, fluffy inside.",
      meta: ["Veg", "Shareable"]
    },
    {
      cat: "burgers", tag: "loaded", name: "Loaded Cheese Fries", price: "₹160",
      desc: "Fries buried under molten cheese sauce, jalapeños and a drizzle of garlic aioli.",
      meta: ["Veg", "Shareable"]
    },

    /* ---- COFFEE & DRINKS ---- */
    {
      cat: "coffee", tag: "hot", name: "Cappuccino", price: "₹130",
      desc: "Double shot of espresso topped with velvety steamed milk and a dusting of cocoa.",
      meta: ["Hot", "Classic"]
    },
    {
      cat: "coffee", tag: "iced", name: "Cold Coffee", price: "₹150",
      desc: "Thick, frothy blended cold coffee with a scoop of ice cream. Café favourite.",
      meta: ["Iced", "Best seller"]
    },
    {
      cat: "coffee", tag: "iced", name: "Hazelnut Iced Latte", price: "₹170",
      desc: "Chilled espresso, cold milk and nutty hazelnut syrup over ice.",
      meta: ["Iced", "Sweet"]
    },
    {
      cat: "coffee", tag: "cold brew", name: "Signature Cold Brew", price: "₹160",
      desc: "Slow-steeped 18-hour cold brew, smooth and bold. Served black or with milk.",
      meta: ["Iced", "Strong"]
    },

    /* ---- SHAKES & DESSERTS ---- */
    {
      cat: "desserts", tag: "shake", name: "Oreo Thick Shake", price: "₹180",
      desc: "Blended Oreo cookies and vanilla ice cream, topped with whipped cream and crumble.",
      meta: ["Cold", "Best seller"]
    },
    {
      cat: "desserts", tag: "shake", name: "Chocolate Overload Shake", price: "₹190",
      desc: "Rich chocolate ice cream, brownie chunks and a chocolate drizzle. Pure indulgence.",
      meta: ["Cold", "Rich"]
    },
    {
      cat: "desserts", tag: "warm", name: "Molten Chocolate Brownie", price: "₹150",
      desc: "Warm gooey brownie with a scoop of vanilla ice cream and hot chocolate sauce.",
      meta: ["Warm", "Eggless option"]
    },
    {
      cat: "desserts", tag: "chilled", name: "Blueberry Cheesecake", price: "₹200",
      desc: "Creamy baked cheesecake on a buttery biscuit base, topped with blueberry compote.",
      meta: ["Chilled", "Eggless"]
    }
  ];

  /* ---------------------------------------------------------
     BUILD MENU CARDS
  --------------------------------------------------------- */
  const grid = document.getElementById("menuGrid");
  if (grid) {
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    MENU.forEach((item, i) => {
      const card = document.createElement("article");
      card.className = "mcard reveal";
      card.dataset.cat = item.cat;
      card.style.transitionDelay = (i % 3) * 0.07 + "s";
      card.innerHTML = `
        <div class="mcard__media">
          <div class="img-placeholder">
            <span class="img-placeholder__label">${item.name.toLowerCase()}</span>
          </div>
          <div class="mcard__scan"></div>
          <span class="mcard__tag">${item.tag}</span>
        </div>
        <div class="mcard__body">
          <div class="mcard__row">
            <h3 class="mcard__name">${item.name}</h3>
            <span class="mcard__price">${item.price}</span>
          </div>
          <p class="mcard__desc">${item.desc}</p>
          <div class="mcard__meta">${item.meta.map((m) => `<span>${m}</span>`).join("")}</div>
        </div>`;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
    attachTilt();
    observeReveals();
  }

  /* ---------------------------------------------------------
     3D TILT on menu cards
  --------------------------------------------------------- */
  function attachTilt() {
    if (prefersReduced) return;
    document.querySelectorAll(".mcard").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(800px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)";
      });
    });
  }

  /* ---------------------------------------------------------
     MENU FILTERS
  --------------------------------------------------------- */
  const filters = document.getElementById("menuFilters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      const f = btn.dataset.filter;
      document.querySelectorAll(".mcard").forEach((card) => {
        const show = f === "all" || card.dataset.cat === f;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  let io;
  function observeReveals() {
    if (prefersReduced) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
  }
  observeReveals();

  /* Safety net: if anything is still hidden shortly after load, reveal it. */
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 400);
  });

  /* ---------------------------------------------------------
     NAV — sticky state + mobile drawer
  --------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", onScroll, { passive: true });
  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 30);
    const beam = document.getElementById("scrollBeam");
    if (beam) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      beam.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  }
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------------------------------------------------------
     CURSOR GLOW
  --------------------------------------------------------- */
  const glow = document.getElementById("cursorGlow");
  if (glow && !prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    let gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.16;
      cy += (gy - cy) * 0.16;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
  } else if (glow) {
    glow.style.display = "none";
  }

  /* ---------------------------------------------------------
     FLOATING PARTICLES (subtle, futuristic)
  --------------------------------------------------------- */
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let dots = [], w, h, raf;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(90, Math.floor((w * h) / 20000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vy: Math.random() * 0.25 + 0.05,
        vx: (Math.random() - 0.5) * 0.15,
        tw: Math.random() * Math.PI * 2
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.tw += 0.02;
        d.y += d.vy;
        d.x += d.vx;
        if (d.y > h) { d.y = -4; d.x = Math.random() * w; }
        if (d.x < -4) d.x = w; else if (d.x > w + 4) d.x = 0;
        const a = 0.25 + Math.sin(d.tw) * 0.25;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199,242,39,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(resize, 200);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  /* ---------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
