/**
 * TradeBrain Marketing Site — Shared JS
 */

// Mobile hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  // Pricing toggle
  var toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var period = btn.dataset.period;

      document.querySelectorAll('[data-monthly]').forEach(function(el) {
        if (period === 'monthly') {
          el.textContent = el.dataset.monthly;
        } else {
          el.textContent = el.dataset.annual;
        }
      });

      document.querySelectorAll('.billed-text').forEach(function(el) {
        el.style.display = period === 'annual' ? 'block' : 'none';
      });
    });
  });

  // Contact form handler
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate send (replace with real endpoint later)
      setTimeout(function() {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#10b981';
        contactForm.reset();
        setTimeout(function() {
          btn.textContent = 'Send Message';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }
});
