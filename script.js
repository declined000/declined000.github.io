/* Footer year */
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

/* ===== Typing + caret (splash only) ===== */
(function typeIn(){
  const target = document.getElementById('typeTarget');
  const caret  = document.getElementById('caret');
  if (!target || !caret) return;
  const text  = "I’m Wiktoria.";
  const speed = 60, delay = 250;
  let i = 0;
  function step(){ target.textContent = text.slice(0, i++); if (i <= text.length) setTimeout(step, speed); }
  setTimeout(step, delay);
})();

/* ===== Splash dot & transition ===== */
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const dot    = document.getElementById('dot');

if (splash && dot){
  let mx = innerWidth/2, my = innerHeight/2;
  const moveDot = (x,y)=>{ mx=x; my=y; dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`; };
  addEventListener('mousemove', e=>moveDot(e.clientX, e.clientY));
  addEventListener('touchmove', e=>{ const t=e.touches[0]; moveDot(t.clientX, t.clientY); }, {passive:true});

  const coverScale = (x,y,size)=>{ const w=innerWidth,h=innerHeight,r=size/2; const dx=Math.max(x,w-x), dy=Math.max(y,h-y); return (Math.hypot(dx,dy)+r)/r; };
  const enter = ()=>{
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){ splash.remove(); app.hidden=false; initRouter(); return; }
    const size = parseFloat(getComputedStyle(dot).getPropertyValue('--dot-size')) || 12;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${coverScale(mx,my,size)})`;
    dot.addEventListener('transitionend', ()=>{ app.hidden=false; splash.remove(); initRouter(); }, {once:true});
  };
  addEventListener('click', enter);
  addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') enter(); });
}else{
  initRouter();
}

/* ===== Tiny hash router (single-page tabs) ===== */
function initRouter(){
  const pills = document.querySelectorAll('.pill');
  const views = document.querySelectorAll('.view');

  function setActive(target){
    pills.forEach(p=>p.classList.toggle('is-active', p.dataset.view === target));
  }
  function show(target){
    let found = false;
    views.forEach(v=>{
      const isMatch = v.dataset.view === target;
      v.hidden = !isMatch;
      v.classList.toggle('is-visible', isMatch);
      if (isMatch) found = true;
    });
    if (!found){ location.replace('#home'); show('home'); setActive('home'); }
  }

  function route(){
    const hash = (location.hash || '#home').replace('#','').toLowerCase();
    setActive(hash); show(hash);
    // Simpler scroll reset (prevents “welcome sticking” if an exception happened)
    window.scrollTo(0, 0);
  }

  pills.forEach(p=>{
    p.addEventListener('click', e=>{
      e.preventDefault();
      const target = p.dataset.view || 'home';
      if (location.hash !== `#${target}`) history.pushState(null, '', `#${target}`);
      route();
    });
  });

  addEventListener('hashchange', route);

  if (!location.hash) history.replaceState(null, '', '#home');
  route();
}
