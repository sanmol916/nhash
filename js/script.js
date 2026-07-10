/* =========================================================
   ñHASH — Alien Café · Interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     MENU DATA — edit prices / items freely
     category: brew | bite | sweet
  --------------------------------------------------------- */
  const MENU = [
    {
      cat: "brew", tag: "signature", name: "Zero-G Latte", price: "₹280",
      desc: "Espresso suspended in silky orbital foam with a whisper of vanilla stardust.",
      meta: ["Hot / Iced", "Oat option", "Best seller"]
    },
    {
      cat: "brew", tag: "cold brew", name: "Green Nebula Cold Brew", price: "₹260",
      desc: "18-hour steeped cold brew charged with matcha and a lime-mint aura.",
      meta: ["Iced", "Caffeine ++"]
    },
    {
      cat: "brew", tag: "house special", name: "Supernova Espresso", price: "₹190",
      desc: "A dense double shot pulled to a bright, exploding finish. For real earthlings.",
      meta: ["Hot", "Strong"]
    },
    {
      cat: "bite", tag: "loaded", name: "Meteor Loaded Fries", price: "₹240",
      desc: "Crater-cut fries buried under molten cheese, jalapeño ash and alien aioli.",
      meta: ["Veg", "Shareable"]
    },
    {
      cat: "bite", tag: "grill", name: "Cosmic Crunch Burger", price: "₹320",
      desc: "Charred patty, glow-sauce and crisp greens stacked in a charcoal bun.",
      meta: ["Veg / Non-veg", "Filling"]
    },
    {
      cat: "bite", tag: "wood-fired", name: "UFO Flatbread", price: "₹300",
      desc: "Thin-crust disc topped with pesto, roasted veg and a mozzarella halo.",
      meta: ["Veg", "Wood-fired"]
    },
    {
      cat: "sweet", tag: "signature", name: "Galaxy Cheesecake", price: "₹270",
      desc: "Swirled blueberry cosmos over a buttery meteorite crust. Chilled to deep-space temps.",
      meta: ["Chilled", "Eggless"]
    },
    {
      cat: "sweet", tag: "warm", name: "Molten Black Hole", price: "₹250",
      desc: "Dark chocolate lava cake that collapses into a pool of gooey gravity.",
      meta: ["Warm", "Rich"]
    },
    {
      cat: "sweet", tag: "frozen", name: "Alien Bloom Gelato", price: "₹210",
      desc: "House-churned pistachio-lime gelato with an eerie, beautiful green glow.",
      meta: ["Frozen", "Veg"]
    }
  ];

  /* ---------------------------------------------------------
     BUILD MENU CARDS
  --------------------------------------------------------- */
  const grid = document.getElementById("menuGrid");
  if (grid) {
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
     STARFIELD CANVAS
  --------------------------------------------------------- */
  const canvas = document.getElementById("starfield");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let stars = [], w, h, raf;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(160, Math.floor((w * h) / 12000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.tw += 0.02;
        const a = 0.35 + Math.sin(s.tw) * 0.35;
        s.y += s.z * 0.12;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199,242,39,${a * (s.z / 1.7)})`;
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
