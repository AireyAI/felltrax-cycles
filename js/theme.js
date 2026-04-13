/**
 * Felltrax Cycles — Dark/Light Theme Toggle
 * Persists choice via localStorage, respects prefers-color-scheme on first visit.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'felltrax-theme';

  function getPreferred() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update meta theme-color
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#F5F5F0');
  }

  function toggle() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  // Apply immediately (before paint)
  applyTheme(getPreferred());

  // Bind toggle buttons once components are loaded
  function bindToggles() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });
  }

  // Components might already be loaded or not yet
  if (document.querySelector('.theme-toggle')) {
    bindToggles();
  }
  document.addEventListener('componentsLoaded', bindToggles);
})();
