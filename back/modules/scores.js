/**
 * @file Generate different kind of informations of the scores array
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Generate different kind of informations of the scores array
 * @type {Object}
 * @return {Object} functions to get data of a rank or just generate an html line of a rank
 * @name Scores
 * @namespace scores
 */

let Scores = (function () {

    /**
   * @function scores.getRankInfos
   * @param {Number} rank
   * Rank you want to acces informations
   * @returns {Array} 
   * Array of this rank
   * @description Get the content of a rank in scores array
   */

    function getRankInfos(rank){
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].rank == rank) return scores[i];
        }
        return scores[0]; //Si on trouve pas, on envoie le 1er pour éviter l'erreur
    }

    return{
        /**
        * @function scores.getRankData
        * @param {Number} rank
        * Rank you want to acces informations
        * @returns {Array} 
        * Array of this rank
        * @description Get the content of a rank in scores array
        */
        // sert à rien pour l'instant, peut être utile si l'on complexifie le stockage
        getRankData(rank){
            let scores = getRankInfos(rank);
            let line = new Object();
            line["username"] = scores.username;
            line["score"] = scores.score;
            line["time"] = scores.time;
            return line;
        },

        /**
        * @function scores.getRankLine
        * @param {Number} rank
        * Rank you want to create html table line for
        * @returns {String} 
        * Return html code for the line of this rank
        * @description Create the html code for a rank line in a table
        */
        getRankLine(rank) {
            let scores = getRankInfos(rank);
            return "<tr>"+"<td>" + rank + "</td>"
            +"<td>" + scores.username + "</td>"
            + "<td>" + scores.score + " points</td>"
            + "<td>" + scores.time + "min</td></tr>";
        }
    }
})();

module.exports = { scores: Scores };
