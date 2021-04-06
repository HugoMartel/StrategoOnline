/**
 * @file Process the emits that socket.io sends from the server
 * @version 1.0
 * @author Stratego Online
 */


/**
 * Toolbox of callbacks used for socket.on('event", callback) in index.html
 * @type {Object}
 * @return {Object} functions to use with the Socket module
 * @name Socket
 * @namespace Socket
 */
let Socket = (function () {
  /**
   * @function Socket.matchCreated
   * @param {Object} data
   * player1's name to display + enable loading icon
   * @returns {} /
   * @description socket.io client event callback called when a match is created
   */
  function matchCreatedCall(data) {
    if (data.username1 !== undefined) {
      Scenes.resetPlayers();
      Scenes.setGameReady(false);
      Scenes.addPlayer(data.username1);

      //Change the canvas scene
      Canvas.setCurrentScene(1);
      Canvas.drawCanvas();
    } else {
      Toast.error("The server wasn't able to create your game...");
    }
  }

  //======================================================================================
  /**
   * @function Socket.matchReady
   * @param {Object} data
   * player1's and player2's usernames to display on screen + start the game
   * @returns {} /
   * @description socket.io client event callback called when a match is ready to start
   */
  function matchReadyCall(data) {
    if (data.username1 !== undefined && data.username2 !== undefined) {
      Scenes.setGameReady(true);
      Scenes.addPlayer(data.username2);
      Scenes.addPlayer(data.username1); //If the firsy player gets this one again it will to be pushed to the players array

      //Change the canvas scene
      Canvas.setCurrentScene(1);
      Canvas.drawCanvas();
      setTimeout(() => {
        //Display the 3D Stratego game
        Canvas.setCurrentScene(2);
        Canvas.resetCanvas();
        Canvas.drawCanvas(); //< We enter the Babylon renderloop here
        //Create the ready button
        let readyDiv = document.createElement("div");
        readyDiv.id = "readyDiv";

        //not really important so I did not move it into index.scss
        readyDiv.style.position = "absolute";
        readyDiv.style.right = "5%";
        readyDiv.style.top = "40%";

        let readyButton = document.createElement("button");
        readyButton.classList.add("btn", "btn-danger");
        readyButton.type = "button";
        readyButton.innerText = "Not Ready";
        readyButton.id = "readyButton";

        let readyButtonCallback = (e) => {
          e.preventDefault();
          socket.emit('player ready');

          let button = document.getElementById("readyButton");
          button.innerText = "Ready";
          button.classList.replace("btn-danger", "btn-success");
          button.removeEventListener("click", readyButtonCallback);
          button.addEventListener("click", (e) => {
            e.preventDefault();
          });
        }

        readyButton.addEventListener("click", readyButtonCallback);

        readyDiv.appendChild(readyButton);

        // Add the moveset div to the page
        document.getElementById("main").appendChild(readyDiv);
      }, 3000);
    } else {
      Toast.error("The server wasn't able to connect you to a game...");
    }
  }

  //======================================================================================
  /**
   * @function Socket.userLeft
   * @param {Object} data
   * Reason for the game being cancelled
   * @returns {} /
   * @description socket.io client event callback called when a user lefts the client's game
   */
  function userLeftCall(data) {
    Toast.error("Your opponent just diconnected (" + data + ")...");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  //======================================================================================
  /**
   * @function Socket.userVictory
   * @param {Object} data
   * Score to display ?
   * @returns {} /
   * @description socket.io client event callback called when a match is over and when you were victorious
   */
  function userVictoryCall(data) {
    if (data === undefined || typeof data !== "string") {
      Toast.error("Wrong args given to the victory callback...");
    } else {
      Toast.success(data);
    }
    Graphics.endGame();
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 4000);
  }

  //======================================================================================
  /**
   * @function Socket.userDeafeat
   * @param {Object} data
   * Score to display ?
   * @returns {} /
   * @description socket.io client event callback called when a match is over and when you were defeated
   */
  function userDefeatCall(data) {
    if (data === undefined || typeof data !== "string") {
      Toast.error("Wrong args given to the victory callback...");
    } else {
      Toast.error(data);
    }
    Graphics.endGame();
    setTimeout(() => {
      window.location.href = window.location.href; 
    }, 4000);
  }

  //======================================================================================
  /**
   * @function Socket.getMoves
   * @param {Event} e
   * 'click' Event object
   * @returns {} /
   * @description  Removes the moveDiv from the page and removes its event listeners
   */
  let closeMoveDivCallback = function (e) {
    if (document.getElementById("closeMoveDiv")) {
      document.getElementById("closeMoveDiv").removeEventListener("click", closeMoveDivCallback);

      for (let node of document.getElementById("moveDiv").childNodes) {
        if (node.tagName == "DIV") {
          // Remove the main line listeners
          for (let childNode of node.childNodes) {
            if (!childNode.classList.contains("notClickable"))
              childNode.removeEventListener('click', closeMoveDivCallback);
          }
        } else if (node.tagName == "IMG") {
          node.removeEventListener('click', closeMoveDivCallback);
        }
      }

      document.getElementById("moveDiv").remove();

      Graphics.setClicked(false);
    }
  };
  
  //======================================================================================
  /**
   * @function Socket.getMoves
   * @param {Object} data
   * pieceLocation: clicked piece location
   * availableMoves: moves coords returned by the server where the selected piece can go
   * error : if the sererver send an error message
   * @returns {} /
   * @description socket.io client event callback called when the pieces' possible moves are returned by the server
   */
  function getMovesCall(data) {
    Graphics.setClicked(false);

    if (
      data === undefined &&
      data.pieceLocation === undefined &&
      data.availableMoves === undefined
    ) {
      Toast.error("The server couldn't fetch your available moves...");
    } else {
      // Append buttons to the moves div
      if (data.error !== undefined) {
        Toast.error(data.error);
      } else if (!data.availableMoves.length) {
        Toast.error("You can't move this piece...");
      } else {
        // Create the moveset div
        let moveDiv = document.createElement("div");
        moveDiv.id = "moveDiv";

        // Create the main line of moves that will always be present
        let moveLeftRightContainer = document.createElement("div");
        
        let selectedPieceImg = document.createElement("img");
        selectedPieceImg.src = "../../img/selectedPieces/" + Graphics.getStrength([data.pieceLocation.x, data.pieceLocation.z]) + ".png";
        selectedPieceImg.alt = "Selected Piece Image";
        selectedPieceImg.classList.add("notClickable");

        moveLeftRightContainer.appendChild(selectedPieceImg);
        moveDiv.appendChild(moveLeftRightContainer);

        // Create the buttons to be able to select a move
        for (let elt of data.availableMoves) {
          let moveButton = document.createElement("img");
          moveButton.classList.add("clickable");
          moveButton.alt = "Move Button Image";

          // Event to call when a move is requested
          moveButton.addEventListener("click", (e) => {
            closeMoveDivCallback(e);
            socket.emit("requestMove", {newCoords: [elt[0], elt[1]], oldCoords: [data.pieceLocation.x, data.pieceLocation.z]});
          });


          if (elt[1] > data.pieceLocation.z) {
            // Checks if the move is above the chosen piece
            if (elt[2]) moveButton.src = "../../img/swordsCrossing.png";
            else moveButton.src = "../../img/arrowUp.png";
            moveDiv.insertBefore(moveButton, moveDiv.childNodes[0]);
            
          } else if (elt[0] < data.pieceLocation.x) {
            // Checks if the move is on the left of the chosen piece
            if (elt[2]) moveButton.src = "../../img/swordsCrossing.png";
            else moveButton.src = "../../img/arrowLeft.png";
            moveLeftRightContainer.insertBefore(moveButton, moveLeftRightContainer.childNodes[0]);

          } else if (elt[0] > data.pieceLocation.x) {
            // Checks if the move is on the right of the chosen piece
            if (elt[2]) moveButton.src = "../../img/swordsCrossing.png";
            else moveButton.src = "../../img/arrowRight.png";
            moveLeftRightContainer.appendChild(moveButton);

          } else if (elt[1] < data.pieceLocation.z) {
            // Checks if the move is below the chosen piece
            if (elt[2]) moveButton.src = "../../img/swordsCrossing.png";
            else moveButton.src = "../../img/arrowDown.png";
            moveDiv.appendChild(moveButton);
            
          }
        }

        // Cross button to close the moveset div
        let closeMoveDiv = document.createElement("button");
        closeMoveDiv.classList.add("btn-close", "btn-close-white");
        closeMoveDiv.type = "button";
        closeMoveDiv.setAttribute("aria-label", "Close");
        closeMoveDiv.id = "closeMoveDiv";

        closeMoveDiv.addEventListener("click", closeMoveDivCallback);
        moveDiv.appendChild(closeMoveDiv);

        // Add the moveset div to the page
        document.getElementById("main").appendChild(moveDiv);
      }
    }
  }

  //======================================================================================
  /**
   * @function Socket.movePiece
   * @param {Object} data
   * newCoords : this are the new coords where the piece will move
   * oldCoords : this are the old coords of the piece
   * fight : in case there is a fight where the piece want to move give the kind of animation that have to be played or undefined if no fight
   * error : if the is an error message send by the server
   * @returns {} /
   * @description socket.io client event callback called when the server ask the client to move a piece on the board
   */
  function movePieceCall(data) {
    if (
      data === undefined &&
      data.newCoords === undefined &&
      data.oldCoords === undefined
    ) {
      Toast.error("The server couldn't fetch your available moves...");
    } else {
      if (data.error !== undefined) {
        Toast.error(data.error);
      } else {
        Graphics.deplace(data.newCoords, data.oldCoords, data.fight);
      }
    }
  }

  //======================================================================================
  /**
   * @function Socket.swapPieces
   * @param {Object} data
   * coordsA : this are the new coords where the piece will move
   * coordsB : this are the old coords of the piece
   * error : if the is an error message send by the server
   * @returns {} /
   * @description Swaps two pieces during the setup phase
   */
  function swapPiecesCall(data) {
    if (
      data === undefined &&
      data.coordsA === undefined &&
      data.coordsB === undefined
    ) {
      Toast.error("The server couldn't fetch your available moves...");
    } else {
      if (data.error !== undefined) {
        Toast.error(data.error);
      } else {
        Graphics.swap(data.coordsA, data.coordsB);
        Graphics.resetSwappable();
        Toast.success("Swap successful!");
      }
    }
  }

  //======================================================================================
  /**
   * @function Socket.gameStart
   * @returns {} /
   * @description callback called when both players of a game are ready to play
   */
  function gameStartCall() {
    // Remove the ready button and its listeners
    if (document.getElementById("readyDiv")) {
      document.getElementById("readyButton").removeEventListener('click', (e) => {
        e.preventDefault();
      });
      document.getElementById("readyDiv").remove();
    }
    Graphics.startGame();
    Graphics.setClicked(false);
    Toast.success("The game has now begun!\nOutsmart your opponent!");
  }

  //======================================================================================
  /**
   * @function Socket.playerReady
   * @param {Object} data
   * server's response
   * @returns {} /
   * @description callback called when the server responded to the ready event
   */
  function playerReadyCall(data) {
    if (data === undefined) {
      Toast.error("The server could not fetch your available moves...");
    } else {
      if (data.error !== undefined) {
        Toast.error(data.error);
      } else if (data.response !== undefined) {
        Toast.success(data.response);
      } else {
        Toast.error("The server did not respond anything...");
      }
    }
  }

  //======================================================================================
  //======================================================================================
  // Returned Object
  return {
    matchCreated: (data) => matchCreatedCall(data),
    matchReady: (data) => matchReadyCall(data),
    userLeft: (data) => userLeftCall(data),
    userVictory: (data) => userVictoryCall(data),
    userDefeat: (data) => userDefeatCall(data),
    getMoves: (data) => getMovesCall(data),
    movePiece: (data) => movePieceCall(data),
    swapPieces: (data) => swapPiecesCall(data),
    gameStart: () => gameStartCall(),
    playerReady: (data) => playerReadyCall(data),
    closeMoveDivCallback: (e) => closeMoveDivCallback(e),
  };
})();
