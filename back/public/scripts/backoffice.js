const btnQuickAccess = document.getElementById('quick-access-btn');
const userInput = document.getElementById('mail-input');
const passwordInput = document.getElementById('password-input');
const btnLogin = document.getElementById('login-btn');
const backendURL = "http://localhost:3000/api/";

btnQuickAccess.addEventListener('click', () => {
   
    userInput.value = 'gonz.r@hotmail.com';
    passwordInput.value = 'Inicio1.';

});

// --- LÓGICA DE LOGIN ---
/*
async function handleLogin() {
    const userInput = document.getElementById('mail-input').value;
    const pass = document.getElementById('password-input').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`${backendURL}administrator/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: userInput, pass })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si hay error (400, 401, etc), lo mostramos
            errorDiv.innerText = data.message || "Error al iniciar sesión";
            return;
        }

        // --- ÉXITO ---
        // 1. Guardamos el token en el "disco duro" del navegador
        console.log("cambiar estoy al otro metodo de guardado que es mas seguro");
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('firstName', data.admin.firstName);
        localStorage.setItem('lastName', data.admin.lastName);
        localStorage.setItem('mail', data.admin.mail);
        
        // 2. Redirigimos a la página protegida esto es lo que tenemos qe ajustar
        //window.location.href = 'home';

    } catch (error) {
        console.error(error);
        errorDiv.innerText = "Error de conexión con el servidor";
    }
}


btnLogin.addEventListener('click', () => {
    handleLogin();

});

*/