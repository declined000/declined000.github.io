// Year in footer
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

// ===== Splash cursor-dot & transition =====
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const dot    = document.getElementById('dot');

if (splash && dot) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  function moveDot(x, y) {
    mx = x; my = y;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`;
  }

  // mouse & touch follow
  window.addEventListener('mousemove', (e) => moveDot(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    moveDot(t.clientX, t.clientY);
  }, { passive: true });

  // compute scale so dot covers viewport from click point
  function coverScale(x, y, size) {
    const w = window.innerWidth, h = window.innerHeight;
    const r = size / 2;
    const dx = Math.max(x, w - x);
    const dy = Math.max(y, h - y);
    const dist = Math.hypot(dx, dy);
    return (dist + r) / r;
  }

  function enterSite() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { splash.remove(); app.hidden = false; return; }

    const size = parseFloat(getComputedStyle(dot).getPropertyValue('--dot-size')) || 12;
    const scale = coverScale(mx, my, size);

    // move dot to last cursor position & grow
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${scale})`;

    // after transition, reveal app
    dot.addEventListener('transitionend', () => {
      app.hidden = false;
      splash.remove();
    }, { once: true });
  }

  // click/tap/Enter to enter
  window.addEventListener('click', enterSite);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') enterSite();
  });
}
