const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// Fonction pour afficher le toast
function showToast(message, type) {
  if (type === 'success') {
    toast.className = 'fixed top-4 right-4 z-50 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md transform translate-x-0 transition-transform duration-300 ease-in-out';
    toastIcon.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
  } else {
    toast.className = 'fixed top-4 right-4 z-50 p-4 rounded-md bg-red-100 text-red-800 border border-red-200 shadow-md transform translate-x-0 transition-transform duration-300 ease-in-out';
    toastIcon.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
  }
  
  toastMessage.textContent = message;
  
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
    toast.classList.add('translate-x-0');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('translate-x-0');
    toast.classList.add('translate-x-full');
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 5000);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  submitBtn.disabled = true;
  
  const originalBtnContent = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<span class="inline-flex items-center"><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Envoi en cours...</span>';
  
  
  const formData = new FormData(form);
  const object = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  
  const json = JSON.stringify(object);
  
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: json
  })
  .then(async (response) => {
    let json = await response.json();
    if (response.status == 200) {
      showToast('Message envoyé avec succès!', 'success');
      form.reset();
    } else {
      console.log(response);
      showToast('Erreur: ' + json.message, 'error');
    }
  })
  .catch(error => {
    console.log(error);
    showToast('Une erreur s\'est produite. Veuillez réessayer plus tard.', 'error');
  })
  .finally(() => {
    // Réactiver le bouton
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
  });
});