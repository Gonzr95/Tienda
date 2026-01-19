document.getElementById('quick-access-btn').addEventListener('click', () => {

    document.getElementById('input-mail').value = 'gonz.r@hotmail.com';
    document.getElementById('input-pass').value = 'Inicio1234.';

});

const btnIngresar = document.getElementById('btn-ingresar');
btnIngresar.addEventListener("click", async() => {
  const mail = inputMail.value;
  const pass = inputClave.value;
  const mensaje = document.getElementById("p-mensaje");
  if (mail.length === 0 || pass.length === 0) {
    mensaje.innerText = "Por favor, ingrese todos los datos...";
  } else {
    mensaje.innerText = "";

    try {
      const response = await fetch(`${apiUrl}/administrator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail, pass })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.redirectTo;
      } else {
        const errorData = await response.json();
        mensaje.innerText = errorData.error || 'Email o contraseña incorrectos';
      }

    } catch (error) {
      // Error de red o algo falló en la conexión
      console.error('Error de red:', error);
      mensaje.innerText = 'No se pudo conectar al servidor. Inténtalo de nuevo.';
    }
  }
});

