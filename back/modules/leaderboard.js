/**
 * @file Generate different kind of informations of the leaderboard array
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Generate different kind of informations of the leaderboard array
 * @type {Object}
 * @return {Object} functions to get data of a rank or just generate an html line of a rank
 * @name Scores
 * @namespace Scores
 */
let Scores = (function () {
  /**
   * @function Scores.getRankInfos
   * @param {number} rank
   * Rank you want to get data
   * @param {number} data
   * Data you want to use
   * @returns {Array}
   * Array of this rank
   * @description Get the content of a rank in leaderboard array
   */
  function getRankInfos(rank, data) {
    if (data[rank]!= undefined) {
      return data[rank];
    }
    return data[0]; //Si on trouve pas, on envoie le 1er pour éviter l'erreur
  }

  return {
    /**
     * @function Scores.getRankData
     * @param {number} rank
     * Rank you want to get data
     * @param {number} data
     * Data you want to use
     * @returns {Array}
     * Array of this rank
     * @description Get the content of a rank in leaderboard array
     */
    getRankData(rank, data) {
      // sert à rien pour l'instant, peut être utile si l'on complexifie le stockage
      let leaderboard = getRankInfos(rank, data);
      let line = new Object();
      line["username"] = leaderboard.username;
      line["score"] = leaderboard.score;
      line["time"] = leaderboard.time;
      return line;
    },

    /**
     * @function Scores.getRankLine
     * @param {number} rank
     * Rank you want to create html table line for
     * @param {number} data
     * Data you want to use
     * @returns {string}
     * Return html code for the line of this rank
     * @description Create the html code for a rank line in a table
     */
    getRankLine(rank, data) {
      let leaderboard = getRankInfos(rank, data);
      return (
        "<tr>" +
        "<td>" +
        rank +
        "</td>" +
        "<td>" +
        leaderboard.username +
        "</td>" +
        "<td>" +
        leaderboard.score +
        " </td>" +
        "<td>" +
        leaderboard.time +
        "</td></tr>"
      );
    },
  };
})();

module.exports = Scores;
