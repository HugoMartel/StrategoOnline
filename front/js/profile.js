document.getElementById("deleteAccountButton").addEventListener("click", e => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete your account PERMANENTLY?")) {
        // DELETE REQUEST
        Database.sendDelete(document.getElementById("emailToInsert").innerText, document.getElementById("usernameToInsert").innerText);
    }
});