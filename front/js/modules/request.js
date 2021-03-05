/**
 * @file Send XMLHTTPRequests to the server to get results from the database
 * @version 1.0
 * @author Stratego Online
 */

/**
 * POST and GET requests sent by users
 * @type {Object}
 * @return {Object} functions to use with the Request module
 * @name Request
 * @namespace Request
 */
let Request = (function () {
  /**
   * @function Request.sendLogin
   * @param {string} email
   * user's email used to login
   * @param {string} password
   * user's password used to login
   * @returns {} /
   * @description Login XMLHTTPRequest to send to the express app, the XHR content is sent as a POST request
   */
  function sendLoginXHR(email, password) {
    //TODO display an error
    if (email === undefined || password === undefined) return;

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

    XHR.open("POST", "/");
    XHR.setRequestHeader("Content-Type", "application/json");
    XHR.responseType = "json";
    XHR.send(JSON.stringify({ email: email, password: password }));
  }

  //======================================================================================
  /**
   * @function Request.sendRegister
   * @param {string} email
   * user's email to set
   * @param {string} password
   * user's password to set
   * @param {string} password2
   * test to verify the user hasn't made a mistake while writing his password
   * @param {string} username
   * user's username to display in game and in his profile
   * @returns {} /
   * @description Register XMLHTTPRequest to send to the express app, the XHR content is sent as a POST request
   */
  function sendRegisterXHR(email, password, password2, username) {
    //TODO display an error
    if (
      password != password2 ||
      email === undefined ||
      password === undefined ||
      username === undefined
    )
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

    XHR.open("POST", "/");
    XHR.setRequestHeader("Content-Type", "application/json");
    XHR.responseType = "json";
    XHR.send(
      JSON.stringify({
        email: email,
        password: password,
        username: username,
        password2: password2,
      })
    );
  }

  //======================================================================================
  /**
   * @function Request.sendDelete
   * @param {string} email
   * user's email to find the user to delete in the database
   * @param {string} username
   * using the email would be fine since it is supposed to be unique but adding the username is a security
   * @returns {} /
   * @description Delete XMLHTTPRequest to send to the express app, the XHR content is sent as a POST request
   */
  function sendDeleteXHR(email, username) {
    //The email would be enough to delete an account since it is unique but we also use the username just to be sure
    //TODO display an error
    if (email === undefined || username === undefined) return;

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

    XHR.onreadystatechange = () => {
      if (XHR.readyState === 4 && XHR.status === 200) {
        if (typeof(XHR.response.redirect) == 'string') {
          window.location = XHR.response.redirect;
        }
      }
    };

    XHR.open("POST", "/profile/");
    XHR.setRequestHeader("Content-Type", "application/json");
    XHR.responseType = "json";
    XHR.send(JSON.stringify({ login: email, username: username }));
  }

  //return Object
  return {
    sendLogin(email, password) {
      sendLoginXHR(email, password);
    },
    sendRegister(email, password, password2, username) {
      sendRegisterXHR(email, password, password2, username);
    },
    sendDelete(email, username) {
      sendDeleteXHR(email, username);
    },
  };
})();
