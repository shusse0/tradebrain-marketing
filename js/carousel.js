/**
 * TradeBrain 3D Coverflow Carousel
 * Extracted from the main app's hero carousel.
 */

const CARDS = [
  {
    id: 'hts-import', label: 'HTS Import', subtitle: 'HTS Classification',
    description: 'Classify imported goods using the Harmonized Tariff Schedule with full GRI analysis and duty rate lookup',
    icon: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'schedule-b', label: 'Schedule B Export', subtitle: 'Export Classification',
    description: 'Classify exports with Schedule B codes, ECCN screening, and EEI filing assessment',
    icon: '<path d="M12 15V3m0 0L8 7m4-4l4 4M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'licensing', label: 'Licensing Analysis', subtitle: 'Export Control',
    description: 'Analyze ECCN license requirements, destination controls, and applicable exceptions under the EAR',
    icon: '<path d="M12 3l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V7l8-4z" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'screening', label: 'Party Screening', subtitle: 'Watch List Screening',
    description: 'Screen individuals and companies against U.S. and international restricted party lists instantly',
    icon: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" stroke-linecap="round"/>',
  },
  {
    id: 'forms', label: 'Forms & Licenses', subtitle: 'ITAR/EAR Forms',
    description: 'Build DSP-5 applications, TAA agreements, and track active export licenses with expiry alerts',
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18v-6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 15h6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'tracker', label: 'License Tracker', subtitle: 'License Lifecycle',
    description: 'Track authorized value, units shipped, remaining balance, and receive automatic expiry alerts',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
];

const NUM = CARDS.length;
let activeIndex = 0;
let dragging = false;
let startX = 0;
let dragOffset = 0;

function initCarousel() {
  const container = document.getElementById('carousel');
  if (!container) return;

  // Build cards
  CARDS.forEach(function(card, i) {
    var el = document.createElement('div');
    el.className = 'c-card';
    el.dataset.index = i;
    el.innerHTML =
      '<div class="c-face">' +
        '<div class="c-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + card.icon + '</svg></div>' +
        '<div class="c-subtitle">' + card.subtitle + '</div>' +
        '<h3 class="c-title">' + card.label + '</h3>' +
        '<p class="c-desc">' + card.description + '</p>' +
        '<span class="c-link">Learn More &rarr;</span>' +
      '</div>';
    el.addEventListener('click', function() {
      if (dragging) return;
      var diff = circDiff(i, activeIndex);
      if (Math.abs(diff) < 0.5) return; // center card — no-op on marketing site
      activeIndex = i;
      updatePositions(false);
      updateDots();
    });
    container.appendChild(el);
  });

  // Build dots
  var dots = document.getElementById('carouselDots');
  if (dots) {
    for (var i = 0; i < NUM; i++) {
      var dot = document.createElement('button');
      dot.className = 'c-dot' + (i === 0 ? ' active' : '');
      dot.dataset.index = i;
      dot.addEventListener('click', function() {
        activeIndex = parseInt(this.dataset.index);
        updatePositions(false);
        updateDots();
      });
      dots.appendChild(dot);
    }
  }

  // Drag handlers
  container.addEventListener('mousedown', function(e) {
    dragging = true; startX = e.clientX; dragOffset = 0;
    container.style.cursor = 'grabbing';
  });
  container.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    dragOffset = e.clientX - startX;
    updatePositions(true);
  });
  var endDrag = function() {
    if (!dragging) return;
    dragging = false;
    container.style.cursor = 'grab';
    if (Math.abs(dragOffset) > 60) {
      activeIndex = ((activeIndex + (dragOffset < 0 ? 1 : -1)) % NUM + NUM) % NUM;
    }
    dragOffset = 0;
    updatePositions(false);
    updateDots();
  };
  document.addEventListener('mouseup', endDrag);

  // Touch
  container.addEventListener('touchstart', function(e) {
    dragging = true; startX = e.touches[0].clientX; dragOffset = 0;
  }, {passive: true});
  container.addEventListener('touchmove', function(e) {
    if (!dragging) return;
    dragOffset = e.touches[0].clientX - startX;
    updatePositions(true);
  }, {passive: true});
  container.addEventListener('touchend', endDrag);

  // Keyboard
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') { activeIndex = ((activeIndex - 1) % NUM + NUM) % NUM; updatePositions(false); updateDots(); }
    if (e.key === 'ArrowRight') { activeIndex = ((activeIndex + 1) % NUM + NUM) % NUM; updatePositions(false); updateDots(); }
  });

  updatePositions(false);
}

function circDiff(idx, active) {
  var d = idx - active;
  if (d > NUM / 2) d -= NUM;
  if (d < -NUM / 2) d += NUM;
  return d;
}

function updatePositions(noDuration) {
  var cards = document.querySelectorAll('.c-card');
  cards.forEach(function(card) {
    var idx = parseInt(card.dataset.index);
    var diff = circDiff(idx, activeIndex);
    var drag = dragging ? dragOffset / 120 : 0;
    var pos = diff - drag;

    var tX = pos * 300;
    var tZ = -Math.abs(pos) * 200;
    var rY = pos * -45;
    var sc = Math.max(0.55, 1 - Math.abs(pos) * 0.15);
    var op = Math.max(0.15, 1 - Math.abs(pos) * 0.3);
    var zi = 10 - Math.abs(Math.round(pos));

    card.style.transform = 'translateX(' + tX + 'px) translateZ(' + tZ + 'px) rotateY(' + rY + 'deg) scale(' + sc + ')';
    card.style.opacity = op;
    card.style.zIndex = zi;
    card.style.transition = noDuration ? 'none' : 'all 0.5s cubic-bezier(0.25,0.1,0.25,1)';

    var isCenter = Math.abs(diff) < 0.5 && !dragging;
    card.classList.toggle('center', isCenter);
  });
}

function updateDots() {
  document.querySelectorAll('.c-dot').forEach(function(dot) {
    dot.classList.toggle('active', parseInt(dot.dataset.index) === activeIndex);
  });
}

document.addEventListener('DOMContentLoaded', initCarousel);
