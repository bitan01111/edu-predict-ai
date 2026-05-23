/* Global helpers + theme toggle. Function names preserved for inline onclick attributes. */

function scrollTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function updateRange(el, vid) {
  const val = parseFloat(el.value);
  const fixed = el.step && el.step < 1 ? 1 : 0;
  const out = Number.isFinite(val) ? val.toFixed(fixed) : el.value;
  const target = document.getElementById(vid);
  if (target) target.textContent = out;
}

function showToast(msg, emoji = '⚡') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.querySelector('span') && (toast.querySelector('span').textContent = emoji);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rf(min, max, step = 0.5) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function toggleTheme() {
  const root = document.documentElement;
  const cur = root.getAttribute('data-theme');
  root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
}

function initHeroCounters() {
  document.querySelectorAll('.hero-stat .num').forEach((el) => {
    const target = el.textContent;
    const n = parseFloat(target);
    if (!Number.isFinite(n)) return;
    const start = 0;
    const end = n;
    const dur = 1500;
    const step = dur / 60;
    const inc = end / 60;
    let cur = start;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, end);
      el.textContent = Number.isInteger(end)
        ? Math.round(cur)
        : cur.toFixed(1) + (target.includes('%') ? '%' : '');
      if (cur >= end) clearInterval(t);
    }, step);
  });
}

window.addEventListener('load', () => {
  if (typeof initAnalyticsCharts === 'function') initAnalyticsCharts();
  initHeroCounters();

  const trainDrop = document.getElementById('train-drop-zone');
  if (trainDrop) {
    trainDrop.addEventListener('dragover', (e) => {
      e.preventDefault();
      trainDrop.classList.add('dragover');
    });
    trainDrop.addEventListener('dragleave', () => trainDrop.classList.remove('dragover'));
    trainDrop.addEventListener('drop', (e) => {
      e.preventDefault();
      trainDrop.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.csv')) handleTrainingCSV(file);
    });
  }
});

