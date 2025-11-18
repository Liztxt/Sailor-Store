document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  const emailValido = "usuario@ejemplo.com";
  const passValido = "12345";

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email === emailValido && password === passValido) {
      sessionStorage.setItem("isLoggedIn", "true");

      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Usuario o contraseña incorrectos";
    }
  });
});
