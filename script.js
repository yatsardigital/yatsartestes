(function () {
  'use strict';

  /* ---------------------------------------------------------
     Theme: dark / light with localStorage persistence
  --------------------------------------------------------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var STORAGE_KEY = 'yatsar-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }

  function getPreferredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) { /* storage unavailable */ }
    return 'dark';
  }

  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
  });

  /* ---------------------------------------------------------
     Nav: scrolled background + mobile burger menu
  --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  var navMobile = document.getElementById('navMobile');

  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', function () {
    var isOpen = burger.classList.toggle('open');
    navMobile.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      burger.classList.remove('open');
      navMobile.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     Scroll-triggered reveal animations
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });

    // Also mark parent .step as "in" for the shape animations
    var stepObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            stepObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    document.querySelectorAll('.step').forEach(function (el) { stepObserver.observe(el); });
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.step').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------------------------------------------------
     Contact form (front-end only demo submission)
  --------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        status.textContent = 'Preencha todos os campos antes de enviar.';
        status.classList.add('error');
        return;
      }
      if (!emailPattern.test(email)) {
        status.textContent = 'Informe um e-mail válido.';
        status.classList.add('error');
        return;
      }

      status.classList.remove('error');
      var submitBtn = form.querySelector('button[type="submit"] .btn-label');
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';

      setTimeout(function () {
        submitBtn.textContent = originalLabel;
        status.textContent = 'Mensagem enviada! Entraremos em contato em breve.';
        form.reset();
      }, 900);
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Subtle parallax on hero symbol (mouse move), desktop only
  --------------------------------------------------------- */
  var heroSymbol = document.querySelector('.hero-symbol');
  var hero = document.getElementById('hero');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroSymbol && hero && window.matchMedia('(min-width: 901px)').matches && !prefersReducedMotion) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroSymbol.style.transform =
        'translateY(-50%) translate(' + (x * -14) + 'px, ' + (y * -14) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      heroSymbol.style.transform = 'translateY(-50%)';
    });
  }
})();
