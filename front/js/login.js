document.getElementById('loginForm').addEventListener('submit', event => {
    //event.preventDefault();
    Database.sendLogin(document.getElementById('email').value, document.getElementById('password').value);
});