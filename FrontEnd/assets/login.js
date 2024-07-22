document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:5678/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Sauvegarder le token et rediriger l'utilisateur
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html'; // Redirection vers la page d'accueil
        } else {
            alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
        }
    });
});
