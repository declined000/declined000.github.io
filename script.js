/* footer year */
document.getElementById('y').textContent = new Date().getFullYear();

/* typing + caret (no trailing space) */
(function typeIn(){
  const target = document.getElementById('typeTarget');
  const caret  = document.getElementById('caret');
  if(!target || !caret) return;

  const text  = "I’m Wiktoria.";   // no space after '.'
  const speed = 60, delay = 250;
  let i = 0;
  function step(){
    target.textContent = text.slice(0, i++);
    if(i <= text.length) setTimeout(step, speed);
  }
  setTimeout(step, delay);
})();

/* splash dot & transition */
const splash = document.getElementById('splash');
const app    = document.getElementById('app');
const dot    = document.getElementById('dot');

if(splash && dot){
  let mx = innerWidth/2, my = innerHeight/2;
  const moveDot = (x,y)=>{ mx=x; my=y; dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(1)`; };
  addEventListener('mousemove', e=>moveDot(e.clientX, e.clientY));
  addEventListener('touchmove', e=>{ const t=e.touches[0]; if(t) moveDot(t.clientX, t.clientY); }, {passive:true});

  const coverScale = (x,y,size)=>{ const w=innerWidth,h=innerHeight,r=size/2; const dx=Math.max(x,w-x), dy=Math.max(y,h-y); return (Math.hypot(dx,dy)+r)/r; };
  const enter = (x=mx,y=my)=>{
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){
      splash.remove(); app.hidden=false; initRouter(); return;
    }
    splash.style.pointerEvents='none';
    const size = parseFloat(getComputedStyle(dot).getPropertyValue('--dot-size')) || 12;
    requestAnimationFrame(()=>{ dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${coverScale(x,y,size)})`; });
    dot.addEventListener('transitionend', ()=>{ app.hidden=false; splash.remove(); initRouter(); }, {once:true});
  };
  addEventListener('click', e=>enter(e.clientX ?? mx, e.clientY ?? my));
  addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') enter(mx,my); });
}else{
  initRouter();
}

/* simple hash router for tabs */
function initRouter(){
  const pills = document.querySelectorAll('.pill');
  const views = document.querySelectorAll('.view');

  const titles = {
    home:'Home — Wiktoria',
    now:'Now — Wiktoria',
    projects:'Projects — Wiktoria',
    papers:'Papers — Wiktoria'
  };

  function setActive(view){
    pills.forEach(p=>{
      const on = p.dataset.view === view;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-selected', String(on));
    });
    document.title = titles[view] || 'Wiktoria — Engineer & Researcher';
  }
  function show(view){
    let ok=false;
    views.forEach(v=>{
      const match = v.dataset.view === view;
      v.hidden = !match;
      v.classList.toggle('is-visible', match);
      if(match) ok=true;
    });
    if(!ok){ location.replace('#home'); show('home'); setActive('home'); }
  }
  function route(){
    const view = (location.hash || '#home').slice(1).toLowerCase();
    setActive(view); show(view); window.scrollTo(0,0);
  }

  pills.forEach(p=>{
    p.addEventListener('click', e=>{
      e.preventDefault();
      const v = p.dataset.view || 'home';
      if(location.hash !== `#${v}`) history.pushState(null,'',`#${v}`);
      route();
    });
  });

  addEventListener('hashchange', route);
  if(!location.hash) history.replaceState(null,'','#home');
  route();

  /* make entire paper card clickable (delegated) */
  const papersView = document.getElementById('view-papers');
  if(papersView){
    papersView.addEventListener('click', function(e){
      const card = e.target.closest('.paper');
      if(!card) return;
      const primaryLink = card.querySelector('.link-row a');
      if(primaryLink){
        const url = primaryLink.getAttribute('href');
        const target = primaryLink.getAttribute('target') || '_self';
        if(url){ window.open(url, target); }
      }
    });

    // keyboard accessibility
    papersView.querySelectorAll('.paper').forEach(card=>{
      card.setAttribute('tabindex','0');
      card.addEventListener('keydown', function(ev){
        if(ev.key==='Enter' || ev.key===' '){
          ev.preventDefault();
          const link = card.querySelector('.link-row a');
          if(link){ link.click(); }
        }
      });
    });
  }
}
