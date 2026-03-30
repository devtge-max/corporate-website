/* ===== SCROLL TO TOP ON RELOAD ===== */
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ===== PAGE TRANSITIONS ===== */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('https') ||
      href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('//') ||
      link.target === '_blank' || !href.endsWith('.html')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = href; }, 240);
  });
});

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    hamburger.style.zIndex = '1001';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    hamburger.style.zIndex = '';
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    hamburger.style.zIndex = '';
  });
});

/* ===== FADE-UP OBSERVER ===== */
const fadeEls = document.querySelectorAll('.fade-up:not(.nav-links *)');

// mobile: mostra tudo imediatamente, sem animação
if (window.innerWidth < 768) {
  fadeEls.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => el.classList.add('visible'), 80);
    } else {
      observer.observe(el);
    }
  });
}

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ===== METRIC BARS ===== */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.metrica-fill');
      if (fill) { const w = fill.style.width; fill.style.width = '0'; requestAnimationFrame(() => { fill.style.width = w; }); }
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.metrica-card').forEach(el => barObserver.observe(el));

/* ===== PORTFOLIO FILTERS ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => card.classList.remove('filter-out'));
        } else {
          card.classList.add('filter-out');
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
}

/* ===== FAQ ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
});

/* ===== PARTICLES (home only) ===== */
const canvas = document.getElementById('particles');
if (canvas) {
  // desativa partículas em mobile — muito pesado
  const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canvas.style.display = 'none';
  } else {
    const ctx = canvas.getContext('2d');
    let particles = [], animId;
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + 0.3, dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3, alpha: Math.random() * 0.5 + 0.1 });
      }
    }
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129,140,248,${p.alpha})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(drawParticles);
    }
    resizeCanvas(); createParticles(); drawParticles();
    window.addEventListener('resize', () => { cancelAnimationFrame(animId); resizeCanvas(); createParticles(); drawParticles(); });
  }

  // parallax só em desktop também
  if (!isMobile) {
    window.addEventListener('scroll', () => {
      const hero = document.getElementById('hero');
      if (hero && window.scrollY < window.innerHeight) hero.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    });
  }
}

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const freeProviders = ['gmail','hotmail','yahoo','outlook','live','icloud','bol','uol','terra'];
  const emailInput = contactForm.querySelector('#email');

  emailInput.addEventListener('blur', () => {
    const domain = emailInput.value.split('@')[1]?.split('.')[0]?.toLowerCase();
    const warn = contactForm.querySelector('.email-warn');
    if (domain && freeProviders.includes(domain)) {
      if (!warn) {
        const el = document.createElement('span');
        el.className = 'email-warn';
        el.textContent = 'Prefira usar seu e-mail corporativo para agilizar o atendimento.';
        emailInput.parentNode.appendChild(el);
      }
    } else if (warn) warn.remove();
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Enviar mensagem →'; btn.disabled = false;
      document.getElementById('formSuccess').style.display = 'block';
      this.reset();
      const warn = this.querySelector('.email-warn');
      if (warn) warn.remove();
      setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 5000);
    }, 1200);
  });
}
