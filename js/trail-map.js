/**
 * Felltrax Cycles — Interactive Trail Map
 * Mapbox GL JS trail map with clickable markers and trail detail popups.
 */
(function () {
  'use strict';

  var mapContainer = document.getElementById('trailMapBox');
  if (!mapContainer) return;

  // Mapbox public token (free tier)
  var MAPBOX_TOKEN = 'pk.eyJ1IjoiZmVsbHRyYXgiLCJhIjoiY2x3ZGVteTF4MDBxMzJpcXJ6d3R5Z2tnaSJ9.placeholder';

  var trails = [];

  function initMap() {
    // If Mapbox isn't available, use a static fallback
    if (typeof mapboxgl === 'undefined') {
      renderStaticMap();
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    var map = new mapboxgl.Map({
      container: 'trailMapBox',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-3.1, 54.55],
      zoom: 9.5,
      pitch: 30,
      bearing: -10,
      attributionControl: false
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', function () {
      // Add trail markers
      trails.forEach(function (trail) {
        var el = document.createElement('div');
        el.className = 'trail-marker';
        el.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--brand)" stroke="#0A0A0A" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#0A0A0A"/></svg>';
        el.style.cursor = 'pointer';

        var popup = new mapboxgl.Popup({ offset: 25, closeButton: false, maxWidth: '300px' })
          .setHTML(
            '<div style="font-family:DM Sans,sans-serif;">' +
              '<img src="' + trail.image + '" style="width:100%;height:120px;object-fit:cover;border-radius:4px;margin-bottom:8px;" alt="' + trail.name + '">' +
              '<h3 style="font-family:Oswald,sans-serif;font-size:1.1rem;text-transform:uppercase;margin-bottom:4px;">' + trail.name + '</h3>' +
              '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">' +
                '<span class="trail-badge ' + trail.difficultyClass + '" style="font-size:0.65rem;padding:2px 6px;">' + trail.difficulty + '</span>' +
                '<span class="trail-badge info" style="font-size:0.65rem;padding:2px 6px;">' + trail.distance + '</span>' +
                '<span class="trail-badge info" style="font-size:0.65rem;padding:2px 6px;">' + trail.driveTime + '</span>' +
              '</div>' +
              '<p style="font-size:0.8rem;color:#999;line-height:1.5;">' + trail.desc.substring(0, 120) + '...</p>' +
            '</div>'
          );

        new mapboxgl.Marker(el)
          .setLngLat([trail.lng, trail.lat])
          .setPopup(popup)
          .addTo(map);
      });

      // Add terrain
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    });
  }

  function renderStaticMap() {
    // Fallback: render an interactive CSS/JS map with trail pins
    var style = getComputedStyle(document.documentElement);
    var brandColor = style.getPropertyValue('--brand').trim() || '#C4FF2B';

    mapContainer.style.position = 'relative';
    mapContainer.style.background = 'linear-gradient(135deg, #1a2a1a 0%, #0d1a0d 50%, #1a1a2a 100%)';
    mapContainer.style.overflow = 'hidden';

    // Topographic lines decoration
    var topoSvg = '<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.08;" viewBox="0 0 800 400" preserveAspectRatio="none">' +
      '<path d="M0 200 Q100 150 200 180 Q300 210 400 170 Q500 130 600 190 Q700 250 800 200" fill="none" stroke="' + brandColor + '" stroke-width="1"/>' +
      '<path d="M0 220 Q100 170 200 200 Q300 230 400 190 Q500 150 600 210 Q700 270 800 220" fill="none" stroke="' + brandColor + '" stroke-width="1"/>' +
      '<path d="M0 240 Q100 190 200 220 Q300 250 400 210 Q500 170 600 230 Q700 290 800 240" fill="none" stroke="' + brandColor + '" stroke-width="1"/>' +
      '<path d="M0 180 Q100 130 200 160 Q300 190 400 150 Q500 110 600 170 Q700 230 800 180" fill="none" stroke="' + brandColor + '" stroke-width="1"/>' +
      '<path d="M0 260 Q100 210 200 240 Q300 270 400 230 Q500 190 600 250 Q700 310 800 260" fill="none" stroke="' + brandColor + '" stroke-width="1"/>' +
    '</svg>';
    mapContainer.insertAdjacentHTML('afterbegin', topoSvg);

    // Place markers based on approximate positions
    // Map bounds: lat 54.2-55.3, lng -3.5 to -2.5
    trails.forEach(function (trail) {
      var x = ((trail.lng - (-3.5)) / ((-2.5) - (-3.5))) * 100;
      var y = ((55.3 - trail.lat) / (55.3 - 54.2)) * 100;

      var pin = document.createElement('div');
      pin.style.cssText = 'position:absolute;left:' + x + '%;top:' + y + '%;transform:translate(-50%,-100%);cursor:pointer;z-index:5;transition:transform 0.2s;';
      pin.innerHTML =
        '<svg width="32" height="32" viewBox="0 0 24 24" fill="' + brandColor + '" stroke="#0A0A0A" stroke-width="1.5" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">' +
          '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>' +
          '<circle cx="12" cy="10" r="3" fill="#0A0A0A"/>' +
        '</svg>' +
        '<div style="position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);white-space:nowrap;font-family:Oswald,sans-serif;font-size:0.65rem;color:white;text-transform:uppercase;letter-spacing:0.05em;text-shadow:0 1px 3px rgba(0,0,0,0.8);opacity:0.8;">' + trail.name + '</div>';

      pin.addEventListener('mouseenter', function () { pin.style.transform = 'translate(-50%,-100%) scale(1.2)'; });
      pin.addEventListener('mouseleave', function () { pin.style.transform = 'translate(-50%,-100%) scale(1)'; });

      // Click to scroll to trail card
      pin.addEventListener('click', function () {
        var target = document.querySelector('[data-trail="' + trail.id + '"]');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      mapContainer.appendChild(pin);
    });

    // Carlisle shop marker
    var shopX = (((-2.9407) - (-3.5)) / ((-2.5) - (-3.5))) * 100;
    var shopY = ((55.3 - 54.8925) / (55.3 - 54.2)) * 100;
    var shopPin = document.createElement('div');
    shopPin.style.cssText = 'position:absolute;left:' + shopX + '%;top:' + shopY + '%;transform:translate(-50%,-100%);z-index:6;';
    shopPin.innerHTML =
      '<div style="background:' + brandColor + ';color:#0A0A0A;padding:4px 10px;border-radius:4px;font-family:Oswald,sans-serif;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.4);">Felltrax HQ</div>' +
      '<div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid ' + brandColor + ';margin:0 auto;"></div>';
    mapContainer.appendChild(shopPin);
  }

  // Load trail data then init
  fetch('data/trails.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      trails = data;
      initMap();
    })
    .catch(function (err) {
      console.error('Failed to load trail data:', err);
    });
})();
