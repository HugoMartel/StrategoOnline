/**
 * @file Game logic and verification 
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Game logic and verification 
 * @type {Object}
 * @return {} Informations related to game logic
 * @name gameVerif
 * @namespace GameVerif
 */

 let GameVerif = (function () {
    /**
    * @function GameVerif.isMovePossible
    * @param {Object} map
    * map informations
    * @param {Object} player
    * mplayer playing
    * @param {Object} pawn
    * pawn you want to move
    * @param {Object} posx
    * pos x you want to move to
    * @param {Object} posy
    * pos y you want to move to
    * @returns {Object}
    * JSON Object that was stored in the file
    * @description Get the content of a JSON file
    */
    let isMovePossible = function(map, player, pawn, posx, posy){
        if(map.player.find(player) == 0){
            return 1000
        }
        if(map[posx][posy]!=0){
            return 1001;
        }
        if(pawn.player != player){
            return 1002;
        }
        if(pawn.type=="B" || pawn.type == "F"){
            return 1003;
        }
    }
    // Returned Object
    return {
        checkMove: (map, player, pawn, posx, posy) => isMovePossible(map, player, pawn, posx, posy),
    }
})();

 module.exports = GameVerif;
