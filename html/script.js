(() => {
  /* ---------------- menu mobile ---------------- */
  const header = document.getElementById('siteHeader');
  const burger = document.getElementById('burgerBtn');
  burger.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      header.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- montagem do símbolo no hero ---------------- */
  const stage = document.getElementById('symbolStage');
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      setTimeout(() => stage.classList.add('assembled'), 260);
    });
  });

  /* ---------------- scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal:not(.in-view), .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
})();
