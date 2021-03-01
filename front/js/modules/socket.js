/**
 * @file Socket.io events to proccess for the game
 * @version 1.0
 * @author Stratego Online
 */
let tmpButton = document.createElement('button');
tmpButton.id = "playButton";
tmpButton.innerText = "Test";
tmpButton.classList.add("btn", "btn-success");

document.getElementById("main").appendChild(tmpButton);

// Gestion de l'envoi d'un message
//TODO create the PLAY button properly
//! id="playButton"
document.getElementById("playButton").addEventListener("click", (event) => {
  event.preventDefault();

  //Inform the server that someone wants to play
  socket.emit("newGame");//TODO add args ?

  //Proceed to the opponent waiting screen
  document.getElementById("playButton").remove();
  //TODO
});
