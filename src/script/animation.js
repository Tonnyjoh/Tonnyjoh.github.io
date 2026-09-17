    /**
     * Ouvre la modale de certification avec un état de chargement pendant que l'image
     * se précharge, pour éviter un flash d'image cassée sur les connexions lentes.
     * Adapte aussi le gabarit de l'image selon sa hauteur réelle une fois chargée.
     * @param {string} img - URL de l'image du certificat.
     * @param {string} title - Titre affiché dans la modale.
     * @param {string} link - Lien "voir le certificat" ouvert depuis la modale.
     */
    function openCertModal(img, title, link) {
        const modal = document.getElementById('certModal');
        const modalImg = document.getElementById('certModalImg');
        const modalTitle = document.getElementById('certModalTitle');
        const modalLink = document.getElementById('certModalLink');
        
        // Afficher un loader pendant le chargement
        modalImg.src = '';
        modalImg.alt = 'Chargement...';
        modalTitle.textContent = 'Chargement en cours...';
        
        // Précharger l'image
        const image = new Image();
        image.src = img;
        
        image.onload = function() {
            modalImg.src = img;
            modalImg.alt = title;
            modalTitle.textContent = title;
            modalLink.href = link;
            
            // Ajuster le style de l'image selon sa taille
            if (image.height > window.innerHeight * 0.7) {
                modalImg.classList.add('max-h-[70vh]', 'w-auto');
                modalImg.classList.remove('max-w-full');
            } else {
                modalImg.classList.add('max-w-full');
                modalImg.classList.remove('max-h-[70vh]', 'w-auto');
            }
            
            // Afficher le modal
            modal.classList.remove('invisible', 'opacity-0');
            modal.classList.add('visible', 'opacity-100');
            document.body.classList.add('overflow-hidden');
        };
        
        image.onerror = function() {
            modalTitle.textContent = 'Erreur de chargement';
            modalImg.src = '';
            modalImg.alt = 'Image non disponible';
            modalLink.style.display = 'none';
            modal.classList.remove('invisible', 'opacity-0');
            modal.classList.add('visible', 'opacity-100');
            document.body.classList.add('overflow-hidden');
        };
    }

    // Fermer le modal
    document.getElementById('closeCertModal').onclick = function() {
        document.getElementById('certModal').classList.add('invisible', 'opacity-0');
        document.getElementById('certModal').classList.remove('visible', 'opacity-100');
        document.body.classList.remove('overflow-hidden');
    };
    
    // Fermer en cliquant à l'extérieur
    document.getElementById('certModal').onclick = function(e) {
        if (e.target === this) {
            this.classList.add('invisible', 'opacity-0');
            this.classList.remove('visible', 'opacity-100');
            document.body.classList.remove('overflow-hidden');
        }
    };
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('certModal');
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            modal.classList.add('invisible', 'opacity-0');
            modal.classList.remove('visible', 'opacity-100');
            document.body.classList.remove('overflow-hidden');
        }
    });