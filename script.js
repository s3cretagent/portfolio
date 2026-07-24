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

}

// 3D service-mesh / cluster-topology background — custom, dependency-free.
// A rotating cloud of "pods" (nodes) connected into a live service mesh,
// projected with perspective and reacting to the cursor. Themed to the site.
(function initMeshBackground() {
  const canvas = document.getElementById('mesh-bg');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#ffb703', '#219ebc', '#8ecae6'];
  const NODE_COUNT = window.innerWidth < 700 ? 44 : 78;
  const LINK_DIST = 0.62;   // 3D distance threshold for drawing an edge
  const FOCAL = 2.2;        // perspective focal length

  let w = 0, h = 0, dpr = 1;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let yaw = 0, pitch = 0;

  // Nodes distributed in a unit sphere shell for an even, cluster-like spread
  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
    const theta = Math.acos(2 * ((i + 0.5) / NODE_COUNT) - 1);
    const phi = i * 2.399963; // golden angle
    const r = 0.75 + (i % 5) * 0.05;
    return {
      x: r * Math.sin(theta) * Math.cos(phi),
      y: r * Math.sin(theta) * Math.sin(phi),
      z: r * Math.cos(theta),
      c: COLORS[i % COLORS.length],
      pulse: (i % 7) / 7, // phase offset for a subtle "heartbeat"
    };
  });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    pointer.tx = e.clientX / window.innerWidth - 0.5;
    pointer.ty = e.clientY / window.innerHeight - 0.5;
  });

  function project(n, t) {
    // rotate around Y (yaw) then X (pitch)
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    let x = n.x * cy - n.z * sy;
    let z = n.x * sy + n.z * cy;
    const cx = Math.cos(pitch), sx = Math.sin(pitch);
    let y = n.y * cx - z * sx;
    z = n.y * sx + z * cx;
    const scale = FOCAL / (FOCAL + z);
    const minDim = Math.min(w, h);
    return {
      sx: w / 2 + x * scale * minDim * 0.42 + pointer.x * 40,
      sy: h / 2 + y * scale * minDim * 0.42 + pointer.y * 40,
      depth: z,
      scale,
    };
  }

  function frame() {
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    yaw += 0.0016;
    pitch = pointer.y * 0.5;

    const light = document.documentElement.classList.contains('light');
    ctx.clearRect(0, 0, w, h);

    const t = yaw * 60;
    const p = nodes.map((n) => project(n, t));

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > LINK_DIST) continue;
        const a = (1 - d / LINK_DIST) * 0.5 * ((p[i].scale + p[j].scale) / 2);
        ctx.strokeStyle = light
          ? `rgba(33,105,140,${a * 0.9})`
          : `rgba(142,202,230,${a})`;
        ctx.lineWidth = Math.max(0.4, a * 1.6);
        ctx.beginPath();
        ctx.moveTo(p[i].sx, p[i].sy);
        ctx.lineTo(p[j].sx, p[j].sy);
        ctx.stroke();
      }
    }

    // nodes (draw far-to-near for correct depth layering)
    const order = p.map((v, i) => i).sort((a, b) => p[b].depth - p[a].depth);
    for (const i of order) {
      const n = nodes[i];
      const v = p[i];
      const beat = 0.85 + 0.15 * Math.sin(t * 0.06 + n.pulse * 6.283);
      const radius = Math.max(0.6, 2.6 * v.scale * beat);
      const alpha = Math.min(1, 0.35 + v.scale * 0.6);
      ctx.beginPath();
      ctx.arc(v.sx, v.sy, radius, 0, Math.PI * 2);
      ctx.fillStyle = n.c;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = n.c;
      ctx.shadowBlur = 8 * v.scale;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    if (!prefersReducedMotion) requestAnimationFrame(frame);
  }

  if (prefersReducedMotion) {
    // draw a single static frame
    yaw = 0.6;
    frame();
  } else {
    requestAnimationFrame(frame);
  }
})();

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
