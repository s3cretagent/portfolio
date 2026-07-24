document.getElementById('year').textContent = new Date().getFullYear();

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const root = document.documentElement;
  root.classList.toggle('light');

  if (root.classList.contains('light')) {
    root.style.setProperty('--bg', '#fafaf9');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--muted', '#4b5563');
    root.style.setProperty('--white', '#111827');
    root.style.setProperty('--accent', '#ffb703');
    root.style.setProperty('--accent2', '#219ebc');
    document.body.style.background = '#fafaf9';
  } else {
    root.style.setProperty('--bg', '#0f0f0f');
    root.style.setProperty('--card', '#1b1b1b');
    root.style.setProperty('--muted', '#b0b0b0');
    root.style.setProperty('--white', '#fefefe');
    root.style.setProperty('--accent', '#ffb703');
    root.style.setProperty('--accent2', '#219ebc');
    document.body.style.background = '#0f0f0f';
  }
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
});

// ---------- 3D Resume interactions ----------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Mark cards, skills and projects as tiltable
  document.querySelectorAll('.card, .skill').forEach((el) => {
    el.setAttribute('data-tilt', '');
    if (!el.dataset.tiltMax) el.dataset.tiltMax = '8';
  });

  const tiltEls = document.querySelectorAll('[data-tilt]');

  tiltEls.forEach((el) => {
    const max = parseFloat(el.dataset.tiltMax || '10');
    const depthLayers = el.querySelectorAll('[data-depth]');

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = (-py * max).toFixed(2);
      const rotY = (px * max).toFixed(2);
      el.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      depthLayers.forEach((layer) => {
        const d = parseFloat(layer.dataset.depth || '0');
        layer.style.transform =
          `translateZ(${d}px) translate(${px * d * 0.15}px, ${py * d * 0.15}px)`;
      });
    };

    const reset = () => {
      el.style.transform = '';
      depthLayers.forEach((layer) => {
        const d = parseFloat(layer.dataset.depth || '0');
        layer.style.transform = `translateZ(${d}px)`;
      });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
  });

  // Parallax orbs follow the cursor across the page
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', (e) => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 18;
      orb.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
    });
  });
}

function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const name = encodeURIComponent(form.name.value.trim());
  const email = encodeURIComponent(form.email.value.trim());
  const message = encodeURIComponent(form.message.value.trim());
  const subj = encodeURIComponent('Portfolio contact from ' + name);
  const body = encodeURIComponent(
    `Name: ${name}%0AEmail: ${email}%0A%0A${message}`
  );
  window.location.href = `mailto:shubhmalhotra07@gmail.com?subject=${subj}&body=${body}`;
  return false;
}
