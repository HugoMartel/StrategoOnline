/**
 * @file Game logic and verification 
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Game logic and verification 
 * @type {Object}
 * @return {Object} Informations related to game logic
 * @name gameVerif
 * @namespace GameVerif
 */

 let GameVerif = (function () {
    let returnCodes = [
        //for isMovePossible
        ["NOT_IN_GAME"] = 1000,
        ["CANT_MOVE_ON_WATER"] = 1001,
        ["CANT_MOVE_BOMBS"] = 1002,
        ["CANT_MOVE_FLAG"] = 1003,
        ["CANT_MOVE_ON_YOUR_PIECE"] = 1004,
        ["OUT_OF_MAP"] = 1005,
        ["CASE_OUT_OF_RANGE"] = 1006,
        ["CANT_MOVE_ON_DIAGONAL"] = 1007,
        ["CANT_MOVE_THROUGH_A_PIECE"] = 1008,
        ["BATTLE"] = 1009,
    ];
    /**
    * @function GameVerif.isMovePossible
    * @param {Object} map
    * map informations
    * @param {Object} player
    * player playing
    * @param {Object} piece //id, posx, posy, destx, desty
    * piece you want to move
    * @returns {Bool, Number}
    * a tuple with true of false if move is possible and a value of the code error
    * @description Say if a move is possible, adn give you the details information about it
    */
    let isMovePossible = function(map, player, piece){
        let playerID = map.players.findIndex(findPlayer=> findPlayer === player);
        let player2ID = (playerID+1)%2;
        if(map.players[playerID] != player){ // If the player isn't in the game
            return false, returnCodes["NOT_IN_GAME"];
        }
        else if (piece.destx < 0 || piece.destx > 9 || piece.desty < 0 || piece.desty > 9) {
            return false, returnCodes["OUT_OF_MAP"];
        }
        else if(map.tables[playerID][piece.destx][piece.desty] == -1){
            return false, returnCodes["CANT_MOVE_ON_WATER"];
        }
        else if(piece.id == 11){
            return false, returnCodes["CANT_MOVE_BOMBS"];
        }
        else if(piece.id == 12){
            return false, returnCodes["CANT_MOVE_FLAG"];
        }
        else if(map.tables[playerID][piece.destx][piece.desty] != 0){
            return false, returnCodes["CANT_MOVE_ON_YOUR_PIECE"];
        }else if(piece.id != 2){
            if(Math.abs(piece.destx-piece.posx) + Math.abs(piece.desty-piece.posy) >2){
                return false, returnCodes["CANT_MOVE_ON_DIAGONAL"];
            }
            if(Math.abs(piece.destx-piece.posx) != 1 || Math.abs(piece.desty-piece.posy) != 1){
                return false, returnCodes["CASE_OUT_OF_RANGE"];
            }
        }
        else if(piece.id == 2){
            if(piece.destx-piece.posx!=0 && piece.desty-piece.posy !=0){
                return false, returnCodes["CANT_MOVE_ON_DIAGONAL"];
            }
            for (let index = 0; index < piece.destx-piece.posx; index > piece.destx-piece.posx ? idnex--:index++) {
                if(map.tables[playerID][piece.posx+index][piece.posy] !=0){
                    return false, returnCodes["CANT_MOVE_THROUGH_A_PIECE"];
                }
                if(map.tables[player2ID][piece.posx+index][piece.posy] !=0){
                    return false, returnCodes["CANT_MOVE_THROUGH_A_PIECE"];
                }
            }
            for (let index = 0; index < piece.desty-piece.posy; index > piece.desty-piece.posy ? idnex--:index++) {
                if(map.tables[playerID][piece.posx][piece.posy+index] !=0){
                    return false, returnCodes["CANT_MOVE_THROUGH_A_PIECE"];
                }
                if(map.tables[player2ID][piece.posx][piece.posy+index] !=0){
                    return false, returnCodes["CANT_MOVE_THROUGH_A_PIECE"];
                }
            }
        }
        else if(map.tables[player2ID][piece.destx][piece.desty] !=0){
            return true, returnCodes["BATTLE"];
        }
        return true, returnCodes["SUCESS"]
    }

    /**
    * @function GameVerif.makeBattle
    * @param {Number} pionA
    * value of piece attacking
    * @param {Number} pionB
    * value of piece attacked
    * @returns {Number}
    * return the piece which won the battle. If both died return 0, if not possible return -1
    * @description Give the result of a move
    */
    let makeBattle = function(pieceA, pieceB){
        if(pieceB==12){
            return pieceA;
        }
        else if(pieceA != 3 && pieceB == 11){
            return pieceB;
        }
        else if(pieceA == 3 && pieceB == 11){
            return pieceA;
        }
        else if(pieceA == 1 && pieceB == 10){
            return pieceA;
        }
        else if(pieceA == pieceB){
            return 0;
        }
        else if(pieceA < pieceB){
            return pieceB;
        }
        else if(pieceA > pieceB){
            return pieceA;
        }
        return -1;
    }
    
    return {
        checkMove: (map, player, piece) => isMovePossible(map, player, piece),
        checkBattle: (pieceA, pieceB) => makeBattle(pieceA, pieceB),
    }
})();

module.exports = GameVerif;
