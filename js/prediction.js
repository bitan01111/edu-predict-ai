/* Prediction engine + UI rendering (function names preserved). */

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function rfPredict(f) {
  const scoreComp = f.avg * 0.45 + f.att * 0.25 + f.study * 4 + f.sleep * 1.5 + f.extra * 3 + f.parent * 4 + f.internet * 2;
  const base = scoreComp / 100;
  const noise = (Math.random() - 0.5) * 0.04;
  return clamp(sigmoid((base - 0.52) * 8) + noise, 0.01, 0.99);
}

function xgbPredict(f) {
  const weakPenalty = (f.math < 50 ? -5 : 0) + (f.sci < 50 ? -4 : 0) + (f.eng < 50 ? -3 : 0) + (f.hist < 50 ? -3 : 0);
  const boost = f.study > 5 ? 5 : f.study > 3 ? 2 : 0;
  const attBoost = f.att > 85 ? 4 : f.att < 60 ? -8 : 0;
  const raw = (f.avg + weakPenalty + boost + attBoost) / 100;
  const noise = (Math.random() - 0.5) * 0.035;
  return clamp(sigmoid((raw - 0.55) * 9) + noise, 0.01, 0.99);
}

function catPredict(f) {
  const catScore = f.extra * 2 + f.parent * 3 + f.internet * 1.5 + f.gender * 0.5;
  const contScore = f.avg * 0.4 + f.att * 0.3 + f.study * 3.5 + f.sleep * 1.2;
  const total = (contScore + catScore) / (100 + 6);
  const noise = (Math.random() - 0.5) * 0.03;
  return clamp(sigmoid((total - 0.53) * 9) + noise, 0.01, 0.99);
}

function getFeatures() {
  const byId = (id) => document.getElementById(id);
  const math = +byId('f-math').value;
  const sci = +byId('f-sci').value;
  const eng = +byId('f-eng').value;
  const hist = +byId('f-hist').value;

  return {
    name: byId('f-name').value || 'Student',
    math,
    sci,
    eng,
    hist,
    att: +byId('f-att').value,
    study: +byId('f-study').value,
    sleep: +byId('f-sleep').value,
    extra: +byId('f-extra').value,
    parent: +byId('f-parent').value,
    internet: +byId('f-internet').value,
    gender: +byId('f-gender').value,
    avg: avg([math, sci, eng, hist]),
  };
}

function predictStudent(f) {
  const rf = rfPredict(f);
  const xgb = xgbPredict(f);
  const cat = catPredict(f);
  const ensemble = rf * 0.4 + xgb * 0.35 + cat * 0.25;
  const passing = ensemble > 0.5;
  const consensus = [rf, xgb, cat].filter((v) => v > 0.5).length;
  return {
    rf,
    xgb,
    cat,
    ensemble,
    passing,
    consensus,
    risk: ensemble > 0.75 ? 'Low' : ensemble > 0.5 ? 'Medium' : ensemble > 0.3 ? 'High' : 'Critical',
  };
}

let lastFeatures = null;
let lastPred = null;

function runPrediction() {
  const f = getFeatures();
  const loading = document.getElementById('loading');
  if (!loading) return;
  loading.classList.add('show');

  setTimeout(() => {
    loading.classList.remove('show');
    const p = predictStudent(f);
    lastFeatures = f;
    lastPred = p;

    renderDashboard(f, p);
    renderWeakSubjects(f);
    renderRecommendations(f, p);
    renderXAI(f, p);
    renderStudyPlanner(f, p);
    updatePDFPreview(f, p);
    syncSimFromForm();

    document.getElementById('dashboard-content').classList.remove('hidden');
    document.getElementById('dashboard-empty').classList.add('hidden');
    document.getElementById('weak-content').classList.remove('hidden');
    document.getElementById('rec-content').classList.remove('hidden');

    scrollTo('#dashboard');
    showToast(`Analytics complete for ${f.name}!`, '⚡');
  }, 900);
}

