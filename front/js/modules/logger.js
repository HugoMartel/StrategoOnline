let Logger = (function(){

    function sendCrentialsXHR(email, password) {
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

    return {
        sendCredentials(email, password) {
            sendCrentialsXHR(email, password);
        }
    }
})();