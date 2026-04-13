/**
 * Felltrax Cycles — Component Include System
 * Loads shared nav and footer partials into each page.
 */
(function () {
  'use strict';

  function loadComponent(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return Promise.resolve();
    return fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        el.innerHTML = html;
        // Re-run any inline scripts inside the loaded component
        el.querySelectorAll('script').forEach(function (old) {
          var s = document.createElement('script');
          if (old.src) { s.src = old.src; } else { s.textContent = old.textContent; }
          old.replaceWith(s);
        });
      });
  }

  // Determine base path (supports nested pages like /pages/foo.html)
  var basePath = '';
  var depth = (window.location.pathname.match(/\//g) || []).length - 1;
  // If served from root, depth is 0; components are in /components/
  // This simple approach works for a flat site structure

  Promise.all([
    loadComponent('#nav-placeholder', basePath + 'components/nav.html'),
    loadComponent('#footer-placeholder', basePath + 'components/footer.html')
  ]).then(function () {
    // Highlight active nav link
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      var href = link.getAttribute('href').split('/').pop();
      if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Dispatch event so other scripts know components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  });
})();
