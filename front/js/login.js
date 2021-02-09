document.getElementById('loginForm').addEventListener('submit', event => {
    //event.preventDefault();
    Logger.sendLogin(document.getElementById('email').value, document.getElementById('password').value);
});