/* =========================================================
   STARFIELD — ambient canvas background
   ========================================================= */
(() => {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function makeStars() {
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.15,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      const alpha = prefersReducedMotion
        ? s.baseAlpha
        : s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 236, 255, ${Math.max(0, alpha)})`;
      ctx.fill();
    });
    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  function init() {
    resize();
    makeStars();
    draw(0);
  }

  window.addEventListener('resize', () => {
    resize();
    makeStars();
    if (prefersReducedMotion) draw(0);
  });

  init();
})();

/* =========================================================
   SCROLL REVEALS + TRAJECTORY WAYPOINT ACTIVATION
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  const markers = document.querySelectorAll('.waypoint-marker');
  const sectors = document.querySelectorAll('.sector');

  markers.forEach((m) => {
    m.style.setProperty('--sector-tint', m.dataset.tint);
  });

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach((reveal) => {
      const top = reveal.getBoundingClientRect().top;
      if (top < windowHeight - elementVisible) reveal.classList.add('active');
    });

    // Activate the trajectory marker for the sector currently centered in viewport
    let activeIndex = -1;
    sectors.forEach((sector, i) => {
      const rect = sector.getBoundingClientRect();
      if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5) {
        activeIndex = i;
      }
    });
    markers.forEach((m, i) => m.classList.toggle('active', i === activeIndex));
  };

  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll, { passive: true });
});

/* =========================================================
   CARD 3D TILT (pointer devices only)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transition = 'none';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
});

/* =========================================================
   MOBILE NAV TOGGLE
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  links.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
});