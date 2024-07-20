document.addEventListener('DOMContentLoaded', () => {
    const showWorks = async (categoryId = null) => {
        // Récupérer les travaux depuis l'API
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();

        // Sélectionner la galerie
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux travaux

        // Filtrer les travaux par catégorie si categoryId est fourni
        const filteredWorks = categoryId ? works.filter(work => work.categoryId === parseInt(categoryId)) : works;

        // Ajouter les travaux dynamiquement
        filteredWorks.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            img.src = work.imageUrl;
            img.alt = work.title;
            figcaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    };

    const showCategories = async () => {
        // Récupérer les catégories depuis l'API
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        // Sélectionner l'élément filtres
        const filtres = document.querySelector('.filtres');

        // Créer et ajouter le bouton "Tous"
        const btnAll = document.createElement('button');
        btnAll.innerText = "Tous";
        btnAll.classList.add('all');
        filtres.appendChild(btnAll);

        // Créer et ajouter les boutons de catégorie
        categories.forEach(category => {
            const btnFiltre = document.createElement('button');
            btnFiltre.innerText = category.name;
            btnFiltre.classList.add('btn-filtre');
            btnFiltre.setAttribute('data-id', category.id);
            filtres.appendChild(btnFiltre);
        });

        // Ajouter l'événement de clic pour le bouton "Tous"
        btnAll.addEventListener('click', () => {
            showWorks();
        });

        // Ajouter les événements de clic pour les boutons de catégories
        const btnFiltre = document.querySelectorAll('.btn-filtre[data-id]');
        btnFiltre.forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.getAttribute('data-id');
                showWorks(categoryId);
            });
        });
    };

    // Appel initial pour afficher tous les travaux et les catégories
    showWorks();
    showCategories();
});
