/* Chart.js renderers (function names preserved). */

let chartModels = null;
let chartRadar = null;
let chartDist = null;

function getChartColors() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
    text: dark ? '#8899bb' : '#334466',
    neon: '#00ffc8',
    neon2: '#00c8ff',
    purple: '#cc44ff',
    red: '#ff4466',
    yellow: '#ffcc00',
  };
}

function renderModelChart(p) {
  const ctx = document.getElementById('chart-models').getContext('2d');
  if (chartModels) chartModels.destroy();

  const c = getChartColors();
  chartModels = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Random Forest', 'XGBoost', 'CatBoost', 'Ensemble'],
      datasets: [
        {
          label: 'Pass Probability',
          data: [
            (p.rf * 100).toFixed(1),
            (p.xgb * 100).toFixed(1),
            (p.cat * 100).toFixed(1),
            (p.ensemble * 100).toFixed(1),
          ],
          backgroundColor: ['rgba(0,255,200,0.3)', 'rgba(0,200,255,0.3)', 'rgba(204,68,255,0.3)', 'rgba(255,204,0,0.3)'],
          borderColor: ['#00ffc8', '#00c8ff', '#cc44ff', '#ffcc00'],
          borderWidth: 1.5,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw}%`,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: c.grid },
          ticks: { color: c.text, callback: (v) => v + '%' },
        },
        x: {
          grid: { color: 'transparent' },
          ticks: { color: c.text },
        },
      },
    },
  });
}

function renderRadarChart(f) {
  const ctx = document.getElementById('chart-radar').getContext('2d');
  if (chartRadar) chartRadar.destroy();

  const c = getChartColors();
  chartRadar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Math', 'Science', 'English', 'History', 'Attendance', 'Study Hrs'],
      datasets: [
        {
          label: 'Student',
          data: [f.math, f.sci, f.eng, f.hist, f.att, f.study * 10],
          backgroundColor: 'rgba(0,255,200,0.1)',
          borderColor: '#00ffc8',
          pointBackgroundColor: '#00ffc8',
          borderWidth: 2,
          pointRadius: 4,
        },
        {
          label: 'Average',
          data: [65, 65, 65, 65, 75, 50],
          backgroundColor: 'rgba(0,200,255,0.05)',
          borderColor: 'rgba(0,200,255,0.4)',
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(0,200,255,0.6)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: c.text, boxWidth: 10, font: { size: 10 } },
        },
      },
      scales: {
        r: {
          grid: { color: c.grid },
          ticks: { color: c.text, font: { size: 9 } },
          pointLabels: { color: c.text, font: { size: 10 } },
          min: 0,
          max: 100,
        },
      },
    },
  });
}

function renderDistChart(f) {
  const ctx = document.getElementById('chart-dist').getContext('2d');
  if (chartDist) chartDist.destroy();

  const c = getChartColors();
  chartDist = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
      datasets: [
        {
          label: 'Class Distribution',
          data: [2, 4, 6, 9, 13, 18, 22, 18, 12, 5],
          borderColor: 'rgba(0,200,255,0.6)',
          backgroundColor: 'rgba(0,200,255,0.08)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'This Student',
          data: Array(10)
            .fill(null)
            .map((_, i) => {
              const v = Math.round(f.avg / 10);
              return i === v ? 25 : null;
            }),
          borderColor: '#ff00aa',
          backgroundColor: '#ff00aa',
          pointRadius: (v) => (v !== null ? 8 : 0),
          showLine: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: c.text, boxWidth: 10, font: { size: 10 } } },
      },
      scales: {
        y: { grid: { color: c.grid }, ticks: { color: c.text } },
        x: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 9 } } },
      },
    },
  });
}

function renderFeatureImportance() {
  const features = [
    { n: 'Average Score', v: 0.31 },
    { n: 'Attendance', v: 0.22 },
    { n: 'Study Hours', v: 0.17 },
    { n: 'Parental Support', v: 0.1 },
    { n: 'Sleep Quality', v: 0.08 },
    { n: 'Internet Access', v: 0.05 },
    { n: 'Extracurricular', v: 0.04 },
    { n: 'Gender', v: 0.03 },
  ];

  document.getElementById('feat-importance').innerHTML = features
    .map(
      (feat) => `
    <div class="feat-bar">
      <div class="feat-label"><span>${feat.n}</span><span class="feat-val">${(feat.v * 100).toFixed(0)}%</span></div>
      <div class="feat-track"><div class="feat-fill" style="width:${feat.v * 100}%"></div></div>
    </div>`
    )
    .join('');
}

function initAnalyticsCharts() {
  const c = getChartColors();

  new Chart(document.getElementById('chart-trend'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Class Avg',
          data: [62, 64, 61, 67, 70, 69, 73, 75, 74, 77],
          borderColor: '#00ffc8',
          backgroundColor: 'rgba(0,255,200,0.08)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
        },
        {
          label: 'Top 10%',
          data: [85, 86, 84, 88, 90, 89, 92, 93, 91, 95],
          borderColor: '#cc44ff',
          backgroundColor: 'rgba(204,68,255,0.05)',
          tension: 0.4,
          fill: false,
          borderDash: [5, 5],
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: c.text, boxWidth: 10, font: { size: 10 } } } },
      scales: { y: { grid: { color: c.grid }, ticks: { color: c.text } }, x: { grid: { color: c.grid }, ticks: { color: c.text } } },
    },
  });

  new Chart(document.getElementById('chart-pie'), {
    type: 'doughnut',
    data: {
      labels: ['Pass', 'Fail', 'Distinction'],
      datasets: [
        {
          data: [58, 24, 18],
          backgroundColor: ['rgba(0,255,200,0.6)', 'rgba(255,68,102,0.6)', 'rgba(204,68,255,0.6)'],
          borderColor: ['#00ffc8', '#ff4466', '#cc44ff'],
          borderWidth: 2,
        },
      ],
    },
    options: { responsive: true, plugins: { legend: { labels: { color: c.text, boxWidth: 12, font: { size: 11 } } } }, cutout: '65%' },
  });

  const scatter = Array.from({ length: 60 }, () => ({
    x: Math.round(50 + Math.random() * 48),
    y: Math.round(30 + Math.random() * 65 + Math.random() * 10),
  }));

  new Chart(document.getElementById('chart-scatter'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Students',
          data: scatter,
          backgroundColor: 'rgba(0,200,255,0.4)',
          borderColor: 'rgba(0,200,255,0.8)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Attendance %', color: c.text, font: { size: 10 } }, grid: { color: c.grid }, ticks: { color: c.text } },
        y: { title: { display: true, text: 'Avg Score', color: c.text, font: { size: 10 } }, grid: { color: c.grid }, ticks: { color: c.text } },
      },
    },
  });

  new Chart(document.getElementById('chart-bar'), {
    type: 'bar',
    data: {
      labels: ['0-1h', '1-2h', '2-3h', '3-4h', '4-5h', '5-6h', '6h+'],
      datasets: [
        {
          label: 'Avg Score',
          data: [42, 51, 59, 67, 73, 78, 81],
          backgroundColor: ['rgba(255,68,102,0.5)', 'rgba(255,68,102,0.4)', 'rgba(255,204,0,0.4)', 'rgba(255,204,0,0.5)', 'rgba(0,255,200,0.4)', 'rgba(0,255,200,0.5)', 'rgba(0,255,200,0.6)'],
          borderWidth: 0,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100, grid: { color: c.grid }, ticks: { color: c.text } }, x: { grid: { color: 'transparent' }, ticks: { color: c.text } } },
    },
  });
}

