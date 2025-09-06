// Footer year
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

/* ===== Typing + caret ===== */
(function typeIn(){
  const target = document.getElementById('typeTarget');
  const caret  = document.getElementById('caret');
  if (!target || !caret) return;

  const text  = "I’m Wiktoria.";
  const speed = 60;     // ms per char
  const delay = 250;    // pause before typing

  let i = 0;
  function step(){
    target.textContent = text.slice(0, i++);
    if (i <= text.length) setTimeout(step, speed);
  }
  setTimeout(step, delay);
})();

/* ===== Cursor dot & splash transition ===== */
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const dot    = document.getElementById('dot');

if (splash && dot){
  let mx = innerWidth/2, my = innerHeight/2;

  const moveDot = (x,y)=>{
    mx=x; my=y;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`;
  };

  addEventListener('mousemove', e=>moveDot(e.clientX, e.clientY));
  addEventListener('touchmove', e=>{
    const t=e.touches[0]; moveDot(t.clientX, t.clientY);
  }, {passive:true});

  const coverScale = (x,y,size)=>{
    const w=innerWidth,h=innerHeight,r=size/2;
    const dx=Math.max(x,w-x), dy=Math.max(y,h-y);
    return (Math.hypot(dx,dy)+r)/r;
  };

  const enterSite = ()=>{
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){
      splash.remove(); app.hidden=false; return;
    }
    const size = parseFloat(getComputedStyle(dot).getPropertyValue('--dot-size')) || 12;
    const scale = coverScale(mx,my,size);
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${scale})`;
    dot.addEventListener('transitionend', ()=>{ app.hidden=false; splash.remove(); }, {once:true});
  };

  addEventListener('click', enterSite);
  addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') enterSite(); });
}

/* ===== Sticky pill active ===== */
const pills = document.querySelectorAll('.pill');
function setActive(){ const h=location.hash||'#home'; pills.forEach(p=>p.classList.toggle('is-active', p.getAttribute('href')===h)); }
setActive(); addEventListener('hashchange', setActive);
