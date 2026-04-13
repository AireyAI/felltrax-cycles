/**
 * Felltrax Cycles — Shop Page
 * Loads bikes from JSON, renders grid, handles category filtering.
 */
(function () {
  'use strict';

  var grid = document.getElementById('shopGrid');
  if (!grid) return;

  var bikes = [];
  var activeFilter = 'all';

  function createCard(bike) {
    var card = document.createElement('div');
    card.className = 'bike-card';
    card.setAttribute('data-category', bike.category);
    card.setAttribute('data-stagger-child', '');
    card.setAttribute('data-tilt', '');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', bike.name);

    card.innerHTML =
      '<div class="bike-card-img">' +
        '<img src="' + bike.image + '" alt="' + bike.alt + '" loading="lazy" width="800" height="600">' +
      '</div>' +
      '<div class="bike-card-body">' +
        '<p class="bike-card-category">' + bike.categoryLabel + '</p>' +
        '<h3 class="bike-card-name">' + bike.name + '</h3>' +
        '<p class="bike-card-desc">' + bike.desc + '</p>' +
        '<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem;">' +
          '<span style="font-size:0.75rem;color:var(--text-muted);background:var(--surface-overlay);padding:0.25rem 0.6rem;border-radius:4px;">' + bike.travel + '</span>' +
          '<span style="font-size:0.75rem;color:var(--text-muted);background:var(--surface-overlay);padding:0.25rem 0.6rem;border-radius:4px;">' + bike.wheel + '</span>' +
          '<span style="font-size:0.75rem;color:var(--text-muted);background:var(--surface-overlay);padding:0.25rem 0.6rem;border-radius:4px;">' + bike.weight + '</span>' +
        '</div>' +
        '<p class="bike-card-price">' + bike.priceLabel + ' <span>' + bike.priceSuffix + '</span></p>' +
        '<button class="compare-toggle" data-compare="' + bike.id + '" aria-label="Add to comparison" style="background:var(--surface-overlay);border:1px solid var(--border);color:var(--text-muted);padding:0.4rem 0.8rem;font-family:Oswald,sans-serif;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;cursor:pointer;transition:border-color 0.2s,color 0.2s,background 0.2s;margin-top:0.5rem;display:inline-flex;align-items:center;gap:0.4rem;">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>' +
          'Compare' +
        '</button>' +
      '</div>';

    // Click to go to product page
    card.addEventListener('click', function () {
      window.location.href = 'product.html?id=' + bike.id;
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') window.location.href = 'product.html?id=' + bike.id;
    });

    return card;
  }

  function renderBikes() {
    grid.innerHTML = '';
    var filtered = activeFilter === 'all' ? bikes : bikes.filter(function (b) { return b.category === activeFilter; });
    filtered.forEach(function (bike) {
      grid.appendChild(createCard(bike));
    });

    // Re-init GSAP animations for new cards
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  function bindFilters() {
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderBikes();
      });
    });
  }

  // Load bike data
  fetch('data/bikes.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      bikes = data;
      renderBikes();
      bindFilters();
    })
    .catch(function (err) {
      console.error('Failed to load bike data:', err);
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">Failed to load bikes. Please refresh.</p>';
    });
})();
