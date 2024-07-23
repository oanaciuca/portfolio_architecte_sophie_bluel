document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("modal");
    const openModalBtn = document.getElementById("open-modal");
    const closeModalBtn = document.querySelector(".modal .close");
    const modalGallery = document.querySelector(".modal-gallery");

    // Ouvrir la modale et charger les photos
    openModalBtn.addEventListener('click', async () => {
        modal.style.display = "block";
        modalGallery.style.display = "block";
        
        const gallery = document.querySelector(".modal-gallery .gallery");
        gallery.innerHTML = ''; // Vider la galerie avant de charger les nouvelles photos

        const response = await fetch('http://localhost:5678/api/works');
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
                await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                figure.remove(); // Supprimer l'élément
            });

            figure.appendChild(img);
            figure.appendChild(deleteIcon);
            gallery.appendChild(figure);
        });
    });

    // Fermer la modale
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Fermer la modale en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
