// Language switcher functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get saved language or set default to French
  let currentLang = localStorage.getItem('language') || 'fr';
  
  // Initialize language
  applyLanguage(currentLang);
  updateLanguageToggle(currentLang);
  
  // Language toggle functionality
  document.getElementById('languageToggle').addEventListener('click', function() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('language', currentLang);
    
    applyLanguage(currentLang);
    updateLanguageToggle(currentLang);
  });
  
  // Function to update language toggle appearance
  function updateLanguageToggle(lang) {
    const toggle = document.getElementById('languageToggle');
    const frFlag = document.getElementById('frFlag');
    const enFlag = document.getElementById('enFlag');
    
    if (lang === 'fr') {
      frFlag.classList.remove('opacity-50');
      enFlag.classList.add('opacity-50');
    } else {
      frFlag.classList.add('opacity-50');
      enFlag.classList.remove('opacity-50');
    }
  }
  
  // Function to apply translations
  function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translations[lang][key];
        } else {
          element.innerHTML = translations[lang][key];
        }
      }
    });
    
    // Update document language
    document.documentElement.lang = lang;
    
    // Update language-specific attributes
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const attrData = element.getAttribute('data-i18n-attr').split(',');
      attrData.forEach(item => {
        const [attr, key] = item.split(':');
        if (translations[lang] && translations[lang][key]) {
          element.setAttribute(attr, translations[lang][key]);
        }
      });
    });
  }
});