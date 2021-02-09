// Setup requires and https keys & certificates
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const appRequest = require("./back/modules/appRequests");

// Just for the readability of the console logs on the server side
const colors = require("colors");

const hsKey = fs.readFileSync("key.pem").toString();
const hsCert = fs.readFileSync("cert.pem").toString();

// Setup server and socket
const server = https.createServer({ key: hsKey, cert: hsCert }, app);
const io = require("socket.io")(server, {});
const port = 4200;


// Session setup
const session = require("express-session")({
  //! DON'T FORGET TO CHANGE THE SECRET -> sha256(secretSECRET)
  secret: "ed4d86e9808c052ce883c8ef98da9786eb8b608a798cffb2814cdf21a20026b8",
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
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

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


/*--------------------*\
|-    REQUESTS        -|
\*--------------------*/
// GET
app.get("/", appRequest.sendHome);
app.get("/register/", (req, res) => {
  let fileSend = fs.readFileSync("front/html/head.html");
  fileSend += fs.readFileSync("front/html/register.html")
  res.send(fileSend);
});
app.get("/disconnect/", (req, res) => {
  // Destroy the session and reload
  req.session.destroy();
  res.redirect("/");
});
// POST
app.post("/", jsonParser, appRequest.connectAccount);
app.post("/register/", jsonParser, appRequest.registerAccount);

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