function renderDashboard(f, p) {
  document.getElementById('dash-name').textContent = f.name;
  document.getElementById('dash-meta').textContent = `Prediction: ${new Date().toLocaleString()} · Ensemble of 3 ML models`;

  const v = document.getElementById('dash-verdict');
  v.textContent = p.passing ? '✓ PASS' : '✗ FAIL';
  v.style.cssText = p.passing
    ? 'background:rgba(0,255,200,0.12);border:1px solid rgba(0,255,200,0.4);color:#00ffc8;margin-left:auto;padding:10px 24px;border-radius:8px;font-family:Orbitron,monospace;font-size:.9rem;font-weight:900;letter-spacing:2px'
    : 'background:rgba(255,68,102,0.12);border:1px solid rgba(255,68,102,0.4);color:#ff4466;margin-left:auto;padding:10px 24px;border-radius:8px;font-family:Orbitron,monospace;font-size:.9rem;font-weight:900;letter-spacing:2px';

  document.getElementById('d-avg').textContent = f.avg.toFixed(1);
  document.getElementById('d-pass').textContent = (p.ensemble * 100).toFixed(1) + '%';
  document.getElementById('d-pass').className =
    'metric-value ' +
    (p.ensemble > 0.6 ? 'color-green' : p.ensemble > 0.4 ? 'color-yellow' : 'color-red');

  const riskColors = { Low: 'color-green', Medium: 'color-yellow', High: 'color-red', Critical: 'color-red' };
  document.getElementById('d-risk').textContent = p.risk;
  document.getElementById('d-risk').className = 'metric-value ' + riskColors[p.risk];
  document.getElementById('d-risk-sub').textContent =
    { Low: 'Likely to pass', Medium: 'Needs attention', High: 'At risk of failing', Critical: 'Immediate help needed' }[p.risk];

  document.getElementById('d-consensus').textContent = `${p.consensus}/3`;

  const subjects = [
    { n: 'Mathematics', v: f.math },
    { n: 'Science', v: f.sci },
    { n: 'English', v: f.eng },
    { n: 'History', v: f.hist },
    { n: 'Attendance', v: f.att },
  ];

  document.getElementById('score-bars').innerHTML = subjects
    .map(
      (s) => `
    <div class="progress-bar-wrap">
      <div class="progress-label"><span>${s.n}</span><span style="font-family:'Share Tech Mono',monospace">${s.v}</span></div>
      <div class="progress-track"><div class="progress-fill ${s.v < 50 ? 'red' : s.v < 65 ? 'yellow' : ''}" style="width:${s.v}%"></div></div>
    </div>`
    )
    .join('');

  renderModelChart(p);
  renderRadarChart(f);
  renderDistChart(f);
  renderFeatureImportance(f, p);
}

function randomize() {
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.value = v;
  };

  const subjects = ['math', 'sci', 'eng', 'hist'];
  const vals = [r(40, 100), r(40, 100), r(40, 100), r(40, 100)];
  const vidMap = { math: 'math-val', sci: 'sci-val', eng: 'eng-val', hist: 'hist-val' };
  subjects.forEach((s, i) => {
    set('f-' + s, vals[i]);
    document.getElementById(vidMap[s]).textContent = vals[i];
  });

  const att = r(50, 100);
  set('f-att', att);
  document.getElementById('att-val').textContent = att;

  const study = rf(0, 10);
  set('f-study', study);
  document.getElementById('study-val').textContent = study;

  const sleep = rf(4, 10);
  set('f-sleep', sleep);
  document.getElementById('sleep-val').textContent = sleep;

  set('f-extra', r(0, 1));
  set('f-parent', r(0, 2));
  set('f-internet', r(0, 1));
  set('f-gender', r(0, 1));

  const names = [
    'Alex Chen',
    'Maria Garcia',
    'James Wilson',
    'Priya Patel',
    'Lucas Silva',
    'Emily Brown',
    'Omar Hassan',
    'Yuki Tanaka',
    'Nina Petrov',
    'Carlos Lima',
  ];
  set('f-name', names[r(0, names.length - 1)]);
  showToast('Random student data loaded!', '🎲');
}

function resetForm() {
  ['f-math', 'f-sci', 'f-eng', 'f-hist'].forEach((id) => (document.getElementById(id).value = 50));
  document.getElementById('f-att').value = 80;
  document.getElementById('f-study').value = 4;
  document.getElementById('f-sleep').value = 7;

  ['math-val', 'sci-val', 'eng-val', 'hist-val'].forEach((id) => (document.getElementById(id).textContent = '50'));
  document.getElementById('att-val').textContent = '80';
  document.getElementById('study-val').textContent = '4.0';
  document.getElementById('sleep-val').textContent = '7.0';
  showToast('Form reset', '✕');
}

// Export for other modules
window.lastFeatures = () => lastFeatures;
window.lastPred = () => lastPred;

