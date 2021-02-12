let Logger = (function(){

    function sendLoginXHR(email, password) {
        if (email === undefined || password === undefined)
            return;

        let XHR = new XMLHttpRequest();
        // XHR ERROR HANDLING
        XHR.addEventListener("load", () => {
            //console.log(`Data loaded: ${XHR.status} ${XHR.response}`);
        });
        XHR.addEventListener("error", () => {
            //console.log("An error occurred while sending the request...");
        });
        XHR.addEventListener("abort", () => {
            //console.log("The transfer has been canceled by the user.");
        });
        

        XHR.open('POST', '/');
        XHR.setRequestHeader("Content-type", "application/json");
        XHR.responseType = 'json';
        XHR.send(JSON.stringify({email: email, password: password}));
    }

    function sendRegisterXHR(email, password, password2, username) {
        //TODO display an error
        if (password != password2 || email === undefined || password === undefined || username === undefined)
            return;

        let XHR = new XMLHttpRequest();
        // XHR ERROR HANDLING
        XHR.addEventListener("load", () => {
            //console.log(`Data loaded: ${XHR.status} ${XHR.response}`);
        });
        XHR.addEventListener("error", () => {
            //console.log("An error occurred while sending the request...");
        });
        XHR.addEventListener("abort", () => {
            //console.log("The transfer has been canceled by the user.");
        });
        

        XHR.open('POST', '/');
        XHR.setRequestHeader("Content-type", "application/json");
        XHR.responseType = 'json';
        XHR.send(JSON.stringify({email: email, password: password, username: username, password2: password2}));
    }

    return {
        sendLogin(email, password) {
            sendLoginXHR(email, password);
        },
        sendRegister(email, password, password2, username) {
            sendRegisterXHR(email, password, password2, username);
        }
    }
})();