/**
 * @file Adds an event listener to enable account deletion on button click
 * @version 1.0
 * @author Stratego Online
 */
document.getElementById("deleteAccountButton").addEventListener("click", e => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete your account PERMANENTLY?")) {
        // DELETE REQUEST
        Request.sendDelete(document.getElementById("emailToInsert").innerText, document.getElementById("usernameToInsert").innerText);
    }
});