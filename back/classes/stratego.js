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
    this.turn = 0;//Defaults to player 0 turn
    this.started = false;
    
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
    //* First player
    this.tables[0][0][9] = 3;//First line
    this.tables[0][0][8] = 3;
    this.tables[0][0][7] = 11;
    this.tables[0][0][6] = 11;
    this.tables[0][0][5] = 12;
    this.tables[0][0][4] = 11;
    this.tables[0][0][3] = 11;
    this.tables[0][0][2] = 3;
    this.tables[0][0][1] = 3;
    this.tables[0][0][0] = 2;
    this.tables[0][1][9] = 5;//Second line
    this.tables[0][1][8] = 2;
    this.tables[0][1][7] = 6;
    this.tables[0][1][6] = 8;
    this.tables[0][1][5] = 4;
    this.tables[0][1][4] = 11;
    this.tables[0][1][3] = 5;
    this.tables[0][1][2] = 7;
    this.tables[0][1][1] = 5;
    this.tables[0][1][0] = 11;
    this.tables[0][2][9] = 1;//Third line
    this.tables[0][2][8] = 7;
    this.tables[0][2][7] = 2;
    this.tables[0][2][6] = 3;
    this.tables[0][2][5] = 2;
    this.tables[0][2][4] = 7;
    this.tables[0][2][3] = 5;
    this.tables[0][2][2] = 2;
    this.tables[0][2][1] = 6;
    this.tables[0][2][0] = 10;
    this.tables[0][3][9] = 6;//Fourth line
    this.tables[0][3][8] = 4;
    this.tables[0][3][7] = 9;
    this.tables[0][3][6] = 2;
    this.tables[0][3][5] = 6;
    this.tables[0][3][4] = 4;
    this.tables[0][3][3] = 2;
    this.tables[0][3][2] = 8;
    this.tables[0][3][1] = 4;
    this.tables[0][3][0] = 2;

    //* Second player
    this.tables[1][9][0] = 3;//First line
    this.tables[1][9][1] = 3;
    this.tables[1][9][2] = 11;
    this.tables[1][9][3] = 11;
    this.tables[1][9][4] = 12;
    this.tables[1][9][5] = 11;
    this.tables[1][9][6] = 11;
    this.tables[1][9][7] = 3;
    this.tables[1][9][8] = 3;
    this.tables[1][9][9] = 2;
    this.tables[1][8][0] = 5;//Second line
    this.tables[1][8][1] = 2;
    this.tables[1][8][2] = 6;
    this.tables[1][8][3] = 8;
    this.tables[1][8][4] = 4;
    this.tables[1][8][5] = 11;
    this.tables[1][8][6] = 5;
    this.tables[1][8][7] = 7;
    this.tables[1][8][8] = 5;
    this.tables[1][8][9] = 11;
    this.tables[1][7][0] = 1;//Third line
    this.tables[1][7][1] = 7;
    this.tables[1][7][2] = 2;
    this.tables[1][7][3] = 3;
    this.tables[1][7][4] = 2;
    this.tables[1][7][5] = 7;
    this.tables[1][7][6] = 5;
    this.tables[1][7][7] = 2;
    this.tables[1][7][8] = 6;
    this.tables[1][7][9] = 10;
    this.tables[1][6][0] = 6;//Fourth line
    this.tables[1][6][1] = 4;
    this.tables[1][6][2] = 9;
    this.tables[1][6][3] = 2;
    this.tables[1][6][4] = 6;
    this.tables[1][6][5] = 4;
    this.tables[1][6][6] = 2;
    this.tables[1][6][7] = 8;
    this.tables[1][6][8] = 4;
    this.tables[1][6][9] = 2;


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
