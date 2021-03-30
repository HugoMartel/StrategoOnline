/**
 * @file Generates a Stratego game object that will be stored and modified in a json file later on
 * @version 1.0
 * @author Stratego Online
 */

//Imports
const Storage = require("../modules/storage");

/** Class contructing a Stratego game object */
class Game {
  /**
   * Creates the game object
   * @param {string} player first player that will take part (the second player will be added later)
   */
  constructor(player, name) {
    this.room_name = name;

    this.players = [player, null];
    //Create each player's pieces array
    this.tables = [
      Array(10)
        .fill(0)
        .map((x) => Array(10).fill(0)),
      Array(10)
        .fill(0)
        .map((x) => Array(10).fill(0))
    ];

    //Add the lakes (-1)
    for (let i = 4; i < 6; ++i) {
      for (let j = 2; j < 4; ++j) {
        this.tables[0][i][j] = -1;
        this.tables[1][i][j] = -1;
        this.tables[0][i][j + 4] = -1;
        this.tables[1][i][j + 4] = -1;
      }
    }
    //Fill each player's array with the default pieces placement

    //! DEBUG
    //console.log(this.players);
    //console.log(this.tables);
  }
}

/**
 * Function toolbox to use when using a Stratego Game Object
 * @type {Object}
 * @return {Object} Functions to edit and load json
 * @name Stratego
 * @namespace Stratego
 */
let Stratego = (function () {
  /**
   * @function Stratego.saveGame
   * @param {string} name
   * Path to save the Stratego Game Object
   * @param {Object} game
   * Game Object to save as JSON
   * @returns {} /
   * @description Saves a Stratego Game Object as JSON
   */
  let saveGameCall = (name, game) => {
    //! ERROR CHECKING
    Storage.saveData(name, game);
  };

  //============================================================================
  /**
   * @function Stratego.endGame
   * @param {string} name
   * Path to save the Stratego Game Object
   * @param {Object} game
   * Game Object to save as JSON
   * @param {number} winner
   * 1 or 2 which represents the player who won
   * @returns {} /
   * @description Saves a Stratego Game Object as JSON
   */
  let endGameCall = (name, game, winner) => {
    //Add the game to the database
    //TODO
    //Add the winner to the database
    //TODO
    //Delete the stored JSON file from the storage
    //Storage.deleteData(this.player1 + "-" + this.player2);
  };

  //============================================================================
  //============================================================================
  // Returned Object
  return {
    saveGame: (name, game) => saveGameCall(name, game),
    endGame: (name, game, winner) => endGameCall(name, game, winner),
  };
})();

module.exports = { Game: Game, Stratego: Stratego };
