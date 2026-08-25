/* Tricky Trees LTD — single-page site scripts */
(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('primary-nav');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Active-section highlighting in nav */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#primary-nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
          var active = document.querySelector('#primary-nav a[href="#' + e.target.id + '"]');
          if (active) active.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Contact form: client-side validation + friendly demo submit */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');

    function setInvalid(field, on) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.toggle('invalid', on);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var firstBad = null;
      var required = form.querySelectorAll('[required]');
      required.forEach(function (f) {
        var valid = f.value.trim() !== '';
        if (f.type === 'tel') {
          var digits = f.value.replace(/\D/g, '');
          valid = digits.length >= 10;
        }
        setInvalid(f, !valid);
        if (!valid) { ok = false; if (!firstBad) firstBad = f; }
      });

      var email = form.querySelector('input[type="email"]');
      if (email && email.value.trim() !== '') {
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        setInvalid(email, !emailOk);
        if (!emailOk) { ok = false; if (!firstBad) firstBad = email; }
      }

      if (!ok) {
        if (firstBad) firstBad.focus();
        if (status) {
          status.textContent = 'Please check the highlighted fields and try again.';
          status.className = 'form-status';
          status.style.background = 'rgba(163,52,31,.1)';
          status.style.color = '#a3341f';
        }
        return;
      }

      if (status) {
        status.className = 'form-status form-status--ok';
        status.style.background = '';
        status.style.color = '';
        status.textContent = 'Thanks \u2014 your request has been received. We\u2019ll call you back shortly. For anything urgent, call 705-571-9800.';
      }
      form.reset();
      status && status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* Footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
