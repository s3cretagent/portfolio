/* =========================================================
   Shubh Malhotra - Portfolio interactions
   ========================================================= */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Theme toggle (persisted) ---------- */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const light = document.documentElement.classList.toggle('light');
  try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
});

/* ---------- Mobile menu ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
});

/* ---------- Scroll reveal ---------- */
// auto-tag section eyebrows for scroll reveal (idempotent)
document.querySelectorAll('.section-eyebrow').forEach((el) => el.classList.add('reveal'));

const revealEls = document.querySelectorAll('.reveal');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  // re-triggers both ways: reveals on scroll-down, resets when it leaves so it
  // animates again on the way back up, keeps the page feeling alive.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in', entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('main section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');
if ('IntersectionObserver' in window && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + id)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => navObserver.observe(s));
}

/* ---------- Animated stat counters ---------- */
// rAF is paused while the page is hidden, so a counter kicked off in a
// background tab would sit at its "0" placeholder. Track anything still
// mid-count and settle it on the way back.
const pendingCounts = new Set();

function finalValue(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  return (el.dataset.prefix || '') + target.toFixed(decimals) + (el.dataset.suffix || '');
}

function settleCount(el) {
  el.textContent = finalValue(el);
  el.dataset.counted = '1';
  pendingCounts.delete(el);
}

function animateCount(el) {
  if (el.dataset.counted === '1') return;
  // no animation to run: snap straight to the number so it can never read 0
  if (prefersReducedMotion || document.hidden) {
    settleCount(el);
    return;
  }
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  let start = null;
  pendingCounts.add(el);
  const step = (ts) => {
    if (el.dataset.counted === '1') return; // settled by visibilitychange
    if (start === null) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else settleCount(el);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
if ('IntersectionObserver' in window) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        // only stop watching once the number is actually on screen, so an
        // interrupted run still gets a second chance
        if (entry.target.dataset.counted === '1') statObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach((n) => statObserver.observe(n));
} else {
  statNums.forEach(animateCount);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  pendingCounts.forEach(settleCount);
});

