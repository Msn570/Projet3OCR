const Form = document.getElementById('LOGIN');
const Mail = document.getElementById('email');
const Pass = document.getElementById('password');
const Url = 'http://localhost:5678/api/users/login';

Form.addEventListener('submit', async (event) => {

    event.preventDefault();
    //verifie que toutes les cases soit remplies//
    if (Mail.value === '' && Pass.value === '') {
        alert('Cases Non Remplies');
    }
    //verifie si l'user est connecté//
    if (localStorage.getItem('token') !== null) {
        alert('Déjà connecté');
    }

    try {
        const r = await fetch(Url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: Mail.value,
                password: Pass.value,
            })
        });
        
        //si réponse de l'api autre que 200 = erreur//
        if (r.status !== 200) {
            const err = await response.json();
            throw new Error(`Error: ${err.message}`);
        }

        const result = await r.json();
        const token = result.token;
        localStorage.setItem('token', token);

        alert('Connexion réussie');

        window.location = 'index.html';

    } catch (error) {
        errMsg();
    }

});


const errMsg = () => {
    const error = document.querySelector("#errMsg");
    error.innerHTML = 'Erreur dans l’identifiant ou le mot de passe';
}