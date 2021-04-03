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
    //TODO
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
    //TODO
  }

  //======================================================================================
  /**
   * @function Socket.fight
   * @param {Object} data
   * coords of the fight, winner of the fight (data.coord, data.winner)
   * @returns {} /
   * @description socket.io client event callback called when a fight is happening between two pieces
   */
  function fightCall(data) {
    //TODO
  }

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
        Graphics.setClicked(false);
      } else if (!data.availableMoves.length) {
        Toast.error("You can't move this piece...");
        Graphics.setClicked(false);
      } else {
        // Create the moveset div
        let moveDiv = document.createElement("div");
        // STYLE
        moveDiv.style.display = "flex";
        moveDiv.style.flexDirection = "column";
        moveDiv.style.flexWrap = "nowrap";
        moveDiv.style.justifyContent = "center";
        moveDiv.style.alignItems = "center";
        moveDiv.style.textAlign = "center";
        moveDiv.style.position = "absolute";
        moveDiv.style.backgroundColor = "green";
        moveDiv.style.width = "15%";
        moveDiv.style.top = "20%";
        moveDiv.style.padding = "10px 0";
        moveDiv.style.margin = "auto";
        moveDiv.style.backgroundColor = "#0c1821";
        moveDiv.style.boxShadow = "0 4px 8px 2px #e1ae33";
        moveDiv.style.color = "#e1ae33";
        moveDiv.style.borderRadius = "15px";
        moveDiv.id = "moveDiv";

        // Remove the moveDiv from the page
        let closeMoveDivCallback = function (e) {
          if (e.target && e.target.id == "closeMoveDiv") {
            Graphics.setClicked(false);
            document.removeEventListener("click", closeMoveDivCallback);
            //TODO: remove img callbacks too (we will have to do it dynamically...)
            for (node of document.getElementById("moveDiv").childNodes) {
              if (node.tagName == "DIV") {
                // Remove the main line listeners
                for (childNode of node.childNodes) {
                  if (!childNode.classList.contains("notClickable"))
                    childNode.removeEventListener('click', closeMoveDivCallback);
                }
              } else if (node.tagName == "IMG") {
                node.removeEventListener('click', closeMoveDivCallback);
              }
            }

            document.getElementById("moveDiv").remove();
          }
        };

        // Create the main line of moves that will always be present
        let moveLeftRightContainer = document.createElement("div");
        
        let selectedPieceImg = document.createElement("img");
        selectedPieceImg.src = "../../img/selectedPieces/" + Graphics.getStrength([data.pieceLocation.x, data.pieceLocation.z]) + ".png";
        selectedPieceImg.alt = "Selected Piece Image";
        selectedPieceImg.style.width = "50px";
        selectedPieceImg.style.height = "50px";
        selectedPieceImg.classList.add("notClickable");

        moveLeftRightContainer.appendChild(selectedPieceImg);
        moveDiv.appendChild(moveLeftRightContainer);

        // Create the buttons to be able to select a move
        for (elt of data.availableMoves) {
          let moveButton = document.createElement("img");
          moveButton.alt = "Move Button Image";
          moveButton.style.width = "50px";
          moveButton.style.height = "50px";

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
        closeMoveDiv.style.position = "absolute";
        closeMoveDiv.style.top = "5px";
        closeMoveDiv.style.right = "5px";
        closeMoveDiv.id = "closeMoveDiv";

        document.addEventListener("click", closeMoveDivCallback);
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
        console.log(data);
        Graphics.deplace(data.newCoords, data.oldCoords, data.fight);
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
    fight: (data) => fightCall(data),
    getMoves: (data) => getMovesCall(data),
    movePiece: (data) => movePieceCall(data),
  };
})();