/* ---------- Scroll progress bar ---------- */
const scrollBar = document.getElementById('scrollBar');
if (scrollBar) {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    scrollBar.style.transform = `scaleX(${p})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Typewriter role rotator ---------- */
(function typewriter() {
  const el = document.getElementById('typeText');
  if (!el) return;
  const phrases = [
    'reliable cloud platforms.',
    'Kubernetes at scale.',
    'GitOps delivery pipelines.',
    'observable, self-healing systems.',
    'cost-efficient infrastructure.',
  ];
  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }
  let pi = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = phrases[pi];
    el.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) {
      ci++;
      setTimeout(tick, 55 + Math.random() * 45);
    } else if (!deleting && ci === word.length) {
      deleting = true;
      setTimeout(tick, 1500);
    } else if (deleting && ci > 0) {
      ci--;
      setTimeout(tick, 28);
    } else {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(tick, 260);
    }
  };
  tick();
})();

/* ---------- Magnetic buttons ---------- */
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = 0.35;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ---------- Cursor spotlight on cards ---------- */
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.tl-body, .skill-card, .project-card, .edu-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

/* ---------- Subtle 3D tilt on cards / avatar (fine pointer only) ---------- */
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tiltMax || '8');
    const depthLayers = el.querySelectorAll('[data-depth]');

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
      depthLayers.forEach((layer) => {
        const d = parseFloat(layer.dataset.depth || '0');
        layer.style.transform =
          `translateZ(${d}px) translate(${px * d * 0.12}px, ${py * d * 0.12}px)`;
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
    reset(); // start in the resting 3D state so layers are separated on load
  });
}

/* ---------- Custom cursor (dot + trailing ring) ---------- */
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('custom-cursor');
  const dot = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
  dot.style.opacity = '0'; ring.style.opacity = '0';

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.opacity = '1'; ring.style.opacity = '1';
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  (function ringLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(ringLoop);
  })();

  const grow = () => ring.classList.add('grow');
  const shrink = () => ring.classList.remove('grow');
  document.querySelectorAll('a, button, .magnetic, [data-tilt], input, textarea, .skill-card, .project-card, .marquee').forEach((el) => {
    el.addEventListener('mouseenter', grow);
    el.addEventListener('mouseleave', shrink);
  });
  window.addEventListener('mousedown', () => ring.classList.add('click'));
  window.addEventListener('mouseup', () => ring.classList.remove('click'));
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ---------- Kinetic text reveal (word mask + slide) ---------- */
(function kineticText() {
  const targets = document.querySelectorAll('.hero h1, .section-title');

  const splitEl = (el) => {
    el.classList.add('split');
    const nodes = Array.from(el.childNodes);
    el.textContent = '';
    const wrapWord = (text, extraClass) => {
      const word = document.createElement('span');
      word.className = 'word';
      const inner = document.createElement('span');
      inner.className = 'word-inner' + (extraClass ? ' ' + extraClass : '');
      inner.textContent = text;
      word.appendChild(inner);
      el.appendChild(word);
    };
    const splitText = (text, extraClass) => {
      text.split(/(\s+)/).forEach((part) => {
        if (part === '') return;
        if (part.trim() === '') el.appendChild(document.createTextNode(part));
        else wrapWord(part, extraClass);
      });
    };
    nodes.forEach((node) => {
      if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
      } else if (node.nodeType === Node.TEXT_NODE) {
        splitText(node.textContent, '');
      } else if (node.nodeType === Node.ELEMENT_NODE && node.children.length === 0) {
        // e.g. the gradient name, split into words so it can wrap on mobile
        splitText(node.textContent, node.className);
      } else {
        const word = document.createElement('span');
        word.className = 'word';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.appendChild(node);
        word.appendChild(inner);
        el.appendChild(word);
      }
    });
    el.querySelectorAll('.word-inner').forEach((inner, i) => {
      inner.style.transitionDelay = (i * 0.05).toFixed(2) + 's';
    });
  };
  try {
    targets.forEach(splitEl);
  } catch (err) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // keep the hero title revealed; re-trigger section titles on scroll
        if (entry.target.closest('.hero')) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
        } else {
          entry.target.classList.toggle('in', entry.isIntersecting);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
  );
  targets.forEach((el) => obs.observe(el));
})();

/* ---------- Hero scroll parallax (desktop only) ---------- */
if (!prefersReducedMotion && window.matchMedia('(min-width: 900px) and (pointer: fine)').matches) {
  const heroCopy = document.querySelector('.hero-copy');
  const heroVisual = document.querySelector('.hero-visual');
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      if (heroCopy) {
        heroCopy.style.transform = `translateY(${y * 0.18}px)`;
        heroCopy.style.opacity = String(Math.max(0, 1 - y / 560));
      }
      if (heroVisual) {
        heroVisual.style.transform = `translateY(${y * 0.34}px)`;
        heroVisual.style.opacity = String(Math.max(0, 1 - y / 640));
      }
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ---------- WebGL interactive wave-mesh background (Three.js) ----------
   A full-viewport 3D wireframe surface with animated crests and troughs.
   It flows on its own, rises toward the cursor, and drifts as you scroll,
   so the mesh reads as one continuous landscape running down the page.
   Falls back to the aurora/grain if WebGL / Three.js is unavailable.     */
(function initGL() {
  const canvas = document.getElementById('mesh-bg');
  if (!canvas || typeof THREE === 'undefined') return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return;
  }

  const mobile = window.innerWidth < 720;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 4.2, 9);
  camera.lookAt(0, -0.4, 0);

  // wide plane laid down like a landscape
  const SEG_X = mobile ? 70 : 120;
  const SEG_Y = mobile ? 46 : 80;
  const W = 34, H = 22;
  const geo = new THREE.PlaneGeometry(W, H, SEG_X, SEG_Y);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const vcount = pos.count;
  const colors = new Float32Array(vcount * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const base = [];
  for (let i = 0; i < vcount; i++) base.push(pos.getX(i), pos.getZ(i)); // x, z(depth)

  const mat = new THREE.MeshBasicMaterial({
    wireframe: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  scene.fog = new THREE.FogExp2(0x0a0b0d, 0.052);

  // colour ramp: deep teal troughs -> soft emerald crests (restrained)
  const LOW = [0.06, 0.20, 0.18];
  const HIGH = [0.32, 0.86, 0.55];

  const pointer = { x: 0, y: 0, tx: 0, ty: 0, wx: 999, wz: 999 };
  let scroll = 0;
  function setPointer(clientX, clientY) {
    pointer.tx = clientX / window.innerWidth - 0.5;
    pointer.ty = clientY / window.innerHeight - 0.5;
    // approx world position of cursor/finger on the plane
    pointer.wx = pointer.tx * W * 0.9;
    pointer.wz = pointer.ty * H * 0.9;
  }
  window.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY));
  window.addEventListener('scroll', () => { scroll = window.scrollY; }, { passive: true });

  // touch-reactive: the mesh crest follows the finger, with a ripple ring
  const touchRing = document.getElementById('touchRing');
  let holdTimer = null;
  const endTouch = () => {
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (touchRing) touchRing.classList.remove('on');
    // ease the crest back to the resting centre
    pointer.wx = 999; pointer.wz = 999;
  };
  const showRing = (x, y) => {
    if (!touchRing) return;
    touchRing.style.left = x + 'px';
    touchRing.style.top = y + 'px';
    touchRing.classList.add('on');
    // safety: if the finger is held (long-press) and touchend never fires
    // e.g. iOS swallows it for the callout, auto-release after 2s so the
    // ring can't get stuck and the crest stops driving the mesh.
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(endTouch, 2000);
  };
  const onTouch = (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    setPointer(t.clientX, t.clientY);
    showRing(t.clientX, t.clientY);
  };
  window.addEventListener('touchstart', onTouch, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('touchend', endTouch, { passive: true });
  window.addEventListener('touchcancel', endTouch, { passive: true });
  window.addEventListener('scroll', endTouch, { passive: true });

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const AMP = 1.15;
  let t = 0;

  function wave(x, z, sOff) {
    return (
      Math.sin(x * 0.32 + t) * 0.5 +
      Math.cos(z * 0.34 + t * 0.85 + sOff) * 0.5 +
      Math.sin((x + z) * 0.22 + t * 1.15) * 0.35 +
      Math.sin(x * 0.12 - z * 0.16 + t * 0.6) * 0.4
    );
  }

  function frame() {
    t += 0.012;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    const sOff = scroll * 0.0018;

    for (let i = 0; i < vcount; i++) {
      const x = base[i * 2];
      const z = base[i * 2 + 1];
      let y = wave(x, z + sOff * 6, sOff) * AMP;
      // interactive crest that rises toward the cursor
      const dx = x - pointer.wx;
      const dz = z - pointer.wz;
      const d2 = (dx * dx + dz * dz) * 0.05;
      y += Math.exp(-d2) * 1.7;

      pos.setY(i, y);

      const n = Math.max(0, Math.min(1, (y / (AMP + 1.4)) * 0.5 + 0.5));
      colors[i * 3] = LOW[0] + (HIGH[0] - LOW[0]) * n;
      colors[i * 3 + 1] = LOW[1] + (HIGH[1] - LOW[1]) * n;
      colors[i * 3 + 2] = LOW[2] + (HIGH[2] - LOW[2]) * n;
    }
    pos.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;

    // gentle camera parallax
    camera.position.x += (pointer.x * 2.2 - camera.position.x) * 0.04;
    camera.position.y += (4.2 - pointer.y * 1.4 - camera.position.y) * 0.04;
    camera.lookAt(0, -0.4, 0);

    renderer.render(scene, camera);
    if (!prefersReducedMotion) requestAnimationFrame(frame);
  }

  // set a light fog colour that matches the current theme
  function themeFog() {
    scene.fog.color.set(document.documentElement.classList.contains('light') ? 0xf4f5ef : 0x0a0b0d);
  }
  themeFog();
  document.getElementById('themeToggle') &&
    document.getElementById('themeToggle').addEventListener('click', () => setTimeout(themeFog, 0));

  if (prefersReducedMotion) {
    for (let i = 0; i < vcount; i++) {
      const x = base[i * 2], z = base[i * 2 + 1];
      const y = wave(x, z, 0) * AMP;
      pos.setY(i, y);
      const n = Math.max(0, Math.min(1, (y / (AMP + 1.4)) * 0.5 + 0.5));
      colors[i * 3] = LOW[0] + (HIGH[0] - LOW[0]) * n;
      colors[i * 3 + 1] = LOW[1] + (HIGH[1] - LOW[1]) * n;
      colors[i * 3 + 2] = LOW[2] + (HIGH[2] - LOW[2]) * n;
    }
    pos.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    renderer.render(scene, camera);
  } else {
    requestAnimationFrame(frame);
  }
})();

/* ---------- Project card sparklines (live-feel) ---------- */
(function sparklines() {
  const cvs = document.querySelectorAll('canvas.spark');
  if (!cvs.length) return;
  const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c6f24e';
  cvs.forEach((c) => {
    const ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => { const r = c.getBoundingClientRect(); c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); window.addEventListener('resize', () => { size(); draw(); });
    const n = 46, data = []; let v = 0.5;
    for (let i = 0; i < n; i++) { v = Math.max(0.14, Math.min(0.86, v + (Math.random() - 0.5) * 0.22)); data.push(v); }
    function draw() {
      const r = c.getBoundingClientRect(), w = r.width, h = r.height, a = accent(), step = w / (n - 1);
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a + '55'); g.addColorStop(1, a + '00');
      ctx.beginPath(); ctx.moveTo(0, h);
      data.forEach((d, i) => ctx.lineTo(i * step, h - d * (h - 6) - 3));
      ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath();
      data.forEach((d, i) => { const x = i * step, y = h - d * (h - 6) - 3; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.strokeStyle = a; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    }
    draw();
    if (!prefersReducedMotion) {
      let last = 0;
      (function loop(ts) { if (ts - last > 150) { v = Math.max(0.14, Math.min(0.86, v + (Math.random() - 0.5) * 0.22)); data.push(v); data.shift(); draw(); last = ts; } requestAnimationFrame(loop); })(0);
    }
  });
})();

/* ---------- Contact form (mailto) ---------- */
function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subj = encodeURIComponent('Portfolio contact from ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:shubhmalhotra07@gmail.com?subject=${subj}&body=${body}`;
  return false;
}

/* signals the head failsafe that the script loaded and ran */
window.__portfolioReady = true;
