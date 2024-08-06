document.addEventListener('DOMContentLoaded', () => {
    // Références aux éléments de la modale et du formulaire
    const modalGallery = document.getElementById('modal-gallery'); // Modale de la galerie photo
    const modalForm = document.getElementById('modal-form'); // Modale du formulaire d'ajout de photo
    const addPhotoButton = document.getElementById('add-photo'); // Bouton pour ouvrir la modale du formulaire d'ajout
    const closeModalButtons = document.querySelectorAll('.modal .close'); // Boutons pour fermer les modales
    const ajoutPhotoForm = document.getElementById('ajout-photo-form'); // Formulaire d'ajout de photo
    const errorMessage = document.getElementById('error-message'); // Message d'erreur pour le formulaire
    const galleryContainer = document.getElementById('gallery-container'); // Conteneur de la galerie dans la modale
    const mainGallery = document.querySelector('.gallery'); // Conteneur de la galerie sur la page principale

   // Ajouter le bouton de modification dynamiquement
   const headerContainer = document.getElementById('portfolio-header'); // Conteneur du titre
   const openModalButton = document.createElement('button');
   openModalButton.id = 'edit-button'; // ID du bouton
   openModalButton.className = 'edit-button'; // Classe CSS pour le style
   openModalButton.innerHTML = '<i class="fa-solid fa-pencil"></i> Modifier';
   // Ajouter le bouton au conteneur
   headerContainer.appendChild(openModalButton);

   const token = localStorage.getItem('token'); // Récupérer le token
    console.log('token:', token); // Loguer le token pour vérifier qu'il est bien récupéré
    if (!token) {
    console.error('Token d\'authentification non trouvé');
    return;
    }

    console.log('Token from localStorage:', localStorage.getItem('token'));
   
    // Fonction pour ouvrir une modale
    const openModal = (modal) => {
        modal.classList.add('visible'); // Ajouter la classe pour rendre la modale visible
        modal.setAttribute('aria-hidden', 'false'); // Modifier l'attribut aria pour l'accessibilité
        document.body.style.overflow = 'hidden'; // Empêcher le défilement de la page arrière
    };

    // Fonction pour fermer toutes les modales
    const closeModal = () => {
        document.querySelectorAll('.modal.visible').forEach(modal => {
            modal.classList.remove('visible'); // Retirer la classe pour masquer la modale
            modal.setAttribute('aria-hidden', 'true'); // Modifier l'attribut aria pour l'accessibilité
        });
        document.body.style.overflow = ''; // Réactiver le défilement de la page arrière
    };

    // Gestion des événements pour ouvrir les modales
    openModalButton.addEventListener('click', () => openModal(modalGallery)); // Ouvrir la modale de la galerie
    addPhotoButton.addEventListener('click', () => {
        closeModal(); // Fermer toutes les modales ouvertes
        openModal(modalForm); // Ouvrir la modale du formulaire d'ajout
    });

    // Gestion des événements pour fermer les modales
    closeModalButtons.forEach(button => button.addEventListener('click', closeModal)); // Fermer la modale en cliquant sur le bouton de fermeture

    // Fermer la modale en cliquant à l'extérieur de celle-ci
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(); // Fermer la modale si le clic est en dehors de celle-ci
        }
    });

    // Fonction pour charger la galerie de photos
    const loadGallery = async () => {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            const works = await response.json();
            // Vider les galeries avant de les remplir
            galleryContainer.innerHTML = ''; // Vider la galerie de la modale
            mainGallery.innerHTML = ''; // Vider la galerie principale

            // Ajouter les travaux dans la galerie de la modale et la galerie principale
            works.forEach(work => createGalleryItem(work, galleryContainer, true, false)); // Ajouter les travaux sans titres avec les boutons de suppression dans la modale
            works.forEach(work => createGalleryItem(work, mainGallery, false, true)); // Ajouter les travaux avec titres sans boutons de suppression dans la galerie principale
        } catch (error) {
            console.error('Erreur lors de la récupération des travaux:', error); // Gérer les erreurs de récupération des travaux
        }
    };

    // Fonction pour créer un élément de galerie
    const createGalleryItem = (work, container, includeDelete, includeTitle) => {
        const figure = document.createElement('figure'); // Créer l'élément figure
        const img = document.createElement('img'); // Créer l'élément img

        img.src = work.imageUrl; // Définir la source de l'image
        img.alt = work.title; // Définir le texte alternatif de l'image

        figure.appendChild(img); // Ajouter l'image à la figure

        // Ajouter la légende (titre) si nécessaire
        if (includeTitle) {
            const figcaption = document.createElement('figcaption'); // Créer l'élément figcaption
            figcaption.textContent = work.title; // Définir le texte de la légende
            figure.appendChild(figcaption); // Ajouter la légende à la figure
        }

        // Ajouter le bouton de suppression si nécessaire
        if (includeDelete) {
            const deleteIcon = document.createElement('i'); // Créer l'élément i pour l'icône de suppression
            deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'delete-icon'); // Ajouter les classes pour l'icône
            deleteIcon.addEventListener('click', () => deletePhoto(work.id)); // Ajouter l'événement de suppression
            figure.appendChild(deleteIcon); // Ajouter l'icône de suppression à la figure
        }

        container.appendChild(figure); // Ajouter la figure au conteneur
    };

    // Fonction pour supprimer une photo
    const deletePhoto = (photoId) => {
        const token = localStorage.getItem('token'); // Récupérer le token d'authentification
        if (!token) {
            console.error('Token d\'authentification non trouvé');
            return;
        }

        fetch(`http://localhost:5678/api/works/${photoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (response.ok) {
                loadGallery(); // Recharger la galerie après suppression réussie
            } else {
                throw new Error('Erreur lors de la suppression de la photo');
            }
        })
        .catch(error => console.error('Erreur lors de la suppression de la photo:', error)); // Gérer les erreurs de suppression
    };

    // Fonction pour valider le formulaire
    const validateForm = () => {
        const title = document.getElementById("title").value; // Récupérer le titre
        const category = document.getElementById("category").value; // Récupérer la catégorie
        const fileInput = document.getElementById("image").files; // Récupérer le fichier
        if (!title || !category || fileInput.length === 0) {
            errorMessage.textContent = "Tous les champs doivent être remplis."; // Afficher un message d'erreur si des champs sont vides
            errorMessage.style.display = "block"; // Rendre le message d'erreur visible
            return false; // Formulaire non valide
        }
        errorMessage.style.display = "none"; // Cacher le message d'erreur
        return true; // Formulaire valide
    };

    // Fonction pour soumettre le formulaire
    const submitForm = (event) => {
        event.preventDefault(); // Empêcher le rechargement de la page
        if (!validateForm()) return; // Valider le formulaire

        const authToken = localStorage.getItem('token'); // Récupérer le token d'authentification
        if (!authToken) {
            console.error('Token d\'authentification non trouvé');
            return;
        }

        const formData = new FormData(ajoutPhotoForm); // Créer un objet FormData avec le formulaire
        // Convertir la catégorie en ID
        formData.set('category', { 'objets': 1, 'appartements': 2, 'hotels&restaurants': 3 }[formData.get('category')]);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Récupérer la réponse JSON si la requête est réussie
            } else {
                return response.text().then(text => {
                    throw new Error(`Réponse non JSON: ${text}`);
                });
            }
        })
        .then(data => {
            ajoutPhotoForm.reset(); // Réinitialiser le formulaire après soumission réussie
            console.log('Photo ajoutée avec succès:', data);
            loadGallery(); // Recharger la galerie pour afficher la nouvelle photo
            closeModal(); // Fermer la modale après soumission
        })
        .catch(error => {
            console.error('Erreur lors de la soumission du formulaire:', error);
            errorMessage.textContent = "Erreur lors de l'ajout de la photo. Veuillez réessayer."; // Afficher un message d'erreur
            errorMessage.style.display = "block"; // Rendre le message d'erreur visible
        });
    };

    // Gestionnaire d'événement pour la soumission du formulaire
    ajoutPhotoForm.addEventListener('submit', submitForm);

    // Charger la galerie au démarrage
    loadGallery();
});