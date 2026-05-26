/* Multilingual Translation System for EduPredict AI */

const translations = {
  en: {
    appName: "EDUPREDICT AI",
    runAnalytics: "⚡ Run Analytics",
    loadDemo: "📌 Load Demo Data"
  },
  es: {
    appName: "EDUPREDICT IA",
    runAnalytics: "⚡ Ejecutar Análisis",
    loadDemo: "📌 Cargar Datos de Demostración"
  }
};

let currentLanguage = 'en';

function switchLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  
  // Update translation targets in HTML
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Automatically bind elements if language changes
window.addEventListener('DOMContentLoaded', () => {
  // Bind key elements with tags
  const logo = document.querySelector('.logo');
  if (logo) logo.setAttribute('data-i18n', 'appName');
  
  const heroBtn1 = document.querySelector('.hero .btn-primary');
  if (heroBtn1) heroBtn1.setAttribute('data-i18n', 'runAnalytics');

  const heroBtn2 = document.querySelector('.hero .btn-secondary');
  if (heroBtn2) heroBtn2.setAttribute('data-i18n', 'loadDemo');
});
