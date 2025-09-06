// Current year
document.getElementById('y').textContent = new Date().getFullYear();

// Optional: basic tab highlight based on hash
const tabs = document.querySelectorAll('.tab');
function setActive() {
  const hash = window.location.hash || '#home';
  tabs.forEach(t => t.classList.toggle('is-active', t.getAttribute('href') === hash));
}
setActive();
window.addEventListener('hashchange', setActive);
