/**
 * Felltrax Cycles — Booking System
 * Multi-step booking: service → date/time → details → confirmation
 */
(function () {
  'use strict';

  var state = {
    step: 1,
    service: null,
    date: null,
    time: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];

  // ─── Step navigation ──────────────────────────────
  function goToStep(n) {
    state.step = n;
    for (var i = 1; i <= 4; i++) {
      var el = document.getElementById('step' + i);
      if (el) el.classList.toggle('active', i === n);
    }
    // Update dots
    document.querySelectorAll('.step-dot').forEach(function (dot) {
      var s = parseInt(dot.getAttribute('data-step'));
      dot.classList.toggle('active', s === n);
      dot.classList.toggle('completed', s < n);
    });
    // Show/hide nav
    var prevBtn = document.getElementById('btnPrev');
    var nextBtn = document.getElementById('btnNext');
    var stepNav = document.getElementById('stepNav');
    if (n === 1) { prevBtn.style.display = 'none'; nextBtn.style.display = ''; }
    else if (n === 4) { stepNav.style.display = 'none'; }
    else { prevBtn.style.display = ''; nextBtn.style.display = ''; stepNav.style.display = 'flex'; }

    // Update next button text
    if (n === 3) nextBtn.innerHTML = 'Confirm Booking <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    else nextBtn.innerHTML = 'Next <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Service selection ────────────────────────────
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.service-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      state.service = card.getAttribute('data-service');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  // ─── Calendar ─────────────────────────────────────
  function renderCalendar() {
    var calGrid = document.getElementById('calGrid');
    var calMonth = document.getElementById('calMonth');

    calMonth.textContent = MONTHS[state.month] + ' ' + state.year;

    // Remove old day buttons (keep labels)
    calGrid.querySelectorAll('.cal-day').forEach(function (d) { d.remove(); });

    var firstDay = new Date(state.year, state.month, 1).getDay();
    // Convert Sunday=0 to Monday-start: Mon=0, Tue=1, ... Sun=6
    var startOffset = (firstDay + 6) % 7;
    var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells
    for (var i = 0; i < startOffset; i++) {
      var empty = document.createElement('div');
      empty.className = 'cal-day disabled';
      calGrid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var btn = document.createElement('button');
      btn.className = 'cal-day';
      btn.textContent = d;
      var dateObj = new Date(state.year, state.month, d);

      // Disable past dates and Sundays
      if (dateObj < today || dateObj.getDay() === 0) {
        btn.classList.add('disabled');
      } else {
        btn.setAttribute('data-date', dateObj.toISOString().split('T')[0]);
        if (dateObj.toDateString() === today.toDateString()) btn.classList.add('today');
        if (state.date && state.date === dateObj.toISOString().split('T')[0]) btn.classList.add('selected');

        btn.addEventListener('click', function () {
          calGrid.querySelectorAll('.cal-day').forEach(function (c) { c.classList.remove('selected'); });
          this.classList.add('selected');
          state.date = this.getAttribute('data-date');
          renderTimeSlots();
        });
      }
      calGrid.appendChild(btn);
    }
  }

  document.getElementById('calPrev').addEventListener('click', function () {
    state.month--;
    if (state.month < 0) { state.month = 11; state.year--; }
    renderCalendar();
  });
  document.getElementById('calNext').addEventListener('click', function () {
    state.month++;
    if (state.month > 11) { state.month = 0; state.year++; }
    renderCalendar();
  });

  // ─── Time slots ───────────────────────────────────
  function renderTimeSlots() {
    var section = document.getElementById('timeSlotSection');
    var container = document.getElementById('timeSlots');
    section.style.display = 'block';
    container.innerHTML = '';

    TIMES.forEach(function (time) {
      var btn = document.createElement('button');
      btn.className = 'time-slot';
      btn.textContent = time;
      // Randomly mark some as unavailable for realism
      var hash = (parseInt(state.date.replace(/-/g, '')) + parseInt(time.replace(':', ''))) % 7;
      if (hash === 0 || hash === 3) {
        btn.classList.add('unavailable');
      } else {
        if (state.time === time) btn.classList.add('selected');
        btn.addEventListener('click', function () {
          container.querySelectorAll('.time-slot').forEach(function (s) { s.classList.remove('selected'); });
          this.classList.add('selected');
          state.time = time;
        });
      }
      container.appendChild(btn);
    });
  }

  // ─── Next/Prev buttons ───────────────────────────
  document.getElementById('btnNext').addEventListener('click', function () {
    if (state.step === 1) {
      if (!state.service) { alert('Please select a service type.'); return; }
      goToStep(2);
      renderCalendar();
    } else if (state.step === 2) {
      if (!state.date) { alert('Please select a date.'); return; }
      if (!state.time) { alert('Please select a time slot.'); return; }
      goToStep(3);
    } else if (state.step === 3) {
      // Validate form
      var form = document.getElementById('bookingForm');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // Show confirmation
      var serviceNames = { fitting: 'Bike Fitting', service: 'Full Service', suspension: 'Suspension Setup' };
      var summary = document.getElementById('bookingSummary');
      var dateFormatted = new Date(state.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      summary.innerHTML =
        '<strong style="color:var(--heading-color);">Service:</strong> ' + serviceNames[state.service] + '<br>' +
        '<strong style="color:var(--heading-color);">Date:</strong> ' + dateFormatted + '<br>' +
        '<strong style="color:var(--heading-color);">Time:</strong> ' + state.time + '<br>' +
        '<strong style="color:var(--heading-color);">Name:</strong> ' + document.getElementById('bk-name').value + '<br>' +
        '<strong style="color:var(--heading-color);">Email:</strong> ' + document.getElementById('bk-email').value + '<br>' +
        '<strong style="color:var(--heading-color);">Phone:</strong> ' + document.getElementById('bk-phone').value +
        (document.getElementById('bk-bike').value ? '<br><strong style="color:var(--heading-color);">Bike:</strong> ' + document.getElementById('bk-bike').value : '');
      goToStep(4);
    }
  });

  document.getElementById('btnPrev').addEventListener('click', function () {
    if (state.step > 1) goToStep(state.step - 1);
  });

})();
