/**
 * Felltrax Cycles — UI Extras
 * Scroll progress bar, back to top button, lightbox, skeleton screens, WhatsApp, cookies.
 */
(function () {
  'use strict';

  // ─── Scroll Progress Bar ─────────────────────────
  var progressBar = document.createElement('div');
  progressBar.id = 'scrollProgress';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--brand);z-index:9997;width:0;transition:width 0.1s linear;pointer-events:none;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ─── Back to Top Button ───────────────────────────
  var topBtn = document.createElement('button');
  topBtn.id = 'backToTop';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>';
  topBtn.style.cssText = 'position:fixed;bottom:5rem;right:2rem;z-index:900;width:44px;height:44px;border-radius:50%;background:var(--brand);color:#0A0A0A;border:none;cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.3);transition:transform 0.2s,opacity 0.3s;opacity:0;';
  document.body.appendChild(topBtn);

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 600) {
      topBtn.style.display = 'flex';
      setTimeout(function () { topBtn.style.opacity = '1'; }, 10);
    } else {
      topBtn.style.opacity = '0';
      setTimeout(function () { topBtn.style.display = 'none'; }, 300);
    }
  }, { passive: true });

  // ─── WhatsApp Floating Button ─────────────────────
  var waBtn = document.createElement('a');
  waBtn.id = 'whatsappBtn';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  waBtn.setAttribute('target', '_blank');
  waBtn.setAttribute('rel', 'noopener');
  // No hardcoded number — this gets set per deployment
  waBtn.href = 'https://wa.me/?text=Hi%20Felltrax%2C%20I%27d%20like%20to%20enquire%20about...';
  waBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  waBtn.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:900;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(37,211,102,0.4);transition:transform 0.2s;';
  document.body.appendChild(waBtn);

  waBtn.addEventListener('mouseenter', function () { waBtn.style.transform = 'scale(1.1)'; });
  waBtn.addEventListener('mouseleave', function () { waBtn.style.transform = 'scale(1)'; });

  // ─── Cookie Consent Banner ────────────────────────
  if (!localStorage.getItem('felltrax-cookies')) {
    var cookie = document.createElement('div');
    cookie.id = 'cookieBanner';
    cookie.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9996;background:var(--surface-raised);border-top:1px solid var(--border);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;backdrop-filter:blur(16px);';
    cookie.innerHTML =
      '<p style="font-size:0.85rem;color:var(--text-secondary);flex:1;min-width:200px;">We use cookies to improve your experience. By continuing to browse, you agree to our use of cookies. <a href="#" style="color:var(--brand);text-decoration:underline;">Privacy Policy</a></p>' +
      '<div style="display:flex;gap:0.5rem;">' +
        '<button id="cookieAccept" style="background:var(--brand);color:#0A0A0A;border:none;padding:0.6rem 1.5rem;font-family:Oswald,sans-serif;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;cursor:pointer;">Accept</button>' +
        '<button id="cookieDecline" style="background:none;border:1px solid var(--border);color:var(--text-secondary);padding:0.6rem 1rem;font-family:Oswald,sans-serif;font-size:0.8rem;font-weight:600;text-transform:uppercase;cursor:pointer;">Decline</button>' +
      '</div>';
    document.body.appendChild(cookie);

    document.getElementById('cookieAccept').addEventListener('click', function () {
      localStorage.setItem('felltrax-cookies', 'accepted');
      cookie.style.transform = 'translateY(100%)';
      cookie.style.transition = 'transform 0.3s ease';
      setTimeout(function () { cookie.remove(); }, 400);
    });
    document.getElementById('cookieDecline').addEventListener('click', function () {
      localStorage.setItem('felltrax-cookies', 'declined');
      cookie.style.transform = 'translateY(100%)';
      cookie.style.transition = 'transform 0.3s ease';
      setTimeout(function () { cookie.remove(); }, 400);
    });
  }

  // ─── Gallery Lightbox ─────────────────────────────
  var lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = 'position:fixed;inset:0;z-index:9995;background:rgba(0,0,0,0.95);display:none;align-items:center;justify-content:center;cursor:zoom-out;opacity:0;transition:opacity 0.3s ease;';
  lightbox.innerHTML = '<img style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:4px;box-shadow:0 8px 32px rgba(0,0,0,0.5);" alt="">';
  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', function () {
    lightbox.style.opacity = '0';
    setTimeout(function () { lightbox.style.display = 'none'; }, 300);
  });

  document.addEventListener('click', function (e) {
    var item = e.target.closest('.gallery-item img');
    if (item) {
      e.preventDefault();
      lightbox.querySelector('img').src = item.src;
      lightbox.querySelector('img').alt = item.alt;
      lightbox.style.display = 'flex';
      setTimeout(function () { lightbox.style.opacity = '1'; }, 10);
    }
  });

  // ─── Skeleton Screens ────────────────────────────
  // Add shimmer to elements that load async
  var style = document.createElement('style');
  style.textContent =
    '@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}' +
    '.skeleton{background:linear-gradient(90deg,var(--surface-overlay) 25%,var(--surface-float) 50%,var(--surface-overlay) 75%);background-size:200% 100%;animation:shimmer 1.5s ease infinite;border-radius:6px;min-height:20px;}' +
    '.skeleton-card{aspect-ratio:4/3;border-radius:8px;}' +
    '.skeleton-text{height:14px;margin-bottom:8px;width:80%;}' +
    '.skeleton-title{height:24px;margin-bottom:12px;width:60%;}';
  document.head.appendChild(style);

})();
