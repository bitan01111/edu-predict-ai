/* Features rendering and interaction code. */

function renderWeakSubjects(f) {
  const weakGrid = document.getElementById('weak-grid');
  if (!weakGrid) return;
  const subjects = [
    { name: 'Mathematics', val: f.math, type: 'academic', desc: 'Quantitative reasoning & problem solving' },
    { name: 'Science', val: f.sci, type: 'academic', desc: 'Empirical analysis & conceptual understanding' },
    { name: 'English', val: f.eng, type: 'academic', desc: 'Comprehension, writing & verbal skills' },
    { name: 'History', val: f.hist, type: 'academic', desc: 'Critical analysis & historical context' },
    { name: 'Attendance', val: f.att, type: 'metric', desc: 'Classroom engagement & presence' }
  ];
  
  weakGrid.innerHTML = subjects.map(s => {
    let statusClass = 'status-good';
    let statusText = 'Excellent';
    let tip = 'Maintain current habits.';
    if (s.val < 50) {
      statusClass = 'status-critical';
      statusText = 'Critical';
      tip = 'Immediate tutoring & daily review required.';
    } else if (s.val < 65) {
      statusClass = 'status-needs-attention';
      statusText = 'At Risk';
      tip = 'Targeted practice & extra help recommended.';
    } else if (s.val < 85) {
      statusClass = 'status-warning';
      statusText = 'Moderate';
      tip = 'Focused exercises to strengthen understanding.';
    }
    return `
      <div class="card weak-card">
        <div class="weak-card-header">
          <div>
            <div class="weak-subject-name">${s.name}</div>
            <div class="weak-subject-desc">${s.desc}</div>
          </div>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="weak-score-row">
          <span class="weak-score-label">Score / Rate</span>
          <span class="weak-score-value">${s.val}${s.name === 'Attendance' ? '%' : ''}</span>
        </div>
        <div class="progress-bar-wrap" style="margin-top: 12px;">
          <div class="progress-track"><div class="progress-fill ${s.val < 50 ? 'red' : s.val < 65 ? 'yellow' : ''}" style="width:${s.val}%"></div></div>
        </div>
        <div class="weak-tip" style="margin-top: 12px; font-size: 0.78rem; color: var(--text2)">💡 ${tip}</div>
      </div>
    `;
  }).join('');
}

function renderRecommendations(f, p) {
  const recList = document.getElementById('rec-list');
  if (!recList) return;
  const recs = [];
  
  if (f.avg < 60) {
    recs.push({
      title: 'Targeted Remedial Program',
      desc: `Average academic score is low (${f.avg.toFixed(1)}%). We recommend setting up 1-on-1 tutoring sessions for core subjects, focusing on foundational concepts before attempting complex topics.`,
      impact: 'High Impact',
      icon: '📚',
      type: 'critical'
    });
  }
  if (f.math < 60) {
    recs.push({
      title: 'Mathematics Skill Building',
      desc: `Math score is low (${f.math}). Set aside 45 minutes daily specifically for math practice problems. Focus on step-by-step problem-solving and ask for feedback on homework mistakes.`,
      impact: 'Medium Impact',
      icon: '🔢',
      type: 'warning'
    });
  }
  if (f.sci < 60) {
    recs.push({
      title: 'Science Concept Reinforcement',
      desc: `Science score is low (${f.sci}). Spend time reviewing lab reports, formulas, and core scientific theories. Leverage visual learning tools (like diagrams or videos).`,
      impact: 'Medium Impact',
      icon: '🧪',
      type: 'warning'
    });
  }
  if (f.att < 80) {
    recs.push({
      title: 'Class Attendance & Engagement',
      desc: `Attendance is critical at ${f.att}%. Aim for a minimum target of 90%. Missing class directly correlates with drop in subject understanding and performance.`,
      impact: 'Critical Impact',
      icon: '📅',
      type: 'critical'
    });
  }
  if (f.study < 3.5) {
    recs.push({
      title: 'Increase Structured Study Hours',
      desc: `Current daily study hours (${f.study} hrs) are below the recommended 4+ hours for academic growth. Increase study time by 30 mins each week using the Pomodoro technique.`,
      impact: 'High Impact',
      icon: '⏱️',
      type: 'warning'
    });
  }
  if (f.sleep < 6.5) {
    recs.push({
      title: 'Optimize Sleep Hygiene',
      desc: `With ${f.sleep} hours of sleep, cognitive performance, memory consolidation, and classroom focus are reduced. Ensure 7.5 to 8.5 hours of consistent sleep nightly.`,
      impact: 'Medium Impact',
      icon: '😴',
      type: 'info'
    });
  }
  if (f.parent === 0) {
    recs.push({
      title: 'Enhance Mentor & Parent Engagement',
      desc: 'Academic environment feels unsupported. Establish a regular weekly check-in with a mentor, counselor, or parent to review progress and maintain accountability.',
      impact: 'High Impact',
      icon: '🤝',
      type: 'warning'
    });
  }
  if (recs.length === 0) {
    recs.push({
      title: 'Advanced Enrichment Exercises',
      desc: 'All scores and student metrics are exemplary. We recommend participating in honors coursework, student clubs, or peer mentoring to expand leadership and deep subject understanding.',
      impact: 'Enrichment',
      icon: '🌟',
      type: 'success'
    });
  }
  
  recList.innerHTML = recs.map(r => `
    <div class="rec-item rec-${r.type}">
      <div class="rec-icon">${r.icon}</div>
      <div class="rec-details">
        <div class="rec-header">
          <h4 class="rec-title">${r.title}</h4>
          <span class="rec-impact">${r.impact}</span>
        </div>
        <p class="rec-desc">${r.desc}</p>
      </div>
    </div>
  `).join('');
}

