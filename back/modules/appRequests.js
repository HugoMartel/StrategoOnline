//Requires
const fs = require("fs");
const { body, validationResult, query } = require("express-validator");
const sha256 = require("js-sha256").sha256;
const db = require("./query").database;

let AppRequest = (function () {
  let sendHomeCall = (req, res) => {
    let fileSend = fs.readFileSync("front/html/head.html");
    // Check if the player is connected to change the navbar or not
    console.log(req.session.username);
    if (!req.session.username)
      fileSend += fs.readFileSync("front/html/login.html");
    else fileSend += fs.readFileSync("front/html/logged.html");
    fileSend += fs.readFileSync("front/html/index.html");
    fileSend += fs.readFileSync("front/html/footer.html");
    res.send(fileSend);
  };

  let connectAccountCall = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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
        db.login(emailChecked, sha256(passwordChecked), (username) => {
          if (username !== undefined) {
            //Connection successful
            req.session.username = username;
          } else {
            //Connection unsuccessful
            //TODO Display an error message to the user
            console.log("User not found in the db...");
          }

          req.session.save();
          res.redirect(req.get("referer"));
        });
      } else {
        //TODO Display an error message to the user
        console.log("Wrong logins credentials...");
        res.redirect(req.get("referer"));
      }
    }
  };

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

      console.log(emailChecked, passwordChecked, password2Checked, usernameChecked);

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
                  //User addition successful
                  req.session.username = usernameChecked;
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

  return {
    sendHome: (req, res) => sendHomeCall(req, res),
    connectAccount: (req, res) => connectAccountCall(req, res),
    registerAccount: (req, res) => registerAccountCall(req, res),
  };
})();

module.exports = AppRequest;
