document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) { lucide.createIcons(); }

  const header = document.getElementById('siteHeader');
  if (header) {
    const setScrolled = () => header.classList.toggle('scrolled', window.scrollY > 40);
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  const pearlWrap = document.getElementById('pearlWrap');
  const heroSection = document.querySelector('.hero');
  if (pearlWrap && heroSection && window.matchMedia('(min-width: 981px)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      pearlWrap.style.transform = `translate(${x * 26}px, ${y * 26}px) rotate(${x * 4}deg)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      pearlWrap.style.transform = 'translate(0,0) rotate(0deg)';
    });
  }

  const particleField = document.getElementById('particleField');
  if (particleField) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 2 + Math.random() * 4;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '0';
      p.style.animationDuration = (8 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      particleField.appendChild(p);
    }
  }

  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const fill = timeline.querySelector('.timeline-track-fill');
    const steps = timeline.querySelectorAll('.tl-step');
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          steps.forEach((step, i) => {
            setTimeout(() => step.classList.add('is-visible'), i * 220);
          });
          if (fill) setTimeout(() => fill.style.width = '100%', 100);
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    tlObserver.observe(timeline);
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      btn.textContent = 'Subscribed';
      newsletterForm.querySelector('input').value = '';
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Request sent';
      contactForm.reset();
    });
  }
});
