/**
 * @file Adds an event listener to be able to send the registration form elements to the database
 * @version 1.0
 * @author Stratego Online
 */
document.getElementById('registerForm').addEventListener('submit', event => {
    //event.preventDefault();
    Database.sendRegister(document.getElementById('email').value, document.getElementById('password').value, document.getElementById('password2').value, document.getElementById('username').value);
});