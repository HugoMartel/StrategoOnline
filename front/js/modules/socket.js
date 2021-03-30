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
   * coords of the piece that requested its moves
   * @returns {} /
   * @description socket.io client event callback called when the pieces' possible moves are returned by the server
   */
  function getMovesCall(data) {
    // Append buttons to the moves div
    //TODO
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
  };
})();
