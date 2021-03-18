/**
 * @file Adds an event listener to be able to send the registration form elements to the database
 * @version 1.0
 * @author Stratego Online
 */
document.getElementById('registerForm').addEventListener('submit', event => {
    event.preventDefault();
    ClientRequest.sendRegister(document.getElementById('userEmail').value, document.getElementById('userPassword').value, document.getElementById('userPassword2').value, document.getElementById('username').value);
});