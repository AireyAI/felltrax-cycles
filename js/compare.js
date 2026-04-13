/**
 * Felltrax Cycles — Bike Comparison Tool
 * Select 2-3 bikes to compare specs side by side.
 */
(function () {
  'use strict';

  var modal = document.getElementById('compareModal');
  if (!modal) return;

  var selected = [];
  var allBikes = [];

  function updateBadge() {
    var badge = document.getElementById('compareBadge');
    if (badge) {
      badge.textContent = selected.length;
      badge.style.display = selected.length > 0 ? 'flex' : 'none';
    }
  }

  function renderComparison() {
    if (selected.length < 2) return;
    var body = modal.querySelector('.compare-body');

    var bikes = selected.map(function (id) {
      return allBikes.find(function (b) { return b.id === id; });
    }).filter(Boolean);

    var cols = bikes.length;
    var specs = ['travel', 'wheel', 'weight', 'groupset'];
    var specLabels = { travel: 'Travel', wheel: 'Wheel Size', weight: 'Weight', groupset: 'Groupset' };

    var html = '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:1.5rem;">';

    bikes.forEach(function (bike) {
      html += '<div style="text-align:center;">' +
        '<img src="' + bike.image + '" alt="' + bike.name + '" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px;border:1px solid var(--border);margin-bottom:1rem;">' +
        '<p style="font-family:Oswald,sans-serif;font-size:0.7rem;color:var(--brand);text-transform:uppercase;letter-spacing:0.1em;">' + bike.categoryLabel + '</p>' +
        '<h3 style="font-family:Oswald,sans-serif;font-size:1.2rem;color:var(--heading-color);text-transform:uppercase;margin:0.25rem 0;">' + bike.name + '</h3>' +
        '<p style="font-family:Oswald,sans-serif;font-size:1.1rem;color:var(--brand);font-weight:700;">' + bike.priceLabel + '</p>' +
      '</div>';
    });
    html += '</div>';

    html += '<table style="width:100%;border-collapse:collapse;margin-top:2rem;">';
    specs.forEach(function (key) {
      html += '<tr style="border-bottom:1px solid var(--border);">';
      html += '<td style="padding:0.75rem 0;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;width:120px;">' + specLabels[key] + '</td>';
      bikes.forEach(function (bike) {
        html += '<td style="padding:0.75rem 0;color:var(--heading-color);font-weight:500;text-align:center;">' + bike[key] + '</td>';
      });
      html += '</tr>';
    });

    // Derived specs
    var derived = [
      { label: 'Frame', fn: function (b) { return b.price > 3000 ? 'Full Carbon' : b.price > 2500 ? 'Carbon/Alloy' : 'Alloy'; } },
      { label: 'Brakes', fn: function (b) { return b.price > 3000 ? '4-Piston' : '2-Piston'; } },
      { label: 'Price', fn: function (b) { return b.priceLabel; } }
    ];
    derived.forEach(function (d) {
      html += '<tr style="border-bottom:1px solid var(--border);">';
      html += '<td style="padding:0.75rem 0;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">' + d.label + '</td>';
      bikes.forEach(function (bike) {
        html += '<td style="padding:0.75rem 0;color:var(--heading-color);font-weight:500;text-align:center;">' + d.fn(bike) + '</td>';
      });
      html += '</tr>';
    });
    html += '</table>';

    body.innerHTML = html;
    modal.classList.add('active');
  }

  // Toggle compare on bike cards
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-compare]');
    if (btn) {
      e.stopPropagation();
      var id = btn.getAttribute('data-compare');
      var idx = selected.indexOf(id);
      if (idx > -1) {
        selected.splice(idx, 1);
        btn.classList.remove('compare-active');
      } else if (selected.length < 3) {
        selected.push(id);
        btn.classList.add('compare-active');
      }
      updateBadge();
    }
  });

  // Open comparison
  document.addEventListener('click', function (e) {
    if (e.target.closest('#compareBtn')) {
      if (selected.length >= 2) renderComparison();
    }
  });

  // Close
  if (modal.querySelector('.compare-close')) {
    modal.querySelector('.compare-close').addEventListener('click', function () {
      modal.classList.remove('active');
    });
  }
  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Load bike data
  fetch('data/bikes.json').then(function (r) { return r.json(); }).then(function (data) {
    allBikes = data;
  });

  window.felltraxCompare = { selected: selected, updateBadge: updateBadge };
})();
