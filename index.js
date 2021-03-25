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
const { Game, Stratego } = require("./back/classes/stratego");
const Storage = require("./back/modules/storage");

// Just for the readability of the console logs on the server side
const colors = require("colors");

const hsKey = fs.readFileSync(__dirname + "/ssl/key.pem").toString();
const hsCert = fs.readFileSync(__dirname + "/ssl/cert.pem").toString();

// Request handling requires
const sharedsession = require("express-socket.io-session");
const bodyParser = require("body-parser");
const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: false });

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
  fileSend += fs.readFileSync("front/html/register.html");
  res.send(fileSend);
});
app.get("/disconnect/", (req, res) => {
  // Destroy the session and reload
  req.session.destroy();
  res.redirect("/");
});
app.get("/leaderboard/", AppRequest.sendScores);
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
    // END or DELETE games where the client could be a part of

    console.log("< ".bold + client.id.red + " disconnected");
  });

  client.on("disconnecting", (reason) => {
    // Disconnecting during a game

    // Find the room that the user left
    for (const room of client.rooms) {
      if (room !== client.id) {
        // Let the client know that his opponent disconnected
        client.to(room).emit("user left", reason); // We only send the reason of the disconnect to the other room's client

        //Remove the game from the server (the room name has the same name as the game JSON file)
        for (const c of io.sockets.adapter.rooms.get(room)) {
          // We have found the remaining player so we can find the game
          let gameNames = fs.readdirSync(__dirname + "/back/storage/games");

          for (let name of gameNames) {
            if (
              name.includes(
                io.sockets.sockets.get(c).handshake.session.login !== undefined
                  ? io.sockets.sockets.get(c).handshake.session.login
                  : client.id
              )
            ) {
              //We found the game to remove, we delete it then!
              fs.unlink(__dirname + "/back/storage/games/" + name, (err) => {
                if (err) throw err;
              });

              // Server log
              console.log(client.id.red + " left a pending game...");
              console.log(
                "/back/storage/games/" + name + " deleted".bold
              );
              // Disconnect the remaining player from his room
              io.sockets.sockets.get(c).leave(room);
            }
          }
        }
      }
    }
  });

  //===================================================================
  /******************************\
    An user wants to find a game
  \******************************/
  client.on("newGame", () => {
    let clientSocket = io.sockets.sockets.get(client.id); // correct way to access a map object in js

    /* There are no user waiting for a game */
    if (gameWaiting === false) {
      // TimeStamp to use for identification
      let currentTime = Date.now().toString();

      //Store the user in a new game object
      let newGame = new Game(
        clientSocket.handshake.session.login !== undefined
          ? clientSocket.handshake.session.login
          : clientSocket.id,
        currentTime
      );

      //Make the client join a socket room
      client.join(currentTime);

      // Send things to display to the client
      io.sockets.to(newGame.room_name).emit("match created", {
        username1: newGame.player1,
      });

      //Save the game as a JSON file in ./back/storage/games/waiting
      //idea to name files : fs.readdirSync(__dirname + "/back/storage/games/waiting").length // Counts the amount of files in the directory
      Stratego.saveGame("games/waiting/" + currentTime, newGame);

      gameWaiting = true;
      console.log("A new game has been created".underline);
    } else {
      /* A game is already waiting for a second player */

      //Removes the .json and converts to int to ease comparison
      let waitingGamesNames = fs
        .readdirSync(__dirname + "/back/storage/games/waiting")
        .map((value, index, array) =>
          parseInt(value.slice(0, value.length - 5))
        );

      // Game to add our user into
      //Find the game that is waiting for the longest time (= has the lowest timestamp)
      let waitingGameTimeStamp = Math.min.apply(null, waitingGamesNames);
      let waitingGame = Storage.getData(
        "games/waiting/" + waitingGameTimeStamp
      );

      //add the user the the correct socket room
      client.join(waitingGameTimeStamp.toString());

      waitingGame.player2 =
        clientSocket.handshake.session.login !== undefined
          ? clientSocket.handshake.session.login
          : client.id;

      //Save the game as a JSON file in ./back/storage/games
      Stratego.saveGame(
        "games/" + waitingGame.player1 + "+" + waitingGame.player2,
        waitingGame
      );

      //Remove the waiting JSON game file from ./back/storage/games/waiting
      fs.unlink(
        __dirname +
          "/back/storage/games/waiting/" +
          waitingGameTimeStamp +
          ".json",
        (err) => {
          if (err) throw err;
        }
      );

      gameWaiting = false;
      console.log("A game is starting".underline);

      //Update the first user's interface with the second player's name
      io.sockets.to(waitingGame.room_name).emit("match ready", {
        username1: waitingGame.player1,
        username2: waitingGame.player2,
      });
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

//****************************
//*     Clean up on exit     *
//****************************
process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    console.log(
      "\n------------------------------------------------------------------"
    );
    console.log("Cleaning up the files...");

    // Remove waiting game files
    fs.readdirSync(__dirname + "/back/storage/games/waiting").forEach(
      (filename) => {
        if (filename != "9999999999999999.json") {
          fs.unlinkSync(
            __dirname + "/back/storage/games/waiting/" + filename,
            (err) => {
              if (err) throw err;
            }
          );
          console.log(
            "/back/storage/games/waiting/" + filename + " was " + "deleted".bold
          );
        }
      }
    );

    // Remove filled game files
    fs.readdirSync(__dirname + "/back/storage/games").forEach((filename) => {
      if (filename != "TEMPLATE.json" && filename != "waiting") {
        fs.unlinkSync(__dirname + "/back/storage/games/" + filename, (err) => {
          if (err) throw err;
        });
        console.log(
          "/back/storage/games/" + filename + " was " + "deleted".bold
        );
      }
    });
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid"
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
