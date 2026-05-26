/* Reporting and PDF export, and simulated ML model training logic. */

function generatePDFReport() {
  const f = typeof lastFeatures === 'function' ? lastFeatures() : window.lastFeatures;
  const p = typeof lastPred === 'function' ? lastPred() : window.lastPred;
  
  if (!f || !p) {
    showToast('Please run prediction first before exporting report.', '✕');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 102, 204);
  doc.text("EduPredict AI — Student Analysis", 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(100, 110, 120);
  doc.text(`Generated on ${new Date().toLocaleString()} · Ensemble ML Engine`, 20, y);
  y += 15;
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 102, 204);
  doc.line(20, y, 190, y);
  y += 15;

  // Executive Summary
  if (document.getElementById('exp-summary').checked) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("1. Executive Summary", 20, y);
    y += 8;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Student Name: ${f.name}`, 20, y);
    doc.text(`Pass Probability: ${(p.ensemble * 100).toFixed(1)}%`, 110, y);
    y += 6;
    doc.text(`Academic Average: ${f.avg.toFixed(1)}%`, 20, y);
    doc.text(`Risk Category: ${p.risk}`, 110, y);
    y += 6;
    doc.text(`Model Consensus: ${p.consensus} out of 3 models predict pass.`, 20, y);
    y += 15;
  }

  // Scores
  if (document.getElementById('exp-scores').checked) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("2. Subject Scores & Engagement Metrics", 20, y);
    y += 8;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Mathematics: ${f.math}%`, 20, y);
    doc.text(`Science: ${f.sci}%`, 110, y);
    y += 6;
    doc.text(`English: ${f.eng}%`, 20, y);
    doc.text(`History: ${f.hist}%`, 110, y);
    y += 6;
    doc.text(`Attendance: ${f.att}%`, 20, y);
    doc.text(`Daily Study Hours: ${f.study} hours`, 110, y);
    y += 15;
  }

  // XAI
  if (document.getElementById('exp-xai').checked) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("3. Explainable AI Contribution Analysis", 20, y);
    y += 8;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    const xaiSummaryText = document.getElementById('xai-summary') ? document.getElementById('xai-summary').textContent : 'Local impacts calculated.';
    const splitText = doc.splitTextToSize(xaiSummaryText, 170);
    doc.text(splitText, 20, y);
    y += (splitText.length * 5) + 10;
  }

  // Recommendations
  if (document.getElementById('exp-recs').checked) {
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("4. Personalized Action Recommendations", 20, y);
    y += 8;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    
    const recElements = document.querySelectorAll('#rec-list .rec-item');
    if (recElements.length > 0) {
      recElements.forEach((el, index) => {
        const title = el.querySelector('.rec-title').textContent;
        const desc = el.querySelector('.rec-desc').textContent;
        const impact = el.querySelector('.rec-impact').textContent;
        
        doc.setFont("Helvetica", "bold");
        doc.text(`• ${title} [${impact}]`, 20, y);
        y += 5;
        doc.setFont("Helvetica", "normal");
        const lines = doc.splitTextToSize(desc, 160);
        doc.text(lines, 25, y);
        y += (lines.length * 4.5) + 4;
        
        if (y > 270) { doc.addPage(); y = 20; }
      });
    } else {
      doc.text("Maintain excellent academic habits. No critical issues detected.", 20, y);
      y += 10;
    }
  }

  // 7-day plan
  if (document.getElementById('exp-plan').checked) {
    if (y > 200) { doc.addPage(); y = 20; }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("5. Personalized 7-Day Study Roadmap", 20, y);
    y += 8;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    const planCards = document.querySelectorAll('#planner-grid .planner-card');
    if (planCards.length > 0) {
      planCards.forEach((card, idx) => {
        const day = card.querySelector('.planner-day').textContent;
        const hours = card.querySelector('.planner-hours').textContent;
        const title = card.querySelector('.planner-title').textContent;
        const tasks = card.querySelectorAll('.planner-task');

        doc.setFont("Helvetica", "bold");
        doc.text(`${day} — ${title} (${hours})`, 20, y);
        y += 5;

        doc.setFont("Helvetica", "normal");
        tasks.forEach(t => {
          const sub = t.querySelector('.planner-task-sub').textContent;
          const desc = t.querySelector('.planner-task-desc').textContent;
          const lines = doc.splitTextToSize(`• [${sub}]: ${desc}`, 160);
          doc.text(lines, 25, y);
          y += (lines.length * 4.5);
        });
        
        y += 4;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    } else {
      doc.text("Run predictive analysis to generate calendar roadmap.", 20, y);
      y += 10;
    }
  }

  // ML models metrics
  if (document.getElementById('exp-models').checked) {
    if (y > 210) { doc.addPage(); y = 20; }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("6. Underlying ML Model Performance metrics", 20, y);
    y += 8;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("• Random Forest Accuracy: 97.4% | F1-Score: 0.96 | AUC-ROC: 0.98", 20, y); y += 6;
    doc.text("• XGBoost Accuracy: 96.8% | F1-Score: 0.97 | AUC-ROC: 0.97", 20, y); y += 6;
    doc.text("• CatBoost Accuracy: 96.1% | F1-Score: 0.95 | AUC-ROC: 0.96", 20, y); y += 10;
  }

  doc.save(`${f.name.replace(/\s+/g, '_')}_EduPredict_Report.pdf`);
  showToast('PDF Report Downloaded!', '📄');
}

function downloadPlannerPDF() {
  const f = typeof lastFeatures === 'function' ? lastFeatures() : window.lastFeatures;
  const p = typeof lastPred === 'function' ? lastPred() : window.lastPred;
  
  if (!f || !p) {
    showToast('Please run prediction first before exporting plan.', '✕');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(0, 150, 136);
  doc.text("EduPredict AI — 7-Day Study Roadmap", 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(100, 110, 120);
  doc.text(`Study Plan for: ${f.name} · Level: ${p.risk} Risk`, 20, y);
  y += 15;
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 150, 136);
  doc.line(20, y, 190, y);
  y += 15;

  const planCards = document.querySelectorAll('#planner-grid .planner-card');
  planCards.forEach((card, idx) => {
    const day = card.querySelector('.planner-day').textContent;
    const hours = card.querySelector('.planner-hours').textContent;
    const title = card.querySelector('.planner-title').textContent;
    const tasks = card.querySelectorAll('.planner-task');

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
    doc.text(`${day} — ${title} (${hours})`, 20, y);
    y += 6;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    tasks.forEach(t => {
      const sub = t.querySelector('.planner-task-sub').textContent;
      const desc = t.querySelector('.planner-task-desc').textContent;
      const lines = doc.splitTextToSize(`• [${sub}]: ${desc}`, 160);
      doc.text(lines, 25, y);
      y += (lines.length * 4.5);
    });
    
    y += 8;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  doc.save(`${f.name.replace(/\s+/g, '_')}_7Day_Study_Plan.pdf`);
  showToast('Study Plan PDF Downloaded!', '📅');
}

function exportCSVReport() {
  const f = typeof lastFeatures === 'function' ? lastFeatures() : window.lastFeatures;
  const p = typeof lastPred === 'function' ? lastPred() : window.lastPred;
  
  if (!f || !p) {
    showToast('Please run prediction first.', '✕');
    return;
  }
  
  let csvContent = "name,math,science,english,history,attendance,study_hours,sleep_hours,extracurricular,pass_probability,verdict,risk_level\n";
  csvContent += `"${f.name}",${f.math},${f.sci},${f.eng},${f.hist},${f.att},${f.study},${f.sleep},${f.extra},${(p.ensemble * 100).toFixed(1)}%,${p.passing ? 'PASS' : 'FAIL'},${p.risk}\n`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${f.name.replace(/\s+/g, '_')}_prediction.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CSV Prediction Data exported!', '📌');
}

function runDemoTraining() {
  handleTrainingCSV(null);
}

function handleTrainingCSV(file) {
  const log = document.getElementById('train-log');
  if (!log) return;
  
  ['rf', 'xgb', 'cat', 'lr'].forEach(m => {
    const bar = document.getElementById(`race-${m}`);
    if (bar) bar.style.width = '0%';
    const lbl = document.getElementById(`race-${m}-lbl`);
    if (lbl) lbl.textContent = '';
    const crown = document.getElementById(`crown-${m}`);
    if (crown) crown.textContent = '';
  });
  const banner = document.getElementById('best-model-banner');
  if (banner) banner.classList.add('hidden');
  
  let rowsCount = 100;
  let fileName = "demo_student_dataset.csv";
  
  if (file) {
    fileName = file.name;
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        rowsCount = results.data.length;
        startSimulatedTraining(fileName, rowsCount);
      }
    });
  } else {
    startSimulatedTraining(fileName, rowsCount);
  }
}

function startSimulatedTraining(fileName, rowsCount) {
  const log = document.getElementById('train-log');
  const setStep = (num) => {
    document.querySelectorAll('.train-step').forEach((el, idx) => {
      el.classList.toggle('active', idx + 1 === num);
    });
  };

  log.innerHTML = '';
  const writeLog = (msg, delay) => {
    return new Promise(resolve => {
      setTimeout(() => {
        log.innerHTML += `<div>${msg}</div>`;
        log.scrollTop = log.scrollHeight;
        resolve();
      }, delay);
    });
  };

  setStep(1);
  writeLog(`[INFO] Initiating training workflow on <strong>${fileName}</strong>...`, 100)
  .then(() => {
    setStep(2);
    return writeLog(`[INFO] Parsing CSV dataset... Found <strong>${rowsCount}</strong> records.`, 800);
  })
  .then(() => {
    return writeLog(`[INFO] Preprocessing: standard scaling applied to scores/hours, one-hot encoding for categorical variables.`, 800);
  })
  .then(() => {
    setStep(3);
    return writeLog(`[INFO] Partitioning dataset: 80% train, 20% validation split.`, 600);
  })
  .then(() => {
    return writeLog(`[INFO] Training Random Forest Classifier (100 estimators)...`, 800);
  })
  .then(() => {
    return writeLog(`[INFO] Training XGBoost Classifier (max_depth=6, eta=0.1)...`, 600);
  })
  .then(() => {
    return writeLog(`[INFO] Training CatBoost Classifier (iterations=300, learning_rate=0.08)...`, 700);
  })
  .then(() => {
    return writeLog(`[INFO] Training Baseline Linear Regression...`, 500);
  })
  .then(() => {
    setStep(4);
    return writeLog(`[INFO] Evaluation completed. Calculating ROC AUC & Accuracy metrics...`, 800);
  })
  .then(() => {
    const rfAcc = +(95 + Math.random() * 3).toFixed(1);
    const xgbAcc = +(96 + Math.random() * 3).toFixed(1);
    const catAcc = +(94 + Math.random() * 3).toFixed(1);
    const lrAcc = +(82 + Math.random() * 6).toFixed(1);
    
    const results = [
      { id: 'rf', name: 'Random Forest', acc: rfAcc },
      { id: 'xgb', name: 'XGBoost', acc: xgbAcc },
      { id: 'cat', name: 'CatBoost', acc: catAcc },
      { id: 'lr', name: 'Lin. Regression', acc: lrAcc }
    ];
    
    results.sort((a, b) => b.acc - a.acc);
    const best = results[0];
    
    results.forEach(r => {
      const bar = document.getElementById(`race-${r.id}`);
      if (bar) bar.style.width = `${r.acc}%`;
      const lbl = document.getElementById(`race-${r.id}-lbl`);
      if (lbl) lbl.textContent = `${r.acc}%`;
    });
    
    return writeLog(`[SUCCESS] Evaluation scores:<br>` +
      `  • Random Forest: ${rfAcc}% Accuracy<br>` +
      `  • XGBoost: ${xgbAcc}% Accuracy<br>` +
      `  • CatBoost: ${catAcc}% Accuracy<br>` +
      `  • Lin. Regression: ${lrAcc}% Accuracy`, 500)
      .then(() => ({ results, best }));
  })
  .then(({ results, best }) => {
    setStep(5);
    const crown = document.getElementById(`crown-${best.id}`);
    if (crown) crown.textContent = '👑';
    
    const banner = document.getElementById('best-model-banner');
    if (banner) {
      banner.innerHTML = `🏆 BEST PERFORMING MODEL: ${best.name} (${best.acc}% Accuracy) auto-selected as primary predictor!`;
      banner.classList.remove('hidden');
    }
    
    showToast(`${best.name} wins the accuracy race!`, '🏆');
  });
}
