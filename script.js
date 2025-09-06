// Year
document.getElementById('y') && (document.getElementById('y').textContent = new Date().getFullYear());

// Splash dot logic
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const dot    = document.getElementById('dot');
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;

function moveDot(e){
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`;
}

// Compute scale so the dot covers the viewport from click point
function scaleForFullCover(x, y, dotSize){
  const w = window.innerWidth, h = window.innerHeight;
  const r = dotSize / 2;
  // farthest corner distance from (x,y)
  const dx = Math.max(x, w - x);
  const dy = Math.max(y, h - y);
  const dist = Math.hypot(dx, dy);
  return (dist + r) / r;
}

function enterSite(){
  // respect reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){
    splash.remove();
    app.hidden = false;
    return;
  }

  const DOT_SIZE = parseFloat(getComputedStyle(dot).getPropertyValue('--dot-size')) || 12;
  const scale = scaleForFullCover(mx, my, DOT_SIZE);
  dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${scale})`;
  splash.classList.add('is-exiting');

  // After the dot expansion finishes, reveal app
  dot.addEventListener('transitionend', () => {
    app.hidden = false;
    splash.remove(); // clean from DOM
  }, { once:true });
}

if (splash){
  window.addEventListener('mousemove', moveDot);
  // mobile: center dot under finger
  window.addEventListener('touchmove', (e)=>{
    const t = e.touches[0];
    moveDot({ clientX: t.clientX, clientY: t.clientY });
  }, { passive:true });

  // click / tap / Enter key to enter
  window.addEventListener('click', enterSite);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') enterSite(); });
}
