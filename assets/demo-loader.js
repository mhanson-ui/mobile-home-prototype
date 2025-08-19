// Demo Loader: renders a single rail using the same data as Balanced/Sports
// Usage: include this file, then call loadRailDemo('rail_type', { source: 'balanced'|'sports' })

(function(){
  function getQueryParam(name){
    const m = new URLSearchParams(window.location.search).get(name);
    return m || '';
  }

  function pickDataset(){
    const q = getQueryParam('source');
    if (q === 'sports') return 'sports';
    if (q === 'balanced') return 'balanced';
    // fallback to balanced if not specified
    return 'balanced';
  }

  async function fetchDataset(dataset){
    const path = dataset === 'sports'
      ? '../demo_sports/data_sports.json'
      : '../demo_balanced/data_balanced.json';
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load dataset: '+path);
    return res.json();
  }

  function renderSingleRail(rail){
    if (!rail) {
      const main = document.querySelector('main') || document.body;
      const note = document.createElement('div');
      note.className = 'panel';
      note.textContent = 'Rail not found in selected dataset.';
      main.appendChild(note);
      return;
    }
    const json = { rails: [rail], meta: {} };
    if (typeof window.renderHomeFromJSON === 'function') {
      window.renderHomeFromJSON(json);
    }
  }

  async function loadRailDemo(railType, opts){
    try {
      const dataset = (opts && opts.source) || pickDataset();
      const data = await fetchDataset(dataset);
      const rail = (data.rails || []).find(r => r.type === railType);
      renderSingleRail(rail);
    } catch (e) {
      console.error(e);
      renderSingleRail(null);
    }
  }

  window.loadRailDemo = loadRailDemo;
})();


