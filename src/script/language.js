// Language switcher functionality.
// Depends on the `translations` object defined in translations.js, loaded before this file.
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
  
  /**
   * Dims the flag icon of the inactive language in the toggle button.
   * @param {'fr'|'en'} lang - Currently active language.
   */
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
  
  /**
   * Applies translated strings to every element flagged for i18n, and updates
   * `<html lang>`. Two markup conventions are supported: `data-i18n` swaps the
   * element's content (or placeholder, for inputs/textareas), while
   * `data-i18n-attr="attr:key,attr2:key2"` swaps arbitrary HTML attributes
   * (e.g. `title`, `aria-label`) that plain innerHTML translation can't reach.
   * @param {'fr'|'en'} lang - Language to apply.
   */
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