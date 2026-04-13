/**
 * Felltrax Cycles — Finance Calculator
 * Monthly payment calculator on product pages.
 */
(function () {
  'use strict';

  var container = document.getElementById('financeCalc');
  if (!container) return;

  function render(price) {
    var terms = [12, 24, 36, 48];
    var rate = 0.099; // 9.9% APR

    container.innerHTML =
      '<div style="background:var(--surface-overlay);border:1px solid var(--border);border-radius:8px;padding:1.5rem;margin-top:1.5rem;">' +
        '<h3 style="font-family:Oswald,sans-serif;font-size:0.9rem;color:var(--heading-color);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' +
          'Finance Available' +
        '</h3>' +
        '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;">Spread the cost with 0% deposit finance. Representative 9.9% APR.</p>' +
        '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;" id="financeTerms"></div>' +
        '<div id="financeResult" style="margin-top:1rem;text-align:center;"></div>' +
      '</div>';

    var termsContainer = document.getElementById('financeTerms');
    var result = document.getElementById('financeResult');

    function calcMonthly(months) {
      var monthlyRate = rate / 12;
      var payment = price * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      return payment.toFixed(2);
    }

    function showResult(months) {
      var monthly = calcMonthly(months);
      var total = (monthly * months).toFixed(2);
      result.innerHTML =
        '<p style="font-family:Oswald,sans-serif;font-size:2rem;color:var(--brand);font-weight:700;">£' + monthly + '<span style="font-size:0.9rem;color:var(--text-muted);font-family:DM Sans,sans-serif;font-weight:400;">/month</span></p>' +
        '<p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">' + months + ' months · Total £' + total + ' · 9.9% APR</p>';
    }

    terms.forEach(function (m) {
      var btn = document.createElement('button');
      btn.className = 'filter-btn' + (m === 24 ? ' active' : '');
      btn.textContent = m + ' months';
      btn.style.cssText = 'flex:1;min-width:70px;font-size:0.75rem;padding:0.5rem;';
      btn.addEventListener('click', function () {
        termsContainer.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        showResult(m);
      });
      termsContainer.appendChild(btn);
    });

    showResult(24);
  }

  // Wait for product data to load, then render
  var observer = new MutationObserver(function () {
    var priceEl = document.getElementById('productPrice');
    if (priceEl && priceEl.textContent !== '—') {
      var match = priceEl.textContent.match(/[\d,]+/);
      if (match) {
        render(parseInt(match[0].replace(/,/g, '')));
        observer.disconnect();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
