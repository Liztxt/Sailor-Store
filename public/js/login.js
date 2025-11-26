document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    const SIM_USER_EMAIL = "usuario@ejemplo.com";
    const SIM_USER_PASS = "12345";
    const SIM_USER_NAME = "SailorFan";
    const MIN_PASS_LENGTH = 5; 

    /**
     * @param {string} email
     * @returns {boolean}
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * @param {string} email
     * @param {string} password
     * @returns {string|null} 
     */
    function validateForm(email, password) {
        if (!email.trim() || !password.trim()) {
            return "Todos los campos son obligatorios.";
        }

        if (!isValidEmail(email)) {
            return "Por favor, introduce un formato de correo electrónico válido.";
        }

        if (password.length < MIN_PASS_LENGTH) {
            return `La contraseña debe tener al menos ${MIN_PASS_LENGTH} caracteres.`;
        }

        return null; 
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        errorMessage.textContent = ""; 

        const validationError = validateForm(email, password);

        if (validationError) {
            errorMessage.textContent = validationError;
            errorMessage.classList.remove('hidden'); 
            
        } else if (email === SIM_USER_EMAIL && password === SIM_USER_PASS) {
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userName", SIM_USER_NAME);

            window.location.href = "index.html";

        } else {
            errorMessage.textContent = "Usuario o contraseña incorrectos.";
            errorMessage.classList.remove('hidden');
        }
    });
});
