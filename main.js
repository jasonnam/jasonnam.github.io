/**
 * Horizon Atmospheric Background & Theme Controller
 * Bespoke Luxury Palette: Moonlight Silver-Blue, Deep Sapphire & Warm Champagne Pearl
 * Wide-open planetary limb with slow, silky elliptical dawn ribbons
 * Pure autonomous flow (no mouse tracking), 120Hz/ProMotion optimized
 * jasonnam.com
 */

(function () {
  'use strict';

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  const canvas = document.getElementById('glow-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    const newWidth = canvas.clientWidth || window.innerWidth;
    const newHeight = canvas.clientHeight || window.innerHeight;

    if (newWidth === width && newHeight === height) return;

    width = newWidth;
    height = newHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', resize, { passive: true });

  /**
   * Draws a soft elliptical atmospheric light ribbon that hugs the horizon curve
   */
  function drawHorizonRibbon(cx, cy, rx, ry, tiltRad, stops) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tiltRad);
    ctx.scale(1, ry / rx);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    for (let i = 0; i < stops.length; i++) {
      grad.addColorStop(stops[i][0], stops[i][1]);
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderHorizon(t, isLight) {
    const maxDim = Math.max(width, height);

    // 1. Base Planetary Limb Arc (Moonlight Glacier Blue & Prussian Sapphire)
    const limbBreath = Math.sin(t * 0.00018) * 0.045;
    const limbSway = Math.cos(t * 0.00014) * (width * 0.08);
    const globeX = width * 0.5 + limbSway;
    const globeY = height * (1.38 + limbBreath);
    const globeR = maxDim * 1.16;

    const baseGlow = ctx.createRadialGradient(
      globeX,
      globeY,
      globeR * 0.50,
      globeX,
      globeY,
      globeR * 1.15
    );

    if (isLight) {
      baseGlow.addColorStop(0, 'rgba(46, 102, 198, 0.56)');
      baseGlow.addColorStop(0.34, 'rgba(84, 118, 206, 0.36)');
      baseGlow.addColorStop(0.68, 'rgba(138, 166, 222, 0.18)');
      baseGlow.addColorStop(1, 'rgba(240, 244, 249, 0)');
    } else {
      baseGlow.addColorStop(0, 'rgba(164, 194, 232, 0.22)');
      baseGlow.addColorStop(0.32, 'rgba(72, 106, 168, 0.15)');
      baseGlow.addColorStop(0.64, 'rgba(34, 48, 86, 0.075)');
      baseGlow.addColorStop(1, 'rgba(5, 6, 9, 0)');
    }

    ctx.fillStyle = baseGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. Ribbon A — Warm Champagne-Pearl Dawn Rim gliding slowly along the lower horizon
    // Creates a refined warm-vs-cool twilight contrast against the sapphire sky
    const phaseA = t * 0.00021;
    const ribbonAX = width * 0.5 + Math.sin(phaseA) * (width * 0.34);
    const ribbonAY = height * 0.87 + Math.cos(phaseA * 1.3) * (height * 0.055);
    const tiltA = Math.sin(phaseA) * 0.12;

    drawHorizonRibbon(
      ribbonAX,
      ribbonAY,
      maxDim * 0.56,
      maxDim * 0.27,
      tiltA,
      isLight
        ? [
            [0, 'rgba(226, 138, 56, 0.52)'],
            [0.44, 'rgba(216, 158, 104, 0.28)'],
            [1, 'rgba(240, 244, 249, 0)']
          ]
        : [
            [0, 'rgba(232, 206, 172, 0.21)'],
            [0.44, 'rgba(156, 184, 224, 0.11)'],
            [1, 'rgba(5, 6, 9, 0)']
          ]
    );

    // 3. Ribbon B — Counter-gliding Moonlight Steel-Sapphire Wave
    const phaseB = t * 0.00017 + 1.4;
    const ribbonBX = width * 0.5 - Math.sin(phaseB) * (width * 0.34);
    const ribbonBY = height * 0.72 + Math.sin(phaseB * 1.2) * (height * 0.065);
    const tiltB = -Math.sin(phaseB) * 0.14;

    drawHorizonRibbon(
      ribbonBX,
      ribbonBY,
      maxDim * 0.58,
      maxDim * 0.31,
      tiltB,
      isLight
        ? [
            [0, 'rgba(38, 94, 198, 0.48)'],
            [0.46, 'rgba(84, 118, 204, 0.26)'],
            [1, 'rgba(240, 244, 249, 0)']
          ]
        : [
            [0, 'rgba(128, 162, 218, 0.23)'],
            [0.46, 'rgba(68, 92, 152, 0.10)'],
            [1, 'rgba(5, 6, 9, 0)']
          ]
    );

    // 4. Ribbon C — Slow Platinum-Violet Twilight Shimmer (bridges Center & Horizon)
    const phaseC = t * 0.00014 + 3.1;
    const pulseC = (Math.sin(t * 0.00024) + 1) * 0.5;
    const ribbonCX = width * 0.5 + Math.cos(phaseC) * (width * 0.26);
    const ribbonCY = height * 0.62 + Math.sin(phaseC) * (height * 0.06);
    const tiltC = Math.cos(phaseC) * 0.10;

    drawHorizonRibbon(
      ribbonCX,
      ribbonCY,
      maxDim * (0.48 + pulseC * 0.08),
      maxDim * 0.26,
      tiltC,
      isLight
        ? [
            [0, `rgba(92, 102, 198, ${(0.34 + pulseC * 0.12).toFixed(3)})`],
            [0.5, `rgba(178, 114, 154, ${(0.19 + pulseC * 0.08).toFixed(3)})`],
            [1, 'rgba(240, 244, 249, 0)']
          ]
        : [
            [0, `rgba(188, 204, 232, ${(0.12 + pulseC * 0.06).toFixed(3)})`],
            [0.5, `rgba(126, 136, 188, ${(0.06 + pulseC * 0.04).toFixed(3)})`],
            [1, 'rgba(5, 6, 9, 0)']
          ]
    );

    // 5. Soft Titanium Zenith Counter-Glow at Top
    const topX = width * 0.5 + Math.cos(t * 0.00016) * (width * 0.22);
    const topY = -height * 0.15 + Math.sin(t * 0.0002) * (height * 0.04);
    const topGlow = ctx.createRadialGradient(topX, topY, 0, topX, topY, maxDim * 0.68);

    if (isLight) {
      topGlow.addColorStop(0, 'rgba(84, 138, 216, 0.38)');
      topGlow.addColorStop(1, 'rgba(240, 244, 249, 0)');
    } else {
      topGlow.addColorStop(0, 'rgba(156, 172, 198, 0.075)');
      topGlow.addColorStop(1, 'rgba(5, 6, 9, 0)');
    }

    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, width, height);
  }

  let animId = null;

  function render(now) {
    const t = now || performance.now();
    const isLight = prefersLight.matches;

    ctx.clearRect(0, 0, width, height);
    renderHorizon(t, isLight);

    animId = requestAnimationFrame(render);
  }

  document.addEventListener('visibilitychange', () => {
    if (animId) cancelAnimationFrame(animId);
    animId = document.hidden ? null : requestAnimationFrame(render);
  });

  resize();
  animId = requestAnimationFrame(render);
})();
