document.addEventListener('DOMContentLoaded', () => {
    // Référence aux éléments
    const modalGallery = document.getElementById("modal-gallery");
    const modalForm = document.getElementById("modal-form");
    const openModalBtn = document.getElementById("open-modal");
    const closeModalBtns = document.querySelectorAll(".modal .close");
    const addPhotoBtn = document.getElementById("add-photo");
    const backToGalleryBtn = document.getElementById("back-to-gallery");
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    // Fonction pour afficher la galerie dans la modale
    const loadGallery = async () => {
        const gallery = document.getElementById("gallery-container");
        gallery.innerHTML = ''; // Vider la galerie avant de charger les nouvelles photos

        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) throw new Error('Erreur lors de la récupération des photos.');
            const works = await response.json();

            works.forEach(work => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const deleteIcon = document.createElement('i');

                img.src = work.imageUrl;
                img.alt = work.title;
                deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'delete-icon');

                // Gestion de la suppression de la photo
                deleteIcon.addEventListener('click', async () => {
                    const deleteResponse = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!deleteResponse.ok) throw new Error('Erreur lors de la suppression de la photo.');
                    figure.remove(); // Supprimer l'élément
                });

                figure.appendChild(img);
                figure.appendChild(deleteIcon);
                gallery.appendChild(figure);
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Fonction pour ouvrir la modale
    const openModal = (modal) => {
        modal.style.display = "block";
        document.body.style.overflow = 'hidden'; // Désactiver le défilement de la page
    };

    // Fonction pour fermer la modale
    const closeModal = (modal) => {
        modal.style.display = "none";
        document.body.style.overflow = ''; // Réactiver le défilement de la page
    };

    // Ajouter le bouton "Modifier" si l'utilisateur est connecté
    const createEditButton = () => {
        const portfolioHeader = document.querySelector('.portfolio-header');
        if (portfolioHeader && !document.getElementById('open-modal')) {
            const editButton = document.createElement('button');
            editButton.setAttribute('id', 'open-modal');
            editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';
            portfolioHeader.appendChild(editButton);
            editButton.addEventListener('click', () => {
                openModal(modalGallery);
                loadGallery(); // Charger les photos lors de l'ouverture de la modale
            });
        }
    };

    // Fonction pour gérer la soumission du formulaire
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const form = document.getElementById('ajout-photo-form');
        const formData = new FormData(form);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Erreur lors de l\'ajout de la photo: ' + (errorData.error ? JSON.stringify(errorData.error) : 'Message d\'erreur non défini'));
            }

            const newWork = await response.json();
            console.log('Photo ajoutée avec succès:', newWork);

            // Ajouter dynamiquement la nouvelle photo à la galerie
            const gallery = document.getElementById('gallery-container');
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = newWork.imageUrl;
            img.alt = newWork.title;
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'delete-icon');

            // Gestion de la suppression de la photo
            deleteIcon.addEventListener('click', async () => {
                const deleteResponse = await fetch(`http://localhost:5678/api/works/${newWork.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!deleteResponse.ok) throw new Error('Erreur lors de la suppression de la photo.');
                figure.remove();
            });

            figure.appendChild(img);
            figure.appendChild(deleteIcon);
            gallery.appendChild(figure);

            // Réinitialiser le formulaire
            form.reset();
            closeModal(modalForm);
            openModal(modalGallery);

        } catch (error) {
            console.error(error);
            document.getElementById('error-message').textContent = error.message;
        }
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprimer le token du stockage local
        updateUI(); // Mettre à jour les boutons et l'UI
        window.location.href = 'index.html'; // Rediriger vers la page d'accueil
    };

    // Événements de clic pour ouvrir et fermer les modales
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(modalGallery);
            closeModal(modalForm);
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalGallery || event.target === modalForm) {
            closeModal(modalGallery);
            closeModal(modalForm);
        }
    });

    addPhotoBtn.addEventListener('click', () => {
        closeModal(modalGallery);
        openModal(modalForm);
    });

    backToGalleryBtn.addEventListener('click', () => {
        closeModal(modalForm);
        openModal(modalGallery);
    });

    logoutButton.addEventListener('click', handleLogout);

    // Vérifier la connexion et ajouter le bouton "Modifier" si connecté
    const updateUI = () => {
        const token = localStorage.getItem('token');

        if (loginButton && logoutButton) {
            if (token) {
                loginButton.classList.add('hidden');
                logoutButton.classList.remove('hidden');
                createEditButton(); // Créer le bouton "Modifier"
            } else {
                loginButton.classList.remove('hidden');
                logoutButton.classList.add('hidden');
                const editButton = document.getElementById('open-modal');
                if (editButton) {
                    editButton.remove();
                }
            }
        }
    };

    updateUI(); // Initialiser l'UI au chargement de la page

    // Ajouter un écouteur d'événement sur le formulaire
    document.getElementById('ajout-photo-form').addEventListener('submit', handleFormSubmit);
});
