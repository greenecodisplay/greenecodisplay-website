/* ============================================
   GREEN DISPLAY - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ===== Mobile Nav Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  // ===== Header Scroll Effect =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== Product Category Tabs =====
  const tabs = document.querySelectorAll('.cat-tab');
  const panels = document.querySelectorAll('.cat-panel');
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const target = this.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      if (q && a) {
        q.addEventListener('click', function() {
          const isOpen = a.classList.contains('open');
          // Close all
          faqItems.forEach(fi => {
            fi.querySelector('.faq-q').classList.remove('open');
            fi.querySelector('.faq-a').classList.remove('open');
          });
          // Open clicked if it was closed
          if (!isOpen) {
            q.classList.add('open');
            a.classList.add('open');
          }
        });
      }
    });
  }

  // ===== Contact Form Validation =====
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      let valid = true;

      if (name && !name.value.trim()) { showError(name, 'Name is required'); valid = false; } else clearError(name);
      if (email && !email.value.trim()) { showError(email, 'Email is required'); valid = false; }
      else if (email && !isValidEmail(email.value)) { showError(email, 'Please enter a valid email'); valid = false; }
      else clearError(email);
      if (message && !message.value.trim()) { showError(message, 'Message is required'); valid = false; } else clearError(message);

      if (valid) {
        // Show success message
        const successDiv = document.querySelector('#formSuccess');
        if (successDiv) {
          successDiv.style.display = 'block';
          successDiv.innerHTML = '<p style="color:#2E7D32;font-weight:600;padding:16px;background:#e8f5e9;border-radius:8px;">Thank you! Your inquiry has been submitted. We will contact you within 24 hours.</p>';
        }
        contactForm.reset();
        // If Formspree is configured, actually submit
        const action = contactForm.getAttribute('action');
        if (action && action.indexOf('formspree.io') > -1 && action.indexOf('your_id') === -1) {
          // Submit to Formspree via fetch
          const formData = new FormData(contactForm);
          fetch(action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => console.log('Form submitted:', data))
            .catch(err => console.error('Form error:', err));
        }
      }
    });
  }

  function showError(field, msg) {
    let err = field.parentNode.querySelector('.form-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'form-error';
      err.style.cssText = 'color:#c62828;font-size:0.8rem;margin-top:4px;';
      field.parentNode.appendChild(err);
    }
    err.textContent = msg;
    field.style.borderColor = '#c62828';
  }
  function clearError(field) {
    let err = field.parentNode.querySelector('.form-error');
    if (err) err.remove();
    field.style.borderColor = '';
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===== Scroll Animations =====
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.why-card, .product-card, .case-card, .stat-box, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
