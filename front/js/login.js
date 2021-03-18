/**
 * @file Login event listener setup
 * @author Stratego Online
 * @version 1.0
 */
document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault();
    ClientRequest.sendLogin(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
}); 