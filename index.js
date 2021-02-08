// Setup requires and https keys & certificates
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");

// Just for the readability of the console logs on the server side
const colors = require("colors");

const hsKey = fs.readFileSync("key.pem").toString();
const hsCert = fs.readFileSync("cert.pem").toString();

const server = https.createServer({ key: hsKey, cert: hsCert }, app);
const io = require("socket.io")(server, {});
const port = 4200;

// Session setup
const session = require("express-session")({
  //! DON'T FORGET TO CHANGE THE SECRET
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    secure: true,
  },
});

// App params
app.set("trust proxy", 1);

// Request handleling requires
const sharedsession = require("express-socket.io-session");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const sha256 = require("js-sha256").sha256;

// Configure socket io with session middleware
io.use(
  sharedsession(session, {
    // Save session if it is changed
    autoSave: true,
  })
);

// Router
app.use(express.static(__dirname + "/front/"));
app.use(jsonParser);
app.use(urlencodedParser);
app.use(session);

//Requests callbacks
let sendHome = (req, res) => {
  let fileSend = fs.readFileSync("front/html/head.html");
  // Check if the player is connected to change the navbar or not
  //console.log(req.session);
  if (!req.session.email)
    fileSend += fs.readFileSync("front/html/login.html");
  else fileSend += fs.readFileSync("front/html/logged.html");
  fileSend += fs.readFileSync("front/html/index.html");
  fileSend += fs.readFileSync("front/html/footer.html");
  res.send(fileSend);
};

let connectAccount = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  } else {

    let emailChecked = escape(req.body.email.trim());
    let passwordChecked = req.body.password;
    //console.log(emailChecked.length, passwordChecked.length);

    // Check if the credentials are correct
    if (emailChecked.length > 3 && /[@]/.test(emailChecked) && passwordChecked.length > 8 && /\d/.test(passwordChecked) && /[A-Z]/.test(passwordChecked) && /[a-z]/.test(passwordChecked)) {
      req.session.email = emailChecked;
      req.session.password = sha256(passwordChecked);
      console.log(req.session.email, req.session.password);

      //TODO CHECK THE CREDENTIALS VALIDITY and get the linked account and username to display

      req.session.save();
      res.redirect(req.get("referer"));
    } else {
      //TODO Display an error message to the user
      console.log("Wrong logins credentials...");
      res.redirect(req.get("referer"));
    }
  }
}

/*--------------------*\
|-    REQUESTS        -|
\*--------------------*/
// GET
app.get("/", sendHome);
app.get("/register/", (req, res) => {
  //TODO
  req.session.save();
  res.redirect("/");
});
app.get("/disconnect/", (req, res) => {
  // Destroy the session and reload
  req.session.destroy();
  res.redirect("/");
});
// POST
app.post("/", jsonParser, connectAccount);

// Setup logs for the server
io.on("connection", (socket) => {

  console.log("> ".bold + socket.id.green + " connected");

  socket.on("disconnect", () => {
    console.log("< ".bold + socket.id.red + " disconnected");
  });
});

// Make the server use port 4200
server.listen(4200, () => {
  console.log("Server is up and running on https://localhost:" + port + "/");
});
