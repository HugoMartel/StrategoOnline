/**
 * @file Login event listener setup
 * @author Stratego Online
 * @version 1.0
 */
document.getElementById('loginForm').addEventListener('submit', event => {
    //event.preventDefault();
    Request.sendLogin(document.getElementById('email').value, document.getElementById('password').value);
});