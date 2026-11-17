const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectPanel(id, focus = false) {
  const selected = tabs.find(tab => tab.getAttribute('aria-controls') === id) || tabs[0];
  tabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) selected.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    const id = tab.getAttribute('aria-controls');
    selectPanel(id);
    window.location.hash = id;
  });
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    const id = tabs[next].getAttribute('aria-controls');
    selectPanel(id, true);
    window.location.hash = id;
  });
});
document.querySelectorAll('[data-panel]').forEach(link => {
  link.addEventListener('click', () => selectPanel(link.dataset.panel, true));
});
window.addEventListener('hashchange', () => selectPanel(window.location.hash.slice(1)));
selectPanel(window.location.hash.slice(1));

const planningViewport = document.getElementById('planning-viewport');
const planningImage = planningViewport.querySelector('img');
const zoomOut = document.getElementById('planning-zoom-out');
const zoomIn = document.getElementById('planning-zoom-in');
const zoomReset = document.getElementById('planning-zoom-reset');
const zoomLevel = document.getElementById('planning-zoom-level');
let planningZoom = 1;

function renderPlanningZoom() {
  if (!planningViewport.clientWidth || !planningViewport.clientHeight) return;
  const ratio = planningImage.naturalWidth / planningImage.naturalHeight;
  if (!Number.isFinite(ratio) || ratio <= 0) return;
  // Use the container dimensions before scrollbars, so zoom stays stable.
  const fittedWidth = Math.min(planningViewport.offsetWidth, planningViewport.offsetHeight * ratio);
  planningImage.style.width = `${Math.floor(fittedWidth * planningZoom)}px`;
  zoomOut.disabled = planningZoom <= 1;
  zoomIn.disabled = planningZoom >= 6;
  zoomLevel.textContent = `${Math.round(planningZoom * 100)} %`;
  if (planningZoom === 1) planningViewport.scrollTo(0, 0);
}

zoomIn.addEventListener('click', () => {
  planningZoom = Math.min(6, planningZoom + 0.5);
  renderPlanningZoom();
});
zoomOut.addEventListener('click', () => {
  planningZoom = Math.max(1, planningZoom - 0.5);
  renderPlanningZoom();
});
zoomReset.addEventListener('click', () => {
  planningZoom = 1;
  renderPlanningZoom();
});
planningImage.addEventListener('load', renderPlanningZoom);
new ResizeObserver(renderPlanningZoom).observe(planningViewport);
renderPlanningZoom();
