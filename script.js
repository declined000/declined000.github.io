// Year
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

/* ========= Splash: typing + cursor-dot + transition ========= */
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const dot    = document.getElementById('dot');

(function typeIn(){
  const target = document.getElementById('typeTarget');
  if (!target) return;
  const text = "I’m Wiktoria.";
  let i = 0;
  const speed = 70; // ms per char

  function step(){
    target.textContent = text.slice(0, i++);
    if (i <= text.length) setTimeout(step, speed);
  }
  step();
})();

// Dot follow & expand
if (splash && dot){
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  function moveDot(x, y){
    mx = x; my = y;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`;
  }

  window.addEventListener('mousemove', (e)=> moveDot(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e)=> {
    const t = e.touches[0]; moveDot(t.clientX, t.clientY);
  }, { passive: true });

  function coverScale(x, y, size){
    const w = window.innerWidth, h = window.innerHeight;
    const r = size / 2;
    const dx = Math.max(x, w - x);
    const dy = Math.max(y, h - y);
    const dist = Math.hypot(dx, dy);
    return (dist + r) / r;
  }

  function enterSite(){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce){ splash.remove(); app.hidden = false; return; }

    const size = parseFloat(getComputedStyle(dot).getPropertyValue('--dot-size')) || 12;
    const scale = coverScale(mx, my, size);
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${scale})`;

    dot.addEventListener('transitionend', () => {
      app.hidden = false;
      splash.remove();
    }, { once:true });
  }

  window.addEventListener('click', enterSite);
  window.addEventListener('keydown', (e)=>{ if (e.key==='Enter'||e.key===' ') enterSite(); });
}

/* ========= Sticky pill active state ========= */
const pills = document.querySelectorAll('.pill');
function setActiveFromHash(){
  const hash = window.location.hash || '#home';
  pills.forEach(p => p.classList.toggle('is-active', p.getAttribute('href') === hash));
}
setActiveFromHash();
window.addEventListener('hashchange', setActiveFromHash);
