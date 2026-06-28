/* =============================================
   SAVORIA RESTAURANT - MAIN JAVASCRIPT
   Author: Justin Ryan Mukunzi (220270)

   Features:
   1. Dark / light mode toggle
   2. Navbar shadow on scroll
   3. Contact form validation
   4. Reservation form validation
   5. Menu category filter
   ============================================= */


/* -----------------------------------------------
   1. DARK MODE TOGGLE
   Saves the selected theme in localStorage so it
   stays the same when users move between pages.
----------------------------------------------- */
const darkModeToggle = document.getElementById('darkModeToggle');
const savedTheme = localStorage.getItem('savoria-theme');

function setTheme(theme) {
  const isDark = theme === 'dark';

  document.documentElement.toggleAttribute('data-theme', isDark);
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('savoria-theme', isDark ? 'dark' : 'light');

  if (darkModeToggle) {
    darkModeToggle.innerHTML = isDark
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';
    darkModeToggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

setTheme(savedTheme === 'dark' ? 'dark' : 'light');

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', function () {
    const isDark = document.body.classList.contains('dark-theme');
    setTheme(isDark ? 'light' : 'dark');
  });
}


/* -----------------------------------------------
   2. NAVBAR SHADOW ON SCROLL
   Adds .scrolled when the page has moved down.
----------------------------------------------- */
const navbar = document.getElementById('mainNav');

function updateNavbarShadow() {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
}

updateNavbarShadow();
window.addEventListener('scroll', updateNavbarShadow);


/* -----------------------------------------------
   3. CONTACT FORM VALIDATION
----------------------------------------------- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    hideAlert('contactSuccess');

    const name = getValue('contactName');
    const email = getValue('contactEmail');
    const phone = getValue('contactPhone');
    const message = getValue('contactMessage');
    let valid = true;

    if (name.length < 2) {
      showError('contactNameError', 'Please enter your full name.');
      valid = false;
    }

    if (!isValidEmail(email)) {
      showError('contactEmailError', 'Please enter a valid email address.');
      valid = false;
    }

    if (phone && !isValidPhone(phone)) {
      showError('contactPhoneError', 'Please enter a valid phone number.');
      valid = false;
    }

    if (message.length < 10) {
      showError('contactMessageError', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      showAlert('contactSuccess');
      contactForm.reset();
    }
  });
}


/* -----------------------------------------------
   4. RESERVATION FORM VALIDATION
----------------------------------------------- */
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
  const dateInput = document.getElementById('resDate');
  const today = getTodayString();

  if (dateInput) {
    dateInput.setAttribute('min', today);
  }

  reservationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    hideAlert('resSuccess');

    const name = getValue('resName');
    const email = getValue('resEmail');
    const date = getValue('resDate');
    const time = getValue('resTime');
    const guests = getValue('resGuests');
    const guestCount = parseInt(guests, 10);
    let valid = true;

    if (name.length < 2) {
      showError('resNameError', 'Please enter your full name.');
      valid = false;
    }

    if (!isValidEmail(email)) {
      showError('resEmailError', 'Please enter a valid email address.');
      valid = false;
    }

    if (!date) {
      showError('resDateError', 'Please select a date.');
      valid = false;
    } else if (date < today) {
      showError('resDateError', 'Please choose today or a future date.');
      valid = false;
    }

    if (!time) {
      showError('resTimeError', 'Please select a time slot.');
      valid = false;
    }

    if (Number.isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
      showError('resGuestsError', 'Please enter between 1 and 20 guests.');
      valid = false;
    }

    if (valid) {
      showAlert('resSuccess');
      reservationForm.reset();

      if (dateInput) {
        dateInput.setAttribute('min', today);
      }
    }
  });
}


/* -----------------------------------------------
   5. MENU CATEGORY FILTER
----------------------------------------------- */
const menuFilter = document.getElementById('menuFilter');

if (menuFilter) {
  const filterButtons = menuFilter.querySelectorAll('[data-filter]');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      filterButtons.forEach(function (button) {
        button.classList.remove('active', 'btn-gold');
        button.classList.add('btn-outline-dark');
      });

      this.classList.add('active', 'btn-gold');
      this.classList.remove('btn-outline-dark');

      menuItems.forEach(function (item) {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        item.style.display = shouldShow ? 'block' : 'none';
        item.style.animation = shouldShow ? 'fadeInUp 0.4s ease both' : '';
      });
    });
  });
}


/* -----------------------------------------------
   HELPER FUNCTIONS
----------------------------------------------- */

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+\d\s()-]{9,}$/.test(phone);
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);

  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(function (el) {
    el.textContent = '';
    el.style.display = 'none';
  });
}

function showAlert(id) {
  const el = document.getElementById(id);

  if (el) {
    el.style.display = 'block';

    setTimeout(function () {
      hideAlert(id);
    }, 5000);
  }
}

function hideAlert(id) {
  const el = document.getElementById(id);

  if (el) {
    el.style.display = 'none';
  }
}
