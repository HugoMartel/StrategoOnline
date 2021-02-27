document.getElementById('registerForm').addEventListener('submit', event => {
    //event.preventDefault();
    Database.sendRegister(document.getElementById('email').value, document.getElementById('password').value, document.getElementById('password2').value, document.getElementById('username').value);
});