/* What-if simulator + input sync (function names preserved). */

function updateSimVal(el, vid, dec) {
  const target = document.getElementById(vid);
  if (!target) return;
  target.textContent = parseFloat(el.value).toFixed(dec);
}

function syncSimFromForm() {
  const map = [
    ['sim-att', 'f-att', 'sv-att', 0],
    ['sim-study', 'f-study', 'sv-study', 1],
    ['sim-sleep', 'f-sleep', 'sv-sleep', 1],
    ['sim-math', 'f-math', 'sv-math', 0],
    ['sim-sci', 'f-sci', 'sv-sci', 0],
    ['sim-eng', 'f-eng', 'sv-eng', 0],
    ['sim-hist', 'f-hist', 'sv-hist', 0],
  ];

  map.forEach(([sid, fid, vid, dec]) => {
    const v = document.getElementById(fid).value;
    document.getElementById(sid).value = v;
    document.getElementById(vid).textContent = parseFloat(v).toFixed(dec);
  });

  runSimulation();
  showToast('Simulator synced from input form', '🔄');
}

function resetSim() {
  document.getElementById('sim-att').value = 85;
  document.getElementById('sv-att').textContent = '85';
  document.getElementById('sim-study').value = 4;
  document.getElementById('sv-study').textContent = '4.0';
  document.getElementById('sim-sleep').value = 7;
  document.getElementById('sv-sleep').textContent = '7.0';
  document.getElementById('sim-math').value = 75;
  document.getElementById('sv-math').textContent = '75';
  document.getElementById('sim-sci').value = 68;
  document.getElementById('sv-sci').textContent = '68';
  document.getElementById('sim-eng').value = 72;
  document.getElementById('sv-eng').textContent = '72';
  document.getElementById('sim-hist').value = 60;
  document.getElementById('sv-hist').textContent = '60';

  runSimulation();
}

function runSimulation() {
  const sf = {
    att: +document.getElementById('sim-att').value,
    study: +document.getElementById('sim-study').value,
    sleep: +document.getElementById('sim-sleep').value,
    math: +document.getElementById('sim-math').value,
    sci: +document.getElementById('sim-sci').value,
    eng: +document.getElementById('sim-eng').value,
    hist: +document.getElementById('sim-hist').value,
    extra: 1,
    parent: 1,
    internet: 1,
    gender: 0,
  };
  sf.avg = avg([sf.math, sf.sci, sf.eng, sf.hist]);

  const p = predictStudent(sf);
  const pct = (p.ensemble * 100).toFixed(1);

  const probEl = document.getElementById('sim-prob');
  probEl.textContent = pct + '%';
  probEl.style.color = p.ensemble > 0.6 ? 'var(--neon)' : p.ensemble > 0.4 ? 'var(--yellow)' : 'var(--red)';

  const fill = document.getElementById('sim-meter-fill');
  fill.style.width = pct + '%';
  fill.style.background = p.ensemble > 0.6
    ? 'linear-gradient(90deg,var(--neon),var(--neon2))'
    : p.ensemble > 0.4
      ? 'linear-gradient(90deg,var(--yellow),#ff8800)'
      : 'linear-gradient(90deg,var(--red),#ff8866)';

  const verdict = document.getElementById('sim-verdict');
  verdict.textContent = p.passing ? '✓ LIKELY PASS' : '✗ AT RISK OF FAIL';
  verdict.style.cssText = p.passing
    ? 'background:rgba(0,255,200,0.1);border:1px solid rgba(0,255,200,0.3);color:#00ffc8;font-family:Orbitron,monospace;font-size:.85rem;font-weight:900;letter-spacing:2px;padding:10px 20px;border-radius:8px;display:inline-block;margin-top:8px'
    : 'background:rgba(255,68,102,0.1);border:1px solid rgba(255,68,102,0.3);color:#ff4466;font-family:Orbitron,monospace;font-size:.85rem;font-weight:900;letter-spacing:2px;padding:10px 20px;border-radius:8px;display:inline-block;margin-top:8px';

  const riskColors = { Low: 'var(--neon)', Medium: 'var(--yellow)', High: 'var(--red)', Critical: 'var(--red)' };
  document.getElementById('sim-risk').textContent = p.risk;
  document.getElementById('sim-risk').style.color = riskColors[p.risk];
  document.getElementById('sim-avg').textContent = sf.avg.toFixed(1);
}

// initialize
runSimulation();

