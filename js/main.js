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

  // ===== 询盘表单：真实提交 + 三语文案 =====
  const FORM_MSG = {
    en: {
      sending: 'Sending...',
      success: 'Thank you! Your inquiry has been sent. We will contact you within 24 hours.',
      error: 'Sorry, something went wrong. Please email us directly at info@greenecodisplay.com'
    },
    es: {
      sending: 'Enviando...',
      success: '&#161;Gracias! Su consulta ha sido enviada. Le contactaremos dentro de 24 horas.',
      error: 'Lo sentimos, algo sali&#243; mal. Por favor env&#237;enos un correo directamente a info@greenecodisplay.com'
    },
    ar: {
      sending: 'جارٍ الإرسال...',
      success: 'شكرًا لك! تم إرسال استفسارك. سنتواصل معك خلال 24 ساعة.',
      error: 'حدث خطأ ما. يُرجى مراسلتنا مباشرة على info@greenecodisplay.com'
    }
  };

  function showFormMessage(type, msg) {
    const box = document.querySelector('#formSuccess');
    if (!box) return;
    const ok = type === 'success';
    box.style.display = 'block';
    box.innerHTML = '<p style="color:' + (ok ? '#2E7D32' : '#c62828') +
      ';font-weight:600;padding:16px;background:' + (ok ? '#e8f5e9' : '#fdecea') +
      ';border-radius:8px;">' + msg + '</p>';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        const lang = (document.documentElement.lang || 'en').slice(0, 2);
        const msg = FORM_MSG[lang] || FORM_MSG.en;
        const action = contactForm.getAttribute('action');
        const btn = contactForm.querySelector('button[type="submit"]');
        const btnText = btn ? btn.textContent : '';

        // 未配置真实接口时不许谎报成功
        if (!action || action.indexOf('your_id') > -1) {
          showFormMessage('error', msg.error);
          return;
        }

        const formData = new FormData(contactForm);
        if (btn) { btn.disabled = true; btn.textContent = msg.sending; }

        fetch(action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (data && data.success) {
              showFormMessage('success', msg.success);
              contactForm.reset();
              track('generate_lead', { language: lang, form_location: 'contact_page' });
            } else {
              showFormMessage('error', msg.error);
              track('form_submit_error', { language: lang, reason: 'api_rejected' });
            }
          })
          .catch(function() {
            showFormMessage('error', msg.error);
            track('form_submit_error', { language: lang, reason: 'network' });
          })
          .then(function() {
            if (btn) { btn.disabled = false; btn.textContent = btnText; }
          });
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

  // ===== Analytics Helpers (GA4) =====
  // gtag 未加载（被拦截/未注入）时静默跳过，不影响页面功能
  function track(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  // 追踪客户改用 WhatsApp / 邮件 / 电话直接联系
  document.addEventListener('click', function(e) {
    const link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1) {
      track('contact_whatsapp', { link_text: (link.textContent || '').trim().slice(0, 40) });
    } else if (href.indexOf('mailto:') === 0) {
      track('contact_email', { link_text: (link.textContent || '').trim().slice(0, 40) });
    } else if (href.indexOf('tel:') === 0) {
      track('contact_phone', { link_text: (link.textContent || '').trim().slice(0, 40) });
    }
  }, true);

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
