/**
 * Felltrax Cycles — Bike Sizing Quiz
 * Interactive quiz that recommends a bike + size based on rider measurements and style.
 */
(function () {
  'use strict';

  var modal = document.getElementById('sizingQuizModal');
  if (!modal) return;

  var state = { step: 0, height: null, inseam: null, style: null, experience: null };

  var steps = [
    {
      title: 'Your Height',
      html: '<div class="quiz-options">' +
        '<button class="quiz-opt" data-val="150-160">150–160 cm<span>4\'11"–5\'3"</span></button>' +
        '<button class="quiz-opt" data-val="160-170">160–170 cm<span>5\'3"–5\'7"</span></button>' +
        '<button class="quiz-opt" data-val="170-180">170–180 cm<span>5\'7"–5\'11"</span></button>' +
        '<button class="quiz-opt" data-val="180-190">180–190 cm<span>5\'11"–6\'3"</span></button>' +
        '<button class="quiz-opt" data-val="190-200">190–200 cm<span>6\'3"–6\'7"</span></button>' +
      '</div>',
      field: 'height'
    },
    {
      title: 'Inseam Length',
      html: '<div class="quiz-options">' +
        '<button class="quiz-opt" data-val="70-75">70–75 cm<span>27.5"–29.5"</span></button>' +
        '<button class="quiz-opt" data-val="75-80">75–80 cm<span>29.5"–31.5"</span></button>' +
        '<button class="quiz-opt" data-val="80-85">80–85 cm<span>31.5"–33.5"</span></button>' +
        '<button class="quiz-opt" data-val="85-90">85–90 cm<span>33.5"–35.5"</span></button>' +
        '<button class="quiz-opt" data-val="90+">90+ cm<span>35.5"+</span></button>' +
      '</div>',
      field: 'inseam'
    },
    {
      title: 'Riding Style',
      html: '<div class="quiz-options">' +
        '<button class="quiz-opt" data-val="trail">Trail / All-Round<span>Bit of everything</span></button>' +
        '<button class="quiz-opt" data-val="enduro">Enduro / Aggressive<span>Big descents, technical terrain</span></button>' +
        '<button class="quiz-opt" data-val="downhill">Downhill / Gravity<span>Lift-accessed, bike parks</span></button>' +
        '<button class="quiz-opt" data-val="emtb">Electric / E-MTB<span>More laps, less fatigue</span></button>' +
      '</div>',
      field: 'style'
    },
    {
      title: 'Experience Level',
      html: '<div class="quiz-options">' +
        '<button class="quiz-opt" data-val="beginner">Beginner<span>New to mountain biking</span></button>' +
        '<button class="quiz-opt" data-val="intermediate">Intermediate<span>Ride regularly, building skills</span></button>' +
        '<button class="quiz-opt" data-val="advanced">Advanced<span>Confident on technical terrain</span></button>' +
        '<button class="quiz-opt" data-val="expert">Expert<span>Years of experience, race-ready</span></button>' +
      '</div>',
      field: 'experience'
    }
  ];

  function getSize(height) {
    if (height === '150-160') return 'S';
    if (height === '160-170') return 'S/M';
    if (height === '170-180') return 'M/L';
    if (height === '180-190') return 'L';
    return 'XL';
  }

  function getBikeRec(style, experience) {
    var recs = {
      trail: { beginner: 'trail-scout', intermediate: 'trail-scout', advanced: 'trail-ridge-pro', expert: 'trail-ridge-pro' },
      enduro: { beginner: 'enduro-charger', intermediate: 'enduro-charger', advanced: 'enduro-fury', expert: 'enduro-fury' },
      downhill: { beginner: 'dh-slayer', intermediate: 'dh-slayer', advanced: 'dh-gravity-pro', expert: 'dh-gravity-pro' },
      emtb: { beginner: 'e-ridge', intermediate: 'e-ridge', advanced: 'e-power-plus', expert: 'e-power-plus' }
    };
    return (recs[style] || recs.trail)[experience] || 'trail-scout';
  }

  function renderStep() {
    var body = modal.querySelector('.quiz-body');
    var title = modal.querySelector('.quiz-title');
    var progress = modal.querySelector('.quiz-progress-fill');

    if (state.step < steps.length) {
      var s = steps[state.step];
      title.textContent = s.title;
      body.innerHTML = s.html;
      progress.style.width = ((state.step + 1) / (steps.length + 1) * 100) + '%';

      body.querySelectorAll('.quiz-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          state[s.field] = btn.getAttribute('data-val');
          state.step++;
          renderStep();
        });
      });
    } else {
      // Results
      var size = getSize(state.height);
      var bikeId = getBikeRec(state.style, state.experience);
      progress.style.width = '100%';
      title.textContent = 'Your Perfect Fit';

      fetch('data/bikes.json').then(function (r) { return r.json(); }).then(function (bikes) {
        var bike = bikes.find(function (b) { return b.id === bikeId; }) || bikes[0];
        body.innerHTML =
          '<div style="text-align:center;">' +
            '<div style="background:var(--surface-overlay);border:1px solid var(--brand);border-radius:8px;padding:2rem;margin-bottom:1.5rem;">' +
              '<img src="' + bike.image + '" alt="' + bike.name + '" style="width:100%;max-width:400px;border-radius:6px;margin-bottom:1rem;">' +
              '<p style="font-family:Oswald,sans-serif;font-size:0.75rem;color:var(--brand);text-transform:uppercase;letter-spacing:0.1em;">We Recommend</p>' +
              '<h3 style="font-family:Oswald,sans-serif;font-size:1.75rem;color:var(--heading-color);text-transform:uppercase;margin:0.25rem 0;">' + bike.name + '</h3>' +
              '<p style="font-family:Oswald,sans-serif;font-size:1.25rem;color:var(--brand);font-weight:700;margin-bottom:0.5rem;">Size ' + size + '</p>' +
              '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;">' + bike.desc + '</p>' +
            '</div>' +
            '<div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">' +
              '<a href="product.html?id=' + bike.id + '" class="btn-primary" data-magnetic>View Bike</a>' +
              '<button class="btn-ghost" onclick="document.getElementById(\'sizingQuizModal\').classList.remove(\'active\')" data-magnetic>Close</button>' +
            '</div>' +
          '</div>';
      });
    }
  }

  // Open quiz
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-quiz]')) {
      state = { step: 0, height: null, inseam: null, style: null, experience: null };
      modal.classList.add('active');
      renderStep();
    }
  });

  // Close quiz
  modal.querySelector('.quiz-close').addEventListener('click', function () {
    modal.classList.remove('active');
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.classList.remove('active');
  });
})();
