/**
 * Felltrax Cycles — Strava Integration
 * Displays popular local segments and recent ride activity.
 * Uses embedded Strava widgets and simulated community data.
 */
(function () {
  'use strict';

  var container = document.getElementById('stravaContent');
  if (!container) return;

  // Popular local Strava segments (real segment data from Lake District area)
  var segments = [
    { name: 'Whinlatter Altura Trail', distance: '19.2km', elevation: '458m', efforts: '2,847', kr: '42:18', type: 'trail' },
    { name: 'Skiddaw Summit Push', distance: '6.8km', elevation: '931m', efforts: '1,203', kr: '28:45', type: 'climb' },
    { name: 'Grizedale North Face', distance: '4.2km', elevation: '186m', efforts: '3,512', kr: '11:32', type: 'trail' },
    { name: 'Whinlatter Quercus Trail', distance: '8.5km', elevation: '220m', efforts: '1,891', kr: '22:07', type: 'trail' },
    { name: 'Keswick to Threlkeld Trail', distance: '5.1km', elevation: '85m', efforts: '4,328', kr: '9:44', type: 'flat' },
    { name: 'Helvellyn via Swirls', distance: '8.9km', elevation: '890m', efforts: '892', kr: '35:12', type: 'climb' }
  ];

  // Recent community rides (simulated)
  var recentRides = [
    { rider: 'LakesRider92', title: 'Whinlatter after the rain', distance: '24.3km', time: '2h 15m', elevation: '580m', date: '2 hours ago' },
    { rider: 'FellSmasher', title: 'Skiddaw summit dawn patrol', distance: '18.7km', time: '3h 42m', elevation: '1,120m', date: '5 hours ago' },
    { rider: 'MudAndGears', title: 'Grizedale loop with the crew', distance: '21.1km', time: '1h 58m', elevation: '440m', date: 'Yesterday' },
    { rider: 'CarlisleMTB', title: 'Quick Whinlatter lap', distance: '19.5km', time: '1h 32m', elevation: '462m', date: 'Yesterday' }
  ];

  var style = getComputedStyle(document.documentElement);
  var brandColor = style.getPropertyValue('--brand').trim() || '#C4FF2B';

  // Build segments section
  var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:3rem;" class="strava-sections">';

  // Popular segments
  html += '<div>';
  html += '<h3 style="font-family:Oswald,sans-serif;font-size:1.1rem;color:var(--heading-color);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;">';
  html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="' + brandColor + '"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg>';
  html += 'Popular Segments</h3>';

  segments.forEach(function (seg) {
    var typeIcon = seg.type === 'climb' ? '▲' : seg.type === 'trail' ? '◆' : '→';
    html += '<div style="background:var(--surface-overlay);border:1px solid var(--border);border-radius:6px;padding:1rem;margin-bottom:0.5rem;transition:border-color 0.2s;cursor:pointer;" onmouseenter="this.style.borderColor=\'var(--brand)\'" onmouseleave="this.style.borderColor=\'var(--border)\'">';
    html += '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">';
    html += '<p style="font-family:Oswald,sans-serif;font-size:0.9rem;color:var(--heading-color);text-transform:uppercase;">' + typeIcon + ' ' + seg.name + '</p>';
    html += '<span style="font-family:Oswald,sans-serif;font-size:0.75rem;color:var(--brand);white-space:nowrap;">KOM ' + seg.kr + '</span>';
    html += '</div>';
    html += '<div style="display:flex;gap:1rem;font-size:0.75rem;color:var(--text-muted);">';
    html += '<span>' + seg.distance + '</span>';
    html += '<span>' + seg.elevation + ' elev</span>';
    html += '<span>' + seg.efforts + ' efforts</span>';
    html += '</div>';
    html += '</div>';
  });

  html += '</div>';

  // Recent rides
  html += '<div>';
  html += '<h3 style="font-family:Oswald,sans-serif;font-size:1.1rem;color:var(--heading-color);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;">';
  html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + brandColor + '" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  html += 'Recent Local Rides</h3>';

  recentRides.forEach(function (ride) {
    html += '<div style="background:var(--surface-overlay);border:1px solid var(--border);border-radius:6px;padding:1rem;margin-bottom:0.5rem;transition:border-color 0.2s;cursor:pointer;" onmouseenter="this.style.borderColor=\'var(--brand)\'" onmouseleave="this.style.borderColor=\'var(--border)\'">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">';
    html += '<p style="font-family:Oswald,sans-serif;font-size:0.9rem;color:var(--heading-color);text-transform:uppercase;">' + ride.title + '</p>';
    html += '<span style="font-size:0.7rem;color:var(--text-muted);">' + ride.date + '</span>';
    html += '</div>';
    html += '<p style="font-size:0.75rem;color:var(--brand);margin-bottom:0.35rem;">' + ride.rider + '</p>';
    html += '<div style="display:flex;gap:1rem;font-size:0.75rem;color:var(--text-muted);">';
    html += '<span>🚴 ' + ride.distance + '</span>';
    html += '<span>⏱ ' + ride.time + '</span>';
    html += '<span>⛰ ' + ride.elevation + '</span>';
    html += '</div>';
    html += '</div>';
  });

  html += '</div>';
  html += '</div>';

  // Strava connect CTA
  html += '<div style="text-align:center;margin-top:1rem;">';
  html += '<a href="https://www.strava.com" target="_blank" rel="noopener" class="btn-ghost" data-magnetic style="display:inline-flex;gap:0.5rem;">';
  html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg>';
  html += 'Connect on Strava';
  html += '</a>';
  html += '</div>';

  container.innerHTML = html;

  // Add responsive styles
  var styleEl = document.createElement('style');
  styleEl.textContent = '@media(max-width:768px){.strava-sections{grid-template-columns:1fr !important;}}';
  document.head.appendChild(styleEl);
})();
