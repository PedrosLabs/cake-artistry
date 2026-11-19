// Christmas snow: a gentle falling-snowflake effect.
// Self-contained. To remove it, delete the <script src="snow.js"> line in
// index.html (the "Seasonal snow" block in styles.css can go too).
(() => {
  // Snow switches itself off after this date (Twelfth Night). Change the date
  // to run it for longer or shorter.
  const SNOW_UNTIL = new Date('2027-01-07T00:00:00');
  if (new Date() >= SNOW_UNTIL) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const canvas = document.createElement('canvas');
  canvas.className = 'snow-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');

  // Visitors can turn the snow off, which also keeps the page usable for
  // anyone who finds moving backgrounds distracting
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'snow-toggle';
  toggle.textContent = 'Snow';
  toggle.setAttribute('aria-label', 'Falling snow');

  // Soft blue-grey outline so flakes show up on the cream and white page
  const RIM = '150, 178, 205';

  // Six-armed crystal geometry, worked out once rather than every frame
  const ARMS = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3;
    return {
      cos: Math.cos(a), sin: Math.sin(a),
      b1x: Math.cos(a + 0.9), b1y: Math.sin(a + 0.9),
      b2x: Math.cos(a - 0.9), b2y: Math.sin(a - 0.9),
    };
  });

  let width = 0;
  let height = 0;
  let flakes = [];
  let frame = null;
  let last = 0;
  let enabled = true; // the visitor's choice via the Snow button

  const rand = (min, max) => min + Math.random() * (max - min);

  const makeFlake = (anywhere) => {
    const size = rand(1.6, 5.2); // bigger flakes are "closer"
    return {
      x: rand(0, width),
      y: anywhere ? rand(0, height) : -size * 2 - rand(0, 40),
      size,
      speed: 18 + size * 9,      // px per second; closer flakes fall faster
      sway: rand(8, 22),         // sideways drift
      swaySpeed: rand(0.4, 1.1),
      phase: rand(0, Math.PI * 2),
      spin: rand(-0.6, 0.6),
      angle: rand(0, Math.PI),
      alpha: 0.55 + (size / 5.2) * 0.4,
      crystal: size > 3.4,       // the larger ones get six arms
    };
  };

  const drawFlake = (f) => {
    if (f.crystal) {
      const r = f.size * 1.7;
      const branch = r * 0.32;
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.strokeStyle = `rgba(${RIM}, ${f.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (const a of ARMS) {
        ctx.moveTo(0, 0);
        ctx.lineTo(a.cos * r, a.sin * r);
        const bx = a.cos * r * 0.6;
        const by = a.sin * r * 0.6;
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + a.b1x * branch, by + a.b1y * branch);
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + a.b2x * branch, by + a.b2y * branch);
      }
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, f.alpha + 0.2)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${RIM}, ${f.alpha * 0.8})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  };

  const step = (now) => {
    // Cap the time step so flakes don't jump after the tab was in the background
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.phase += f.swaySpeed * dt;
      f.x += (Math.sin(f.phase) * f.sway + 4) * dt; // a faint breeze to the right
      f.y += f.speed * dt;
      f.angle += f.spin * dt;

      if (f.y - f.size * 2 > height) {
        flakes[i] = makeFlake(false);
        continue;
      }
      if (f.x > width + 12) f.x = -12;
      else if (f.x < -12) f.x = width + 12;
      drawFlake(f);
    }
    frame = requestAnimationFrame(step);
  };

  const setup = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // resizing a canvas resets this
    const count = Math.max(28, Math.min(90, Math.round((width * height) / 16000)));
    flakes = Array.from({ length: count }, () => makeFlake(true));
  };

  const start = () => {
    if (frame !== null) return;
    canvas.hidden = false;
    last = performance.now();
    frame = requestAnimationFrame(step);
  };

  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    ctx.clearRect(0, 0, width, height);
    canvas.hidden = true;
  };

  // Run only when the visitor wants snow and their device isn't set to reduce motion
  const sync = () => {
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(enabled));
    if (enabled && !reducedMotion.matches) start();
    else stop();
  };

  toggle.addEventListener('click', () => {
    enabled = !enabled;
    sync();
  });
  reducedMotion.addEventListener('change', sync);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Phones fire resize as the address bar slides away; ignore small height-only changes
      if (window.innerWidth !== width || Math.abs(window.innerHeight - height) > 120) setup();
    }, 150);
  });

  document.body.append(canvas, toggle);
  setup();
  sync();
})();
