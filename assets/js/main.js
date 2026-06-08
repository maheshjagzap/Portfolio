/**
 * Mahesh Jagzap Portfolio — main.js
 * Full Stack .NET Developer
 */

(function () {
  'use strict';

  /* ── PRELOADER ─────────────────────────────────────── */
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 400);
    }
  });

  /* ── THEME TOGGLE ──────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const html        = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('mj-theme', theme);
  }

  // Load saved preference, default dark
  const saved = localStorage.getItem('mj-theme') || 'dark';
  applyTheme(saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── HEADER SCROLL ─────────────────────────────────── */
  const header = document.getElementById('header');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE NAV ────────────────────────────────────── */
  const mobileBtn = document.getElementById('mobileNavToggle');
  const navbar    = document.getElementById('navbar');

  if (mobileBtn && navbar) {
    mobileBtn.addEventListener('click', () => {
      navbar.classList.toggle('open');
      mobileBtn.classList.toggle('open');
      document.body.style.overflow = navbar.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navbar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open');
        mobileBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('open') && !navbar.contains(e.target) && !mobileBtn.contains(e.target)) {
        navbar.classList.remove('open');
        mobileBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── ACTIVE NAV LINK (scrollspy) ───────────────────── */
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── SCROLL TO TOP ─────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── AOS INIT ──────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  /* ── SKILL BARS ANIMATION ──────────────────────────── */
  function animateSkillBars(panel) {
    if (!panel) return;
    panel.querySelectorAll('.skill-fill').forEach(bar => {
      const target = bar.getAttribute('data-width');
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = target + '%'; }, 50);
    });
  }

  // Animate on tab switch
  const skillTabs  = document.querySelectorAll('.skill-tab');
  const skillPanels = document.querySelectorAll('.skill-panel');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      skillPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        animateSkillBars(panel);
      }
    });
  });

  // Animate default (backend) on reveal via IntersectionObserver
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars(document.querySelector('.skill-panel.active'));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(skillsSection);
  }

  /* ── PROJECT FILTER ────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const featuredProject = document.querySelector('.featured-project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Handle featured project visibility
      if (featuredProject) {
        const fpTags = featuredProject.dataset.tags || '';
        featuredProject.style.display =
          (filter === 'all' || fpTags.split(' ').includes(filter)) ? '' : 'none';
      }

      // Handle project cards
      projectCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hidden', !show);
        if (show) card.style.animation = 'fadeInUp 0.4s ease forwards';
      });
    });
  });

  /* ── FEATURED PROJECT IMAGE SWITCHER ───────────────── */
  window.switchFpImg = function (thumb, src) {
    const mainImg = document.getElementById('fpMainImg');
    if (!mainImg) return;
    // Fade out → swap → fade in
    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(0.97)';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 200);
    // Update active thumb
    document.querySelectorAll('.fp-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  };

  /* ── EMAILJS CONTACT FORM ──────────────────────────── */
  /*
   * EmailJS Configuration
   * ─────────────────────
   * SETUP STEPS (one-time, takes ~5 minutes):
   *
   * 1. Go to https://www.emailjs.com and create a FREE account
   * 2. Dashboard → Email Services → Add New Service → Select Gmail
   *    → Connect your Gmail (maheshjagzap03@gmail.com) → Copy the SERVICE ID
   * 3. Dashboard → Email Templates → Create New Template
   *    Paste this as the template body:
   *    ─────────────────────────────────────────────────
   *    Subject: New Contact from Portfolio — {{from_name}}
   *
   *    Name:         {{from_name}}
   *    Email:        {{from_email}}
   *    Project Type: {{project_type}}
   *    Budget:       {{budget}}
   *
   *    Message:
   *    {{message}}
   *    ─────────────────────────────────────────────────
   *    Set "To Email" = maheshjagzap03@gmail.com
   *    Set "Reply To" = {{from_email}}   ← so you can reply directly
   *    Save → Copy the TEMPLATE ID
   * 4. Dashboard → Account → Copy your PUBLIC KEY
   * 5. Replace the three placeholder values below with your actual IDs.
   */

  const EMAILJS_PUBLIC_KEY  = 'doZX5MoMRlcKpTjOD';
  const EMAILJS_SERVICE_ID  = 'service_ixsw4t8';
  const EMAILJS_TEMPLATE_ID = 'template_6lpa9fr';

  // Initialise EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const contactForm = document.getElementById('contactForm');
  const formLoading  = document.getElementById('formLoading');
  const formSuccess  = document.getElementById('formSuccess');
  const formError    = document.getElementById('formError');
  const submitBtn    = document.getElementById('submitBtn');

  function showStatus(el) {
    [formLoading, formSuccess, formError].forEach(e => {
      if (e) e.classList.remove('visible');
    });
    if (el) el.classList.add('visible');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name    = contactForm.querySelector('#name').value.trim();
      const phone   = contactForm.querySelector('#phone') ? contactForm.querySelector('#phone').value.trim() : '';
      const email   = contactForm.querySelector('#email') ? contactForm.querySelector('#email').value.trim() : '';
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || (!phone && !email) || !message) {
        showStatus(formError);
        if (formError) formError.textContent = '⚠ Please fill in Name, Phone/Email and Project Description.';
        return;
      }

      showStatus(formLoading);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending…';
      }

      // Check if keys have been configured
      if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        // Keys not yet set — show a helpful dev message
        setTimeout(() => {
          showStatus(formError);
          if (formError) formError.innerHTML =
            '⚙ EmailJS not configured yet. See the setup instructions in <code>assets/js/main.js</code>.';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Send Message';
          }
        }, 800);
        return;
      }

      // Build template params — these variable names must match your EmailJS template
      const businessName = contactForm.querySelector('#business_name') ? contactForm.querySelector('#business_name').value.trim() : '';
      const templateParams = {
        from_name:     name,
        business_name: businessName || 'Not provided',
        from_phone:    phone || 'Not provided',
        from_email:    email || 'Not provided',
        project_type:  contactForm.querySelector('#project_type') ? contactForm.querySelector('#project_type').value || 'Not specified' : 'Not specified',
        budget:        contactForm.querySelector('#budget') ? contactForm.querySelector('#budget').value || 'Not specified' : 'Not specified',
        message:       message,
        reply_to:      email || phone,
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          showStatus(formSuccess);
          contactForm.reset();
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          showStatus(formError);
          if (formError) formError.textContent = '✖ Something went wrong. Please email me directly at maheshjagzap03@gmail.com';
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Send Message';
          }
        });
    });
  }

  /* ── SMOOTH SCROLL for anchor links ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── COUNTER ANIMATION ─────────────────────────────── */
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + (el.dataset.suffix || '');
      }
    }, 16);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-num').forEach(el => {
            const text = el.textContent;
            const num = parseInt(text);
            const suffix = text.replace(/[0-9]/g, '');
            el.dataset.suffix = suffix;
            animateCounter(el, num);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(statsSection);
  }

})();
