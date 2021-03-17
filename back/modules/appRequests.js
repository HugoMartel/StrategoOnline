/**
 * @file Process the POST and GET requests from the express app in index.js
 * @version 1.0
 * @author Stratego Online
 */

//Requires
const fs = require("fs");
const { body, validationResult, query } = require("express-validator");
const sha256 = require("js-sha256").sha256;
const db = require("./query").database;
const toast = require("./toasts");
const Storage = require("./storage");
const Scores = require("./leaderboard");
const TableDraw = require("./tableDraw");

/**
 * Process the POST and GET requests from the express app in index.js
 * @type {Object}
 * @return {Object} functions to use with the AppRequest module
 * @name AppRequest
 * @namespace AppRequest
 */
let AppRequest = (function () {
  /**
   * @function AppRequest.sendHome
   * @param {Object} request
   * user's request
   * @param {Object} response
   * server's response
   * @returns {} /
   * @description GET request handler for the site's main page
   */
  let sendHomeCall = (req, res) => {
    let fileSend = fs.readFileSync("front/html/head.html");
    // Check if the player is connected to change the navbar or not
    if (!req.session.username)
      fileSend += fs.readFileSync("front/html/login.html");
    else {
      fileSend += fs.readFileSync("front/html/logged.html");
      fileSend +=
        '<script>document.getElementById("connectButton").innerText = "' +
        req.session.username +
        '";document.getElementById("connectModalLabel").innerText="' +
        req.session.username +
        '";</script>';
    }
    fileSend += fs.readFileSync("front/html/index.html");
    fileSend += fs.readFileSync("front/html/footer.html");
    res.send(fileSend);
  };

  //===============================================================================
  /**
   * @function AppRequest.sendScores
   * @param {Object} request
   * @param {Object} response
   * @returns {} /
   * @description GET request handler for the site's leaderboard page
   */
  let sendScoresCall = (req, res) => {
    let fileSend = fs.readFileSync("front/html/head.html");
    // Check if the player is connected to change the navbar or not
    //console.log(req.session.username); // DEBUG
    if (!req.session.username)
      fileSend += fs.readFileSync("front/html/login.html");
    else {
      fileSend += fs.readFileSync("front/html/logged.html");
      fileSend +=
        '<script>document.getElementById("connectButton").innerText = "' +
        req.session.username +
        '";document.getElementById("connectModalLabel").innerText="' +
        req.session.username +
        '";</script>';
    }
    fileSend += `<script>document.getElementById("homeLink").classList.remove("active");document.getElementById("leaderboardLink").classList.add("active");</script>`;
    fileSend += fs.readFileSync("front/html/leaderboard.html");
    let data = Storage.getData("leaderboard");
    fileSend += TableDraw.draw(20, data.leaderboard, Scores.getRankLine);
    fileSend += "</table></div>";
    fileSend += '<script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" type="text/javascript"></script>'
    fileSend += '<script> const table = new simpleDatatables.DataTable("table") </script>'
    fileSend += fs.readFileSync("front/html/footer.html");
    res.send(fileSend);
  };

  //===============================================================================
  /**
   * @function AppRequest.sendProfile
   * @param {Object} request
   * @param {Object} response
   * @returns {} /
   * @description GET request handler for an user's profile page
   */
  let sendProfileCall = (req, res) => {
    let fileSend = fs.readFileSync("front/html/head.html");
    if (!req.session.username) {
      //Redirect to the home page + error message
      //Error message
      //TODO FIX message not displayed => add an arg to the session ? like an error code ?
      //fileSend += toast.error("Please login before accessing your profile...");
      res.redirect("/");
    } else {
      //Load the profile
      fileSend += fs.readFileSync("front/html/logged.html");
      fileSend +=
        '<script>document.getElementById("connectButton").innerText = "' +
        req.session.username +
        '";document.getElementById("connectModalLabel").innerText="' +
        req.session.username +
        '";</script>';
      fileSend += `<script>document.getElementById("homeLink").classList.remove("active");</script>`;

      fileSend += fs.readFileSync("front/html/profile.html");
      //Fill the table with session values
      fileSend += `<script>document.getElementById("usernameToInsert").innerText = "${req.session.username}";`;
      fileSend += `document.getElementById("emailToInsert").innerText = "${req.session.login}";</script>`;

      fileSend += fs.readFileSync("front/html/footer.html");
      res.send(fileSend);
    }
  };

  //===============================================================================
  /**
   * @function AppRequest.sendRules
   * @param {Object} request
   * @param {Object} response
   * @returns {} /
   * @description GET request handler for the site's rules page
   */
  let sendRulesCall = (req, res) => {
    let fileSend = fs.readFileSync("front/html/head.html");
    // Check if the player is connected to change the navbar or not
    //console.log(req.session.username); //DEBUG
    if (!req.session.username)
      fileSend += fs.readFileSync("front/html/login.html");
    else {
      fileSend += fs.readFileSync("front/html/logged.html");
      fileSend +=
        '<script>document.getElementById("connectButton").innerText = "' +
        req.session.username +
        '";document.getElementById("connectModalLabel").innerText="' +
        req.session.username +
        '";</script>';
    }
    fileSend += `<script>document.getElementById("homeLink").classList.remove("active");document.getElementById("rulesLink").classList.add("active");</script>`;
    fileSend += fs.readFileSync("front/html/rules.html");
    fileSend += fs.readFileSync("front/html/footer.html");
    res.send(fileSend);
  };

  //===============================================================================
  /**
   * @function AppRequest.connectAccount
   * @param {Object} request
   * @param {Object} response
   * @returns {} /
   * @description POST request handler for an user connection to his account
   */
  let connectAccountCall = (req, res) => {
    const errors = validationResult(req);

    if (
      !errors.isEmpty() ||
      req.body.email === undefined ||
      req.body.password === undefined
    ) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    } else {
      let emailChecked = escape(req.body.email.trim());
      let passwordChecked = req.body.password;

      // Check if the credentials are correct
      if (
        emailChecked.length > 3 &&
        /[@]/.test(emailChecked) &&
        passwordChecked.length > 8 &&
        /\d/.test(passwordChecked) &&
        /[A-Z]/.test(passwordChecked) &&
        /[a-z]/.test(passwordChecked)
      ) {
        // Check if the user exists and output his username
        db.login(emailChecked, sha256(passwordChecked), (result) => {
          if (result !== undefined) {
            //Connection successful
            req.session.username = result.username;
            req.session.login = result.login;
          } else {
            //Connection unsuccessful
            //TODO Display an error message to the user
            console.log("User not found in the db...");
          }

          req.session.save();
          res.redirect(req.get("referer")); //Redirects to the current page
        });
      } else {
        //TODO Display an error message to the user
        console.log("Wrong logins credentials...");
        res.redirect(req.get("referer")); //Redirects to the current page
      }
    }
  };

  //===============================================================================
  /**
   * @function AppRequest.registerAccount
   * @param {Object} request
   * @param {Object} response
   * @returns {} /
   * @description POST request handler for an user registration to the site
   */
  let registerAccountCall = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    } else {
      //Get XMLHttpRequests values
      let emailChecked = escape(req.body.email.trim());
      let passwordChecked = req.body.password;
      let password2Checked = req.body.password2;
      let usernameChecked = escape(req.body.username.trim());

      console.log(
        emailChecked,
        passwordChecked,
        password2Checked,
        usernameChecked
      );

      // Check if the credentials are correct
      if (
        usernameChecked.length > 3 &&
        emailChecked.length > 3 &&
        /[@]/.test(emailChecked) &&
        passwordChecked === password2Checked &&
        passwordChecked.length > 8 &&
        /\d/.test(passwordChecked) &&
        /[A-Z]/.test(passwordChecked) &&
        /[a-z]/.test(passwordChecked)
      ) {
        db.find(emailChecked, (username) => {
          if (username === undefined) {
            //Connection successful and the user doesn't already exist
            db.register(
              emailChecked,
              sha256(passwordChecked),
              usernameChecked,
              (affectedRows) => {
                if (affectedRows === 1) {
                  //User addition successful -> fill the session values
                  req.session.username = usernameChecked;
                  req.session.login = emailChecked;
                } else {
                  //User addition unsuccessful
                  console.log("Error while adding an user to the DB...");
                }

                req.session.save();
                res.redirect("/");
              }
            );
          } else {
            //User can't be registered because his email is already in use
            //TODO Display an error message to the user
            console.log("Email already in use...");
            res.redirect("/register/");
          }
        });
      } else {
        //TODO Display an error message to the user
        console.log("Wrong logins credentials...");
        res.redirect("/register/");
      }
    }
  };

  //===============================================================================
  /**
   * @function AppRequest.deleteAccount
   * @param {Object} request
   * @param {Object} response
   * @returns {} /
   * @description POST request handler for an user's account deletion
   */
  let deleteAccountCall = (req, res) => {
    const errors = validationResult(req);

    if (
      !errors.isEmpty() ||
      req.body.login === undefined ||
      req.body.username === undefined
    ) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    } else {
      //Get XMLHttpRequests values
      if (
        escape(req.body.login.trim()) == req.session.login &&
        escape(req.body.username.trim()) == req.session.username
      ) {
        //If the XHR values are correct => preform the query
        db.delete(req.session.login, req.session.username, (affectedRows) => {
          if (affectedRows === 1) {
            //TODO Display a deletion successful message
            console.log("Accout successfully deleted!");
            //errorCode stays at 0
            res.send({ redirect: "/" });
          } else {
            //User addition unsuccessful
            //TODO Display an error message to the user
            console.error("Error while deleting an user to the DB...");
            res.send({ error: "Database error..." });
          }

          req.session.destroy();
        });
      } else {
        //TODO Display an error message to the user
        console.error("Error while sending the request to the server...");

        req.session.destroy();
        res.send({ error: "Your request couldn't be sent" });
      }
    }
  };

  //Object to return
  return {
    sendHome: (req, res) => sendHomeCall(req, res),
    connectAccount: (req, res) => connectAccountCall(req, res),
    registerAccount: (req, res) => registerAccountCall(req, res),
    deleteAccount: (req, res) => deleteAccountCall(req, res),
    sendScores: (req, res) => sendScoresCall(req, res),
    sendProfile: (req, res) => sendProfileCall(req, res),
    sendRules: (req, res) => sendRulesCall(req, res),
  };
})();

module.exports = AppRequest;
