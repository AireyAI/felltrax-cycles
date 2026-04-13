/**
 * Felltrax Cycles — Google Reviews Widget
 * Displays customer reviews with star ratings.
 */
(function () {
  'use strict';

  var container = document.getElementById('reviewsWidget');
  if (!container) return;

  var reviews = [
    { name: 'James T.', rating: 5, date: '2 weeks ago', text: 'Bought my Enduro Charger here. The lads really know their stuff — spent an hour getting the suspension dialled in for my weight. Best bike shop in Cumbria, no question.' },
    { name: 'Sarah K.', rating: 5, date: '1 month ago', text: 'Took my bike in for a full service before a trip to the Alps. Came back running like new. Fair prices and they actually explain what they\'ve done. Will be back.' },
    { name: 'Mike D.', rating: 5, date: '1 month ago', text: 'Great trail advice for Whinlatter. They told us exactly which routes to hit and lent us a pump when ours broke. Proper friendly shop.' },
    { name: 'Emma R.', rating: 4, date: '2 months ago', text: 'Went in looking for my first proper mountain bike. No pressure sales, just honest advice. Ended up with the Trail Scout and absolutely love it on the local trails.' },
    { name: 'Dave W.', rating: 5, date: '2 months ago', text: 'These lot sorted my dropper post same day when another shop said it\'d be a week. Legends. Also, their workshop coffee is surprisingly decent.' },
    { name: 'Tom H.', rating: 5, date: '3 months ago', text: 'Best suspension setup I\'ve ever had. Night and day difference on the descents. Worth every penny of the £45.' }
  ];

  function stars(n) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (i < n ? 'var(--brand)' : 'var(--surface-float)') + '" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
    return s;
  }

  var avg = (reviews.reduce(function (a, r) { return a + r.rating; }, 0) / reviews.length).toFixed(1);

  var html = '<div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem;flex-wrap:wrap;">' +
    '<div style="text-align:center;">' +
      '<div style="font-family:Oswald,sans-serif;font-size:3.5rem;font-weight:700;color:var(--brand);line-height:1;">' + avg + '</div>' +
      '<div style="display:flex;gap:2px;justify-content:center;margin:0.5rem 0;">' + stars(Math.round(avg)) + '</div>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);">' + reviews.length + ' reviews</p>' +
    '</div>' +
    '<div style="flex:1;min-width:200px;">' +
      '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;"><span style="font-size:0.75rem;color:var(--text-muted);width:2rem;">5★</span><div style="flex:1;height:6px;background:var(--surface-overlay);border-radius:3px;overflow:hidden;"><div style="height:100%;width:83%;background:var(--brand);border-radius:3px;"></div></div></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;"><span style="font-size:0.75rem;color:var(--text-muted);width:2rem;">4★</span><div style="flex:1;height:6px;background:var(--surface-overlay);border-radius:3px;overflow:hidden;"><div style="height:100%;width:17%;background:var(--brand);border-radius:3px;"></div></div></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;"><span style="font-size:0.75rem;color:var(--text-muted);width:2rem;">3★</span><div style="flex:1;height:6px;background:var(--surface-overlay);border-radius:3px;overflow:hidden;"><div style="height:100%;width:0%;background:var(--brand);border-radius:3px;"></div></div></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;"><span style="font-size:0.75rem;color:var(--text-muted);width:2rem;">2★</span><div style="flex:1;height:6px;background:var(--surface-overlay);border-radius:3px;overflow:hidden;"><div style="height:100%;width:0%;background:var(--brand);border-radius:3px;"></div></div></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;"><span style="font-size:0.75rem;color:var(--text-muted);width:2rem;">1★</span><div style="flex:1;height:6px;background:var(--surface-overlay);border-radius:3px;overflow:hidden;"><div style="height:100%;width:0%;background:var(--brand);border-radius:3px;"></div></div></div>' +
    '</div>' +
  '</div>';

  html += '<div class="reviews-scroll">';
  reviews.forEach(function (r) {
    html += '<div class="review-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">' +
        '<div style="display:flex;align-items:center;gap:0.75rem;">' +
          '<div style="width:40px;height:40px;background:rgba(var(--brand-rgb),0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Oswald,sans-serif;font-weight:700;color:var(--brand);font-size:1rem;">' + r.name.charAt(0) + '</div>' +
          '<div><p style="font-weight:600;color:var(--heading-color);font-size:0.9rem;">' + r.name + '</p>' +
          '<div style="display:flex;gap:1px;">' + stars(r.rating) + '</div></div>' +
        '</div>' +
        '<span style="font-size:0.75rem;color:var(--text-muted);">' + r.date + '</span>' +
      '</div>' +
      '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;">' + r.text + '</p>' +
    '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
})();
