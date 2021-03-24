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
   * @description Generic XMLHttpRequest function
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
   * @description Generic XMLHttpRequest function
   */
  function matchReadyCall(data) {
    if (data.username1 !== undefined && data.username2 !== undefined) {
      Scenes.setGameReady(true);
      Scenes.addPlayer(data.username2);
      Scenes.addPlayer(data.username1);//If the firsy player gets this one again it will to be pushed to the players array

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
   * Data sent from the server
   * @returns {} /
   * @description Generic XMLHttpRequest function
   */
  function userLeftCall(data) {
    //TODO
  }

  //======================================================================================
  //======================================================================================
  // Returned Object
  return {
    matchCreated: (data) => matchCreatedCall(data),
    matchReady: (data) => matchReadyCall(data),
    userLeft: (data) => userLeftCall(data),
  };
})();
