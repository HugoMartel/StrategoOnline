/**
 * @file Generates a Stratego game object that will be stored and modified in a json file later on
 * @version 1.0
 * @author Stratego Online
 */

//Imports
const Storage = require("../modules/storage").storage;

/** Class contructing a Stratego game object */
class Stratego {
  /**
   * Creates the game object
   * @param {string} player first player that will take part (the second player will be added later)
   */
  constructor(player) {
    this.player1 = player;
    this.player2 = null;
    //Create each player's pieces array
    this.player1Table = Array(10)
      .fill(0)
      .map((x) => Array(10).fill(0));
    this.player2Table = Array(10)
      .fill(0)
      .map((x) => Array(10).fill(0));
    //Add the lakes (-1)
    for (let i = 4; i < 6; ++i) {
      for (let j = 2; j < 4; ++j) {
        this.player1Table[i][j] = -1;
        this.player2Table[i][j] = -1;
        this.player1Table[i][j + 4] = -1;
        this.player2Table[i][j + 4] = -1;
      }
    }
    //Fill each player's array with the default pieces placement

    //! DEBUG
    console.log(this.player1);
    console.log(this.player1Table);
    console.log(this.player2);
    console.log(this.player2Table);
  }

  /**
   * Save the game to a JSON file named by its players
   */
  saveGame() {
    //TODO
    //Storage.editData("game/" + this.player1 + "-" + this.player2, this);
  }

  /**
   * End the game and add its results to the database
   */
  endGame() {
    //Add the game to the database
    //TODO
    //Add the winner to the database
    //TODO
    //Delete the stored JSON file from the storage
    //Storage.deleteData(this.player1 + "-" + this.player2);
  }
}

/**
 * Adds the game's missing second player
 * @param {string} player second player to add to the game object
 */
Stratego.prototype.addPlayer = (player) => {
  this.player2 = player;
};

module.exports = Stratego;
