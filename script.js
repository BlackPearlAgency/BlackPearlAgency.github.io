/* ======================================================
   CONFIG — paste your deployed Google Apps Script Web App
   URL here after following the setup steps. Booking form
   submissions on contact.html will POST to this URL and
   land as a new row in your Google Sheet.
====================================================== */
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbynwonRzjpxVicwldNow50yjHn9hgLMItelo2nE6JY6WzMZfsP2t_zgtES6MMcyzg6imQ/exec";

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) { lucide.createIcons(); }

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('bp-theme');
  if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) { root.removeAttribute('data-theme'); localStorage.setItem('bp-theme', 'light'); }
      else { root.setAttribute('data-theme', 'dark'); localStorage.setItem('bp-theme', 'dark'); }
    });
  }

  /* ---------- Language toggle (persisted, EN/AR) ---------- */
  const langToggle = document.getElementById('langToggle');
  function applyLang(lang) {
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-en]').forEach(el => {
      const val = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (val !== null) el.textContent = val;
    });
    document.querySelectorAll('[data-en-ph]').forEach(el => {
      const val = lang === 'ar' ? el.getAttribute('data-ar-ph') : el.getAttribute('data-en-ph');
      if (val !== null) el.setAttribute('placeholder', val);
    });
    if (langToggle) langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';
    localStorage.setItem('bp-lang', lang);
  }
  const savedLang = localStorage.getItem('bp-lang') || 'en';
  applyLang(savedLang);
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const current = root.getAttribute('lang') === 'ar' ? 'ar' : 'en';
      applyLang(current === 'ar' ? 'en' : 'ar');
    });
  }

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
      btn.textContent = root.getAttribute('lang') === 'ar' ? 'تم الاشتراك' : 'Subscribed';
      newsletterForm.querySelector('input').value = '';
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalLabel = btn.textContent;
      const isAr = root.getAttribute('lang') === 'ar';
      const data = {
        name: contactForm.querySelector('[name="name"]').value,
        email: contactForm.querySelector('[name="email"]').value,
        phone: contactForm.querySelector('[name="phone"]').value,
        budget: contactForm.querySelector('[name="budget"]').value,
        message: contactForm.querySelector('[name="message"]').value,
        source: 'website-booking-form',
        page: window.location.href
      };

      const finish = () => {
        btn.textContent = isAr ? 'تم إرسال الطلب' : 'Request sent';
        contactForm.reset();
        setTimeout(() => { btn.textContent = originalLabel; }, 4000);
      };

      if (!GOOGLE_SHEET_WEBHOOK_URL || GOOGLE_SHEET_WEBHOOK_URL.indexOf('PASTE_YOUR') === 0) {
        // Webhook not configured yet — still confirm to the user.
        finish();
        return;
      }

      btn.textContent = isAr ? 'جارٍ الإرسال...' : 'Sending...';
      fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script web apps don't return CORS headers by default
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      })
        .then(finish)
        .catch(finish); // no-cors gives an opaque response either way, so treat as success
    });
  }
});
