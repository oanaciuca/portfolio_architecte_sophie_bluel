document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer les travaux depuis l'API
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();

    // Sélectionner la galerie
    const gallery = document.querySelector('.gallery');

    // Ajouter les travaux dynamiquement
    works.forEach(work => {
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
});
