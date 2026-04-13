/**
 * Felltrax Cycles — Product Detail Page
 * Loads bike data from JSON based on URL query param ?id=bike-id
 */
(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var bikeId = params.get('id');
  if (!bikeId) { window.location.href = 'shop.html'; return; }

  fetch('data/bikes.json')
    .then(function (r) { return r.json(); })
    .then(function (bikes) {
      var bike = bikes.find(function (b) { return b.id === bikeId; });
      if (!bike) { window.location.href = 'shop.html'; return; }

      // Update page title and meta
      document.getElementById('pageTitle').textContent = bike.name + ' — Felltrax Cycles';
      document.getElementById('pageDesc').setAttribute('content', bike.desc);

      // Breadcrumb
      document.getElementById('breadcrumbName').textContent = bike.name;

      // Product info
      document.getElementById('productImage').src = bike.image;
      document.getElementById('productImage').alt = bike.alt;
      document.getElementById('productCategory').textContent = bike.categoryLabel;
      document.getElementById('productName').textContent = bike.name;
      document.getElementById('productPrice').textContent = bike.priceLabel;
      document.getElementById('productPriceSuffix').textContent = bike.priceSuffix;
      document.getElementById('productDesc').textContent = bike.desc;

      // Condition & size badges
      var conditionEl = document.getElementById('productCondition');
      if (conditionEl && bike.condition) {
        conditionEl.textContent = bike.condition;
        conditionEl.style.display = 'inline-block';
      }
      var sizeEl = document.getElementById('productSize');
      if (sizeEl && bike.size) {
        sizeEl.textContent = 'Size ' + bike.size;
        sizeEl.style.display = 'inline-block';
      }

      // Specs table
      var specs = [
        ['Condition', bike.condition || 'Used'],
        ['Size', bike.size || 'See description'],
        ['Travel', bike.travel],
        ['Wheel Size', bike.wheel],
        ['Weight', bike.weight],
        ['Groupset', bike.groupset],
        ['Category', bike.categoryLabel]
      ];

      var tbody = document.querySelector('#specTable tbody');
      specs.forEach(function (s) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + s[0] + '</td><td>' + s[1] + '</td>';
        tbody.appendChild(tr);
      });

      // Size selector
      document.querySelectorAll('.size-option').forEach(function (opt) {
        opt.addEventListener('click', function () {
          document.querySelectorAll('.size-option').forEach(function (o) { o.classList.remove('selected'); });
          opt.classList.add('selected');
        });
        opt.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opt.click(); }
        });
      });

      // Related bikes (same category, excluding current)
      var related = bikes.filter(function (b) { return b.category === bike.category && b.id !== bike.id; });
      // If fewer than 3, add bikes from other categories
      if (related.length < 3) {
        var others = bikes.filter(function (b) { return b.id !== bike.id && b.category !== bike.category; });
        related = related.concat(others.slice(0, 3 - related.length));
      }

      var relatedGrid = document.getElementById('relatedGrid');
      related.slice(0, 3).forEach(function (rb) {
        var card = document.createElement('a');
        card.href = 'product.html?id=' + rb.id;
        card.className = 'bike-card';
        card.setAttribute('data-stagger-child', '');
        card.setAttribute('data-tilt', '');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', rb.name);
        card.style.textDecoration = 'none';

        card.innerHTML =
          '<div class="bike-card-img">' +
            '<img src="' + rb.image + '" alt="' + rb.alt + '" loading="lazy" width="800" height="600">' +
          '</div>' +
          '<div class="bike-card-body">' +
            '<p class="bike-card-category">' + rb.categoryLabel + '</p>' +
            '<h3 class="bike-card-name">' + rb.name + '</h3>' +
            '<p class="bike-card-desc">' + rb.desc.substring(0, 80) + '...</p>' +
            '<p class="bike-card-price">' + rb.priceLabel + ' <span>' + rb.priceSuffix + '</span></p>' +
          '</div>';

        relatedGrid.appendChild(card);
      });

      // Refresh ScrollTrigger for new elements
      if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 100);
    })
    .catch(function () {
      window.location.href = 'shop.html';
    });
})();
