/* Footer year */
document.getElementById('y').textContent = new Date().getFullYear();

/* ===== Typing + caret ===== */
(function typeIn() {
  const target = document.getElementById('typeTarget');
  const caret  = document.getElementById('caret');
  if (!target || !caret) return;

  const text  = "I’m Wiktoria.";
  const speed = 60;
  const delay = 250;
  let i = 0;

  function step() {
    target.textContent = text.slice(0, i++);
    if (i <= text.length) setTimeout(step, speed);
  }
  setTimeout(step, delay);
})();

/* ===== Splash dot & transition ===== */
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const dot    = document.getElementById('dot');

if (splash && dot) {
  let mx = innerWidth / 2, my = innerHeight / 2;

  const moveDot = (x, y) => {
    mx = x; my = y;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`;
  };

  // Track pointer position
  addEventListener('mousemove', e => moveDot(e.clientX, e.clientY));
  addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) moveDot(t.clientX, t.clientY);
  }, { passive: true });

  // Compute scale to cover viewport from (x,y)
  const coverScale = (x, y, size) => {
    const w = innerWidth, h = innerHeight, r = size / 2;
    const dx = Math.max(x, w - x), dy = Math.max(y, h - y);
    return (Math.hypot(dx, dy) + r) / r;
  };

  const enter = (x = mx, y = my) => {
    // Respect reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      splash.remove();
      app.hidden = false;
      initRouter();
      return;
    }

    splash.style.pointerEvents = 'none'; // prevent double-enter
    const size = parseFloat(getComputedStyle(dot).getPropertyValue('--dot-size')) || 12;

    // Ensure we expand from the *click* point even if there wasn't a move
    moveDot(x, y);

    // Flush transform before scaling for reliable transition
    requestAnimationFrame(() => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${coverScale(x, y, size)})`;
    });

    dot.addEventListener('transitionend', () => {
      app.hidden = false;
      splash.remove();
      initRouter();
    }, { once: true });
  };

  addEventListener('click', e => enter(e.clientX ?? mx, e.clientY ?? my));
  addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') enter(mx, my);
  });
} else {
  // No splash (e.g., directly loaded app) — still init the router
  initRouter();
}

/* ===== Router for tabs ===== */
function initRouter() {
  const pills = document.querySelectorAll('.pill');
  const views = document.querySelectorAll('.view');

  const titleByView = {
    home:    'Home — Wiktoria',
    now:     'Now — Wiktoria',
    projects:'Projects — Wiktoria',
    papers:  'Papers — Wiktoria'
  };

  function setActive(target) {
    pills.forEach(p => {
      const active = p.dataset.view === target;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-selected', String(active));
    });
    document.title = titleByView[target] || 'Wiktoria — Engineer & Researcher';
  }

  function show(target) {
    let found = false;
    views.forEach(v => {
      const isMatch = v.dataset.view === target;
      v.hidden = !isMatch;
      v.classList.toggle('is-visible', isMatch);
      if (isMatch) found = true;
    });
    if (!found) {
      location.replace('#home');
      show('home');
      setActive('home');
    }
  }

  function route() {
    const hash = (location.hash || '#home').replace('#', '').toLowerCase();
    setActive(hash);
    show(hash);
    window.scrollTo(0, 0);
  }

  pills.forEach(p => {
    p.setAttribute('role', 'tab');
    p.addEventListener('click', e => {
      e.preventDefault();
      const target = p.dataset.view || 'home';
      if (location.hash !== `#${target}`) history.pushState(null, '', `#${target}`);
      route();
    });
    p.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        p.click();
      }
    });
  });

  addEventListener('hashchange', route);
  if (!location.hash) history.replaceState(null, '', '#home');
  route();
}
