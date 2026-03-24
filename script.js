/* =============================================
   Wrappi – Website JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- Constants ---- */
  var ANIMATE_STAGGER_MS = 80;
  var COUNTER_DURATION_MS = 1800;

  /* ---- Navbar scroll behaviour ---- */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector('.navbar__links a[href="#' + id + '"]');

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.navbar__links a').forEach(function (a) {
            a.classList.remove('active');
          });
          link.classList.add('active');
        }
      }
    });

    // Back-to-top visibility
    const btt = document.getElementById('backToTop');
    if (btt) {
      if (window.scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.navbar__links');
  const navCta = document.querySelector('.navbar__cta');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      if (navLinks) navLinks.classList.toggle('open', isOpen);
      if (navCta) navCta.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.navbar__links a, .navbar__cta a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        if (navLinks) navLinks.classList.remove('open');
        if (navCta) navCta.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Back to top ---- */
  const bttBtn = document.getElementById('backToTop');
  if (bttBtn) {
    bttBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Scroll-triggered animations ---- */
  const animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animateEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Add staggered delay based on sibling index
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-animate]'));
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = idx * ANIMATE_STAGGER_MS + 'ms';
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animateEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    animateEls.forEach(function (el) {
      el.classList.add('animated');
    });
  }

  /* ---- Animated counter ---- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = COUNTER_DURATION_MS;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-target]');
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ---- Contact form ---- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('.form__submit');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Simulate async submission
      setTimeout(function () {
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send Message';
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(function () {
            successMsg.style.display = 'none';
          }, 5000);
        }
      }, 1200);
    });
  }
})();
