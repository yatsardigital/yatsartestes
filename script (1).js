(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- tema claro/escuro ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const ribbonWipe = document.getElementById('ribbonWipe');

  function getStoredTheme(){
    try { return localStorage.getItem('yatsar-theme'); } catch(e){ return null; }
  }
  function storeTheme(value){
    try { localStorage.setItem('yatsar-theme', value); } catch(e){ /* ignora se indisponivel */ }
  }

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = getStoredTheme() || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initialTheme);
  themeToggle.setAttribute('aria-pressed', String(initialTheme === 'light'));

  function applyTheme(next){
    root.setAttribute('data-theme', next);
    storeTheme(next);
    themeToggle.setAttribute('aria-pressed', String(next === 'light'));
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    if (reduceMotion) {
      applyTheme(next);
      return;
    }

    ribbonWipe.classList.remove('play');
    void ribbonWipe.offsetWidth; // reinicia a animacao
    ribbonWipe.classList.add('play');

    // troca o tema no meio da "dobra" da fita, quando a tela esta coberta
    setTimeout(() => applyTheme(next), 340);
    setTimeout(() => ribbonWipe.classList.remove('play'), 900);
  });

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

  /* ---------------- header ao rolar ---------------- */
  const onScrollHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------------- barra de progresso de rolagem ---------------- */
  const progressBar = document.getElementById('scrollProgress');
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  onScrollProgress();
  window.addEventListener('scroll', onScrollProgress, { passive: true });

  /* ---------------- montagem do simbolo no hero ---------------- */
  const stage = document.getElementById('symbolStage');
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      setTimeout(() => stage.classList.add('assembled'), 260);
      setTimeout(() => stage.classList.add('tilt-ready'), 1500);
    });
  });

  /* ---------------- tilt 3D do simbolo (exclusivo) ---------------- */
  const symbolImg = document.getElementById('symbolImg');
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!reduceMotion && !isTouch) {
    stage.addEventListener('mousemove', (e) => {
      if (!stage.classList.contains('tilt-ready')) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      symbolImg.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg) scale(1.04)`;
    });
    stage.addEventListener('mouseleave', () => {
      if (!stage.classList.contains('tilt-ready')) return;
      symbolImg.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
  }

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

  /* ---------------- botao magnetico (exclusivo) ---------------- */
  if (!reduceMotion && !isTouch) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }
})();
