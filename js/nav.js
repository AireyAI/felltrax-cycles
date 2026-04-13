/**
 * Felltrax Cycles — Nav Behaviour
 * Scroll hide/show, mobile menu toggle, smooth anchor scrolling.
 */
(function () {
  'use strict';

  function init() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    // ─── Scroll hide/show ───────────────────────────
    var lastScroll = 0;
    var scrollTicking = false;

    function handleNavScroll() {
      var current = window.scrollY;
      if (current <= 80) {
        nav.classList.remove('scrolled', 'hidden');
      } else if (current > lastScroll + 10) {
        nav.classList.add('hidden');
      } else if (current < lastScroll - 10) {
        nav.classList.remove('hidden');
        nav.classList.add('scrolled');
      }
      lastScroll = current;
    }

    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(function () { handleNavScroll(); scrollTicking = false; });
        scrollTicking = true;
      }
    }, { passive: true });

    // ─── Mobile menu ────────────────────────────────
    var toggle = nav.querySelector('.menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var links = nav.querySelector('.nav-links');
        var isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // ─── Smooth scroll for anchor links ─────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var links = document.getElementById('navLinks');
          if (links && links.classList.contains('open')) links.classList.remove('open');
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Init when components are loaded or immediately if nav already exists
  if (document.querySelector('.nav')) {
    init();
  }
  document.addEventListener('componentsLoaded', init);
})();
