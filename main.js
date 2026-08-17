/**
 * Clean & Subtle Interactive Starlight Canvas
 * Follows OS System Theme (Light/Dark) Automatically
 * 120Hz/ProMotion zero-stutter optimized
 * jasonnam.com
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. System Theme Controller (Automatic OS Preference Follower)
  // ==========================================================================
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  // The media-scoped <meta name="theme-color"> tags handle Safari's chrome tint
  // natively, so this only mirrors the preference onto the root element for CSS
  // and for the canvas palette.
  function applySystemTheme() {
    document.documentElement.setAttribute('data-theme', prefersLight.matches ? 'light' : 'dark');
  }

  applySystemTheme();
  prefersLight.addEventListener('change', applySystemTheme);

  // ==========================================================================
  // 2. Balanced Starlight Engine (Crisp, Visible, Serene)
  // ==========================================================================
  const canvas = document.getElementById('glow-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;

  let particles = [];
  const PARTICLE_COUNT = 130;

  // Dark Mode: Soft Platinum & Silver
  const darkColors = ['#ffffff', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'];
  // Light Mode: Clean Slate & Graphite
  const lightColors = ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorIdx = Math.floor(Math.random() * darkColors.length);
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.2 + 0.8,
        baseAlpha: Math.random() * 0.30 + 0.35,
        darkColor: darkColors[colorIdx],
        lightColor: lightColors[colorIdx]
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    // Measure the element itself so the bitmap always matches the CSS box,
    // including the large-viewport height that reaches under Safari's toolbars.
    const newWidth = canvas.clientWidth || window.innerWidth;
    const newHeight = canvas.clientHeight || window.innerHeight;

    if (newWidth === width && newHeight === height && particles.length > 0) return;

    width = newWidth;
    height = newHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    if (particles.length === 0) {
      initParticles();
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', () => {
    particles = [];
    resize();
  }, { passive: true });

  // Mouse interaction (Restricted to mouse pointer to keep mobile touch smooth & serene)
  const MOUSE_OFF = -9999;
  let rawMouseX = MOUSE_OFF;
  let rawMouseY = MOUSE_OFF;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    rawMouseX = e.clientX;
    rawMouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('pointerleave', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    rawMouseX = MOUSE_OFF;
    rawMouseY = MOUSE_OFF;
  }, { passive: true });

  // Animation Loop
  let animId = null;

  function render() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);

    const mouseDistMax = 135;
    const connectionDistMax = 85;
    const lineCol = isLight ? '#475569' : '#cbd5e1';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Mouse repulsion
      if (rawMouseX !== MOUSE_OFF) {
        const dx = p.x - rawMouseX;
        const dy = p.y - rawMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDistMax) {
          const force = (1 - dist / mouseDistMax) * 1.8;
          p.x += (dx / (dist || 1)) * force;
          p.y += (dy / (dist || 1)) * force;
        }
      }

      // Draw crisp, clearly visible star
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? p.lightColor : p.darkColor;
      ctx.globalAlpha = isLight ? p.baseAlpha * 0.80 : p.baseAlpha * 0.65;
      ctx.fill();

      // Draw delicate constellation links
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < connectionDistMax) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineCol;
          ctx.globalAlpha = (1 - d / connectionDistMax) * (isLight ? 0.14 : 0.11);
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(render);
  }

  document.addEventListener('visibilitychange', () => {
    if (animId) cancelAnimationFrame(animId);
    animId = document.hidden ? null : requestAnimationFrame(render);
  });

  resize();
  animId = requestAnimationFrame(render);
})();
