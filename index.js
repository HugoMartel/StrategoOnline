/**
 * @file Main page of the project, start the webserver by executing it
 * @author Stratego Online
 * @version 1.0
 */

//****************************
//*         Consts           *
//****************************
// Setup requires and https keys & certificates
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const AppRequest = require("./back/modules/appRequests");
const Stratego = require("./back/classes/stratego");
const Storage = require("./back/modules/storage");

// Just for the readability of the console logs on the server side
const colors = require("colors");

const hsKey = fs.readFileSync(__dirname + "/ssl/key.pem").toString();
const hsCert = fs.readFileSync(__dirname + "/ssl/cert.pem").toString();

// Request handling requires
const sharedsession = require("express-socket.io-session");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Setup server and socket
/** @constant {Object} server https server used to host the project*/
const server = https.createServer({ key: hsKey, cert: hsCert }, app);
/** @constant {Object} io socket module used to identify clients*/
const io = require("socket.io")(server, { secure: true });
/** @constant {number} port port used to host the server on*/
const port = 4200;

//****************************
//*         Session          *
//****************************
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

//****************************
//*      Configuration       *
//****************************
// App params
app.set("trust proxy", 1);

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

//****************************
//*        Requests          *
//****************************
// GET
app.get("/", AppRequest.sendHome);
app.get("/register/", (req, res) => {
  let fileSend = fs.readFileSync("front/html/head.html");
  fileSend += `<script>document.getElementById("homeLink").classList.remove("active");</script>`;
  fileSend += fs.readFileSync("front/html/login.html");
  fileSend += fs.readFileSync("front/html/register.html");
  res.send(fileSend);
});
app.get("/disconnect/", (req, res) => {
  // Destroy the session and reload
  req.session.destroy();
  res.redirect("/");
});
app.get("/scores/", AppRequest.sendScores);
app.get("/profile/", AppRequest.sendProfile);
app.get("/rules/", AppRequest.sendRules);

// POST
app.post("/", jsonParser, AppRequest.connectAccount);
app.post("/register/", jsonParser, AppRequest.registerAccount);
app.post("/profile/", jsonParser, AppRequest.deleteAccount);

//****************************
//*        Socket.io         *
//****************************
let gameWaiting = false;

io.on("connection", (client) => {
  // Console message on connection
  console.log("> ".bold + client.id.green + " connected");

  // Console message on disconnection
  client.on("disconnect", () => {
    console.log("< ".bold + client.id.red + " disconnected");
  });

  //===================================================================
  // An user wants to find a game
  client.on("newGame", () => {
    let clientSocket = io.sockets.sockets.get(client.id); // correct way to access a map object in js
    //console.log(clientSocket.id);//DEBUG

    if (gameWaiting === false) {
      //Store the user in a new game object
      let newGame = new Stratego(
        clientSocket !== undefined ? clientSocket.handshake.session.login : clientSocket.id.toString()
      );

      //Save the game as a JSON file in ./back/storage/games/waiting
      Storage.saveData(
        "games/waiting/" +
          fs
            .readdirSync(__dirname + "/back/storage/games/waiting")
            .length.toString(),
        newGame
      );

      gameWaiting = true;
      console.log("A new game has been created".underline);
    } else {
      //Add the second user to the game object
      let waitingGame = Storage.getData("games/waiting/1");
      waitingGame.addPlayer(
        clientSocket !== undefined ? clientSocket.handshake.session.login : client.id
      );

      //Save the game as a JSON file in ./back/storage/games/waiting
      Storage.saveData(
        "games/" + waitingGame.player1 + "+" + waitingGame.player2,
        waitingGame
      );

      gameWaiting = false;
      console.log("A game is starting".underline);
    }
  });
});

//****************************
//*       Server Start       *
//****************************
// Make the server use port 4200
server.listen(4200, () => {
  console.log("Server is up and running on https://localhost:" + port + "/");
});
