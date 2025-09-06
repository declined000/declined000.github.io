// ---------------------- typing hint on hero ----------------------
(function () {
    // We keep the caret blinking but don't auto-type letters to avoid layout jumps.
    // If you want real typing later, we can add it — for now this is just a visual caret.
  })();
  
  // ---------------------- enter on click ---------------------------
  document.addEventListener('click', (e) => {
    // If they click in the hero area, scroll down to the app
    const hero = document.getElementById('landing');
    const app = document.getElementById('app');
    if (!hero || !app) return;
    const withinHero = hero.contains(e.target);
    if (withinHero) {
      app.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  // ---------------------- tab navigation ---------------------------
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = {
    home: document.getElementById('tab-home'),
    now: document.getElementById('tab-now'),
    projects: document.getElementById('tab-projects'),
    papers: document.getElementById('tab-papers')
  };
  
  function selectTab(name) {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === name)));
    Object.entries(panels).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle('hidden', key !== name);
    });
    // update hash (keeps behavior like the reference)
    if (location.hash !== `#${name}`) {
      history.replaceState(null, '', `#${name}`);
    }
  }
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
  });
  
  // hash -> tab on load
  function fromHash() {
    const name = (location.hash || '#home').replace('#', '');
    if (panels[name]) selectTab(name); else selectTab('home');
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
  
  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();
  