/**
 * NexusForge landing page interactions:
 * - persist dark/light theme
 * - navbar elevation on scroll
 * - intersection-based reveal animations
 * - contact form feedback (client-side)
 */
(function () {
  "use strict";

  const THEME_KEY = "nexusforge-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const nav = document.getElementById("mainNav");
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");

  /* ---------- Theme ---------- */
  function preferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      const next = theme === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-label", "Switch to " + next + " mode");
    }
  }

  applyTheme(preferredTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* ---------- Navbar ---------- */
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 16);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Close mobile menu after a nav click */
  document.querySelectorAll("#navMenu .nav-link, #navMenu .btn").forEach(function (link) {
    link.addEventListener("click", function () {
      const collapse = document.getElementById("navMenu");
      if (collapse && collapse.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  /* ---------- Scroll reveals ---------- */
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Contact form ---------- */
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (statusEl) {
        statusEl.textContent = "Thanks — our architects will reply within one business day.";
      }

      form.reset();
    });
  }
})();
