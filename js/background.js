// ===== Interactive background: cursor-following glow orb + ambient drifting particles =====

function initInteractiveBackground() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const orb = document.getElementById('bg-orb');

  let mx = window.innerWidth / 2, my = window.innerHeight / 3;
  let ox = mx, oy = my;

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    root.style.setProperty('--mx', (mx / window.innerWidth * 100).toFixed(1) + '%');
    root.style.setProperty('--my', (my / window.innerHeight * 100).toFixed(1) + '%');
  }, { passive: true });

  if (orb && !reduceMotion) {
    orb.style.left = ox + 'px';
    orb.style.top = oy + 'px';
    (function tick() {
      ox += (mx - ox) * 0.045;
      oy += (my - oy) * 0.045;
      orb.style.left = ox + 'px';
      orb.style.top = oy + 'px';
      requestAnimationFrame(tick);
    })();
  }

  const container = document.getElementById('bg-particles');
  if (container && !container.childElementCount) {
    const colors = ['var(--cyan)', 'var(--magenta)', 'var(--green)'];
    const count = window.innerWidth < 640 ? 14 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'bg-particle';
      p.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      p.style.setProperty('--y', (Math.random() * 100).toFixed(1) + '%');
      p.style.setProperty('--s', (2 + Math.random() * 2.5).toFixed(1) + 'px');
      p.style.setProperty('--c', colors[i % colors.length]);
      p.style.setProperty('--dur', (12 + Math.random() * 12).toFixed(1) + 's');
      p.style.setProperty('--delay', (Math.random() * -20).toFixed(1) + 's');
      p.style.setProperty('--dx', (Math.random() * 70 - 35).toFixed(0) + 'px');
      p.style.setProperty('--dy', (Math.random() * 70 - 35).toFixed(0) + 'px');
      container.appendChild(p);
    }
  }
}

window.addEventListener('DOMContentLoaded', initInteractiveBackground);