function renderXAI(f, p) {
  const features = [
    { name: 'Average Score', val: f.avg, baseline: 65, weight: 0.35, label: `Avg Score: ${f.avg.toFixed(1)}%` },
    { name: 'Attendance', val: f.att, baseline: 75, weight: 0.25, label: `Attendance: ${f.att}%` },
    { name: 'Study Hours', val: f.study, baseline: 4.0, weight: 0.18, label: `Study: ${f.study} hrs/day` },
    { name: 'Parental Support', val: f.parent, baseline: 1.0, weight: 0.10, label: `Parent Support: ${f.parent === 2 ? 'High' : f.parent === 1 ? 'Med' : 'Low'}` },
    { name: 'Sleep Quality', val: f.sleep, baseline: 7.0, weight: 0.07, label: `Sleep: ${f.sleep} hrs/night` },
    { name: 'Internet Access', val: f.internet, baseline: 0.5, weight: 0.05, label: `Internet: ${f.internet ? 'Yes' : 'No'}` }
  ];

  features.forEach(feat => {
    let diff = 0;
    if (feat.name === 'Parental Support' || feat.name === 'Internet Access') {
      diff = feat.val - feat.baseline;
    } else {
      diff = (feat.val - feat.baseline) / feat.baseline;
    }
    feat.contribution = diff * feat.weight * 100;
  });

  const positiveDrivers = features.filter(feat => feat.contribution > 0).sort((a, b) => b.contribution - a.contribution);
  const riskFactors = features.filter(feat => feat.contribution <= 0).sort((a, b) => a.contribution - b.contribution);

  const posEl = document.getElementById('xai-positive');
  const negEl = document.getElementById('xai-negative');
  const allEl = document.getElementById('xai-all');

  if (posEl) {
    if (positiveDrivers.length === 0) {
      posEl.innerHTML = '<div style="color:var(--text3); font-size:0.85rem; padding: 10px 0;">No major positive drivers identified.</div>';
    } else {
      posEl.innerHTML = positiveDrivers.map(feat => `
        <div class="xai-row">
          <span class="xai-lbl">${feat.name}</span>
          <span class="xai-val color-green">+${feat.contribution.toFixed(1)}%</span>
        </div>
      `).join('');
    }
  }

  if (negEl) {
    if (riskFactors.length === 0) {
      negEl.innerHTML = '<div style="color:var(--text3); font-size:0.85rem; padding: 10px 0;">No negative risk factors identified. Excellent profile.</div>';
    } else {
      negEl.innerHTML = riskFactors.map(feat => `
        <div class="xai-row">
          <span class="xai-lbl">${feat.name}</span>
          <span class="xai-val color-red">${feat.contribution.toFixed(1)}%</span>
        </div>
      `).join('');
    }
  }

  if (allEl) {
    allEl.innerHTML = features.map(feat => {
      const isPos = feat.contribution > 0;
      const barWidth = Math.min(Math.abs(feat.contribution) * 2.5, 100);
      const barColor = isPos ? 'var(--neon)' : 'var(--red)';
      const alignClass = isPos ? 'bar-right' : 'bar-left';
      return `
        <div class="xai-bar-container">
          <div class="xai-bar-label-row">
            <span class="xai-bar-label">${feat.name} (${feat.label})</span>
            <span class="xai-bar-value" style="color: ${barColor}">${isPos ? '+' : ''}${feat.contribution.toFixed(1)}%</span>
          </div>
          <div class="xai-bar-track">
            <div class="xai-bar-fill ${alignClass}" style="width: ${barWidth}%; background-color: ${barColor};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  const summaryEl = document.getElementById('xai-summary');
  if (summaryEl) {
    const topPos = positiveDrivers.length > 0 ? positiveDrivers[0] : null;
    const topNeg = riskFactors.length > 0 ? riskFactors[0] : null;

    let statement = `Ensemble ML model has analyzed the dataset profile for <strong>${f.name}</strong>. `;
    if (topPos) {
      statement += `The strongest driver supporting a passing result is their <strong>${topPos.name}</strong>, contributing a positive +${topPos.contribution.toFixed(1)}% to the passing likelihood. `;
    }
    if (topNeg) {
      statement += `Conversely, the most significant risk factor is <strong>${topNeg.name}</strong>, reducing confidence by ${Math.abs(topNeg.contribution).toFixed(1)}%. `;
      const improvement = Math.abs(topNeg.contribution) * 0.8;
      statement += `Targeted improvement of this single factor could increase pass probability by approximately <strong>${improvement.toFixed(1)}%</strong>.`;
    } else {
      statement += `No substantial risk factors are currently suppressing the performance prediction. Maintain the current positive routine.`;
    }
    summaryEl.innerHTML = statement;
  }
}

function renderStudyPlanner(f, p) {
  const plannerGrid = document.getElementById('planner-grid');
  if (!plannerGrid) return;
  
  document.getElementById('planner-name').textContent = f.name;
  const riskBadge = document.getElementById('planner-risk-badge');
  riskBadge.textContent = `${p.risk.toUpperCase()} RISK`;
  riskBadge.style.cssText = p.risk === 'Low'
    ? 'border-color: rgba(0,255,200,0.3); color: var(--neon); background: rgba(0,255,200,0.05);'
    : p.risk === 'Medium'
      ? 'border-color: rgba(255,204,0,0.3); color: var(--yellow); background: rgba(255,204,0,0.05);'
      : 'border-color: rgba(255,68,102,0.3); color: var(--red); background: rgba(255,68,102,0.05);';

  const weakAreas = [];
  if (f.math < 70) weakAreas.push({ name: 'Mathematics', score: f.math });
  if (f.sci < 70) weakAreas.push({ name: 'Science', score: f.sci });
  if (f.eng < 70) weakAreas.push({ name: 'English', score: f.eng });
  if (f.hist < 70) weakAreas.push({ name: 'History', score: f.hist });

  const focusSubjects = weakAreas.length > 0 ? weakAreas.map(w => w.name) : ['Mathematics', 'Science', 'English', 'History'];
  let studyHoursBudget = 3.0;
  if (p.risk === 'Medium') studyHoursBudget = 4.5;
  if (p.risk === 'High') studyHoursBudget = 6.0;
  if (p.risk === 'Critical') studyHoursBudget = 7.5;

  const planDays = [
    { day: 'Day 1', title: 'Foundational Review', morning: 'Review formulas & basic concepts.', afternoon: 'Work through textbook examples.', hours: studyHoursBudget },
    { day: 'Day 2', title: 'Targeted Practice', morning: 'Attempt medium-difficulty problems.', afternoon: 'Identify pattern of mistakes in practice.', hours: studyHoursBudget },
    { day: 'Day 3', title: 'Active Recall Session', morning: 'Self-quizzing on key vocabulary & theories.', afternoon: 'Solve timed study questions.', hours: Math.max(1, studyHoursBudget - 0.5) },
    { day: 'Day 4', title: 'Mid-Week Checkpoint', morning: 'Review topics from Days 1-2.', afternoon: 'Peer discussion or online tutoring.', hours: studyHoursBudget },
    { day: 'Day 5', title: 'Simulated Assessment', morning: 'Complete a timed practice test section.', afternoon: 'Perform detailed error analysis.', hours: studyHoursBudget + 1 },
    { day: 'Day 6', title: 'Weak Spot Resolution', morning: 'Consult teachers/peers on remaining doubts.', afternoon: 'Re-attempt failed practice questions.', hours: Math.max(1, studyHoursBudget - 1) },
    { day: 'Day 7', title: 'Consolidation & Rest', morning: 'Light summary sheet reading.', afternoon: 'Relax & prepare for class. Rest mind.', hours: 1.5 }
  ];

  plannerGrid.innerHTML = planDays.map((d, idx) => {
    const mainSubject = focusSubjects[idx % focusSubjects.length];
    const subSubject = focusSubjects[(idx + 1) % focusSubjects.length];
    
    return `
      <div class="card planner-card">
        <div class="planner-day-header">
          <span class="planner-day">${d.day}</span>
          <span class="planner-hours">${d.hours.toFixed(1)} hrs</span>
        </div>
        <div class="planner-title">${d.title}</div>
        <div class="planner-tasks">
          <div class="planner-task">
            <span class="planner-task-bullet">☀️</span>
            <div>
              <div class="planner-task-sub">${mainSubject} Morning Focus</div>
              <div class="planner-task-desc">${d.morning}</div>
            </div>
          </div>
          <div class="planner-task">
            <span class="planner-task-bullet">🌤️</span>
            <div>
              <div class="planner-task-sub">${subSubject} Afternoon Focus</div>
              <div class="planner-task-desc">${d.afternoon}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Hide empty state and show planner content
  document.getElementById('planner-empty').classList.add('hidden');
  document.getElementById('planner-content').classList.remove('hidden');
}

function updatePDFPreview(f, p) {
  const previewContent = document.getElementById('pdf-preview-content');
  const pdfStatus = document.getElementById('pdf-status');
  if (!previewContent) return;

  if (pdfStatus) {
    pdfStatus.textContent = 'PDF Report successfully compiled & ready for export.';
    pdfStatus.style.color = 'var(--neon)';
  }

  const weak = [];
  if (f.math < 60) weak.push(`Math (${f.math})`);
  if (f.sci < 60) weak.push(`Science (${f.sci})`);
  if (f.eng < 60) weak.push(`English (${f.eng})`);
  if (f.hist < 60) weak.push(`History (${f.hist})`);
  const weakText = weak.length > 0 ? weak.join(', ') : 'None';

  previewContent.innerHTML = `
    <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-bottom: 1px dashed var(--border); padding-bottom: 10px; margin-bottom: 10px;">
      <div>
        <strong>Student:</strong> ${f.name}<br>
        <strong>Avg Score:</strong> ${f.avg.toFixed(1)}%<br>
        <strong>Attendance:</strong> ${f.att}%<br>
      </div>
      <div>
        <strong>Pass Probability:</strong> ${(p.ensemble * 100).toFixed(1)}%<br>
        <strong>Risk Status:</strong> ${p.risk} Risk<br>
        <strong>Weak Areas:</strong> ${weakText}<br>
      </div>
    </div>
    <div>
      <div style="font-weight: bold; font-size: 0.7rem; color: var(--neon2); margin-bottom: 4px; text-transform: uppercase;">Executive Summary</div>
      <p style="margin: 0 0 10px 0; color: var(--text2)">Student is categorized under <strong>${p.risk} Risk</strong>. The consensus of the ML models stands at <strong>${p.consensus}/3</strong> predicting a passing outcome. Key suggestions have been generated to stabilize scores.</p>
    </div>
    <div style="font-size: 0.65rem; color: var(--text3); text-align: center; border-top: 1px solid var(--border); padding-top: 8px;">
      EduPredict AI System Report · Fully Local Computation
    </div>
  `;
}

function loadSampleData() {
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.value = v;
  };
  set('f-name', 'Sophia Vance');
  set('f-math', 45);
  set('f-sci', 52);
  set('f-eng', 58);
  set('f-hist', 40);
  set('f-att', 68);
  set('f-study', 2.0);
  set('f-sleep', 6.0);
  set('f-extra', 0);
  set('f-parent', 0);
  set('f-internet', 1);
  set('f-gender', 1);

  document.getElementById('math-val').textContent = '45';
  document.getElementById('sci-val').textContent = '52';
  document.getElementById('eng-val').textContent = '58';
  document.getElementById('hist-val').textContent = '40';
  document.getElementById('att-val').textContent = '68';
  document.getElementById('study-val').textContent = '2.0';
  document.getElementById('sleep-val').textContent = '6.0';

  showToast('Demo Student: Sophia Vance loaded!', '📌');
  runPrediction();
}

function downloadSampleCSV() {
  const csvContent = "name,math,science,english,history,attendance,study_hours,sleep_hours,extracurricular\n" +
    "Liam Carter,82,78,90,85,92,5.5,7.5,1\n" +
    "Sophia Vance,45,52,58,40,68,2.0,6.0,0\n" +
    "Jackson Reed,70,72,68,75,85,4.0,7.0,1\n" +
    "Olivia Chen,95,98,92,88,96,6.5,8.0,1\n" +
    "Ethan Hunt,55,60,50,55,75,3.0,6.5,0\n";
    
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "student_sample_data.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Sample CSV downloaded!', '⬇');
}

function loadSampleCSVData() {
  const csvString = "name,math,science,english,history,attendance,study_hours,sleep_hours,extracurricular\n" +
    "Liam Carter,82,78,90,85,92,5.5,7.5,1\n" +
    "Sophia Vance,45,52,58,40,68,2.0,6.0,0\n" +
    "Jackson Reed,70,72,68,75,85,4.0,7.0,1\n" +
    "Olivia Chen,95,98,92,88,96,6.5,8.0,1\n" +
    "Ethan Hunt,55,60,50,55,75,3.0,6.5,0\n";
    
  const results = Papa.parse(csvString, { header: true, dynamicTyping: true });
  processCSVData(results.data);
}

function processCSVData(rows) {
  const students = rows.filter(r => r.name);
  if (students.length === 0) {
    showToast('No valid student rows found in CSV.', '✕');
    return;
  }
  
  const thead = document.getElementById('csv-thead');
  thead.innerHTML = `
    <th>Name</th>
    <th>Math</th>
    <th>Science</th>
    <th>English</th>
    <th>History</th>
    <th>Attendance</th>
    <th>Study Hrs</th>
    <th>Avg Score</th>
    <th>Pass Prob</th>
    <th>Verdict</th>
    <th>Risk</th>
  `;
  
  const tbody = document.getElementById('csv-tbody');
  tbody.innerHTML = students.map(s => {
    const f = {
      name: s.name,
      math: s.math || 0,
      sci: s.science || 0,
      eng: s.english || 0,
      hist: s.history || 0,
      att: s.attendance || 0,
      study: s.study_hours || 0,
      sleep: s.sleep_hours || 0,
      extra: s.extracurricular || 0,
      parent: 1,
      internet: 1,
      gender: 0,
      avg: avg([s.math || 0, s.science || 0, s.english || 0, s.history || 0])
    };
    
    const p = predictStudent(f);
    const isPass = p.passing;
    const riskClass = p.risk === 'Low' ? 'color-green' : p.risk === 'Medium' ? 'color-yellow' : 'color-red';
    const verdictClass = isPass ? 'color-green' : 'color-red';
    
    return `
      <tr>
        <td><strong>${f.name}</strong></td>
        <td>${f.math}</td>
        <td>${f.sci}</td>
        <td>${f.eng}</td>
        <td>${f.hist}</td>
        <td>${f.att}%</td>
        <td>${f.study}h</td>
        <td>${f.avg.toFixed(1)}%</td>
        <td><span class="${verdictClass}">${(p.ensemble * 100).toFixed(1)}%</span></td>
        <td><span class="status-badge ${isPass ? 'status-good' : 'status-critical'}">${isPass ? 'PASS' : 'FAIL'}</span></td>
        <td><span class="${riskClass}">${p.risk}</span></td>
      </tr>
    `;
  }).join('');
  
  document.getElementById('csv-count').textContent = students.length;
  document.getElementById('csv-results').classList.remove('hidden');
  scrollTo('#upload');
  showToast(`Batch parsed! Predicted ${students.length} students.`, '📄');
  window.lastBatchData = students;
}

function selectModel(modelId, card) {
  document.querySelectorAll('.model-card').forEach(el => {
    el.classList.remove('active');
    const badge = el.querySelector('.model-badge');
    if (badge) {
      if (el.id === 'model-rf') badge.textContent = 'Secondary';
      if (el.id === 'model-xgb') badge.textContent = 'Secondary';
      if (el.id === 'model-cat') badge.textContent = 'Secondary';
    }
  });
  
  card.classList.add('active');
  const badge = card.querySelector('.model-badge');
  if (badge) badge.textContent = 'Active';
  
  const nameMap = { rf: 'Random Forest', xgb: 'XGBoost', cat: 'CatBoost' };
  showToast(`${nameMap[modelId]} highlighted as primary model!`, '🤖');
}

window.addEventListener('DOMContentLoaded', () => {
  const csvFile = document.getElementById('csv-file');
  if (csvFile) {
    csvFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => processCSVData(results.data)
        });
      }
    });
  }

  const dropZone = document.getElementById('drop-zone');
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => processCSVData(results.data)
        });
      }
    });
  }
});
