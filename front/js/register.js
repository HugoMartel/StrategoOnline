document.getElementById('registerForm').addEventListener('submit', event => {
    //event.preventDefault();
    Logger.sendRegister(document.getElementById('email').value, document.getElementById('password').value, document.getElementById('password2').value, document.getElementById('username').value);
});