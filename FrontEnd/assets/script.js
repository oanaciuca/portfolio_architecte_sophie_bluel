document.addEventListener('DOMContentLoaded', () => {
    console.log("Page principale chargée");

    const showWorks = async (categoryId = null) => {
        console.log("Affichage des travaux");
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) throw new Error('Erreur lors de la récupération des travaux.');
            const works = await response.json();
            const gallery = document.querySelector('.gallery');
            if (!gallery) throw new Error('Élément .gallery manquant.');
            gallery.innerHTML = '';
            const filteredWorks = categoryId ? works.filter(work => work.categoryId === parseInt(categoryId)) : works;
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
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const showCategories = async () => {
        console.log("Affichage des catégories");
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (!response.ok) throw new Error('Erreur lors de la récupération des catégories.');
            const categories = await response.json();
            const filtres = document.querySelector('.filtres');
            if (!filtres) throw new Error('Élément .filtres manquant.');
            const btnAll = document.createElement('button');
            btnAll.innerText = "Tous";
            btnAll.classList.add('all');
            filtres.appendChild(btnAll);
            categories.forEach(category => {
                const btnFiltre = document.createElement('button');
                btnFiltre.innerText = category.name;
                btnFiltre.classList.add('btn-filtre');
                btnFiltre.setAttribute('data-id', category.id);
                filtres.appendChild(btnFiltre);
            });
            btnAll.addEventListener('click', () => {
                showWorks();
            });
            const btnFiltre = document.querySelectorAll('.btn-filtre[data-id]');
            btnFiltre.forEach(button => {
                button.addEventListener('click', () => {
                    const categoryId = button.getAttribute('data-id');
                    showWorks(categoryId);
                });
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Appel initial pour afficher tous les travaux et les catégories
    showWorks();
    showCategories();
});
