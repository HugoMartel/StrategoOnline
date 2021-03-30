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
    
    /**
    * @function GameVerif.isMovePossible
    * @param {Object} map
    * map informations
    * @param {String} player
    * Name of the player which play
    * @param {Object} piece //id, posx, posy, destx, desty
    * piece you want to move
    * @returns {Array}
    * an array with true of false if move is possible and the string of the code error
    * @description Say if a move is possible, adn give you the details information about it
    */
    let isMovePossible = function(map, player, piece){
        let playerID = map.players.findIndex(findPlayer=> findPlayer === player);
        let player2ID = (playerID+1)%2;
        if(map.players[playerID] != player){ // If the player isn't in the game
            return [false, "NOT_IN_GAME"];
        }
        else if (piece.destx < 0 || piece.destx > 9 || piece.desty < 0 || piece.desty > 9) {
            return [false, "OUT_OF_MAP"];
        }
        else if(map.tables[playerID][piece.destx][piece.desty] == -1){
            return [false, "CANT_MOVE_ON_WATER"];
        }
        else if(piece.id == 11){
            return [false, "CANT_MOVE_BOMBS"];
        }
        else if(piece.id == 12){
            return [false, "CANT_MOVE_FLAG"];
        }
        else if(map.tables[playerID][piece.destx][piece.desty] != 0){
            return [false, "CANT_MOVE_ON_YOUR_PIECE"];
        }else if(piece.id != 2){
            if(Math.abs(piece.destx-piece.posx) + Math.abs(piece.desty-piece.posy) >1){
                return [false, "CANT_MOVE_ON_DIAGONAL"];
            }
            if(Math.abs(piece.destx-piece.posx) != 1 || Math.abs(piece.desty-piece.posy) != 1){
                return [false, "CASE_OUT_OF_RANGE"];
            }
        }
        else if(piece.id == 2){
            if(piece.destx-piece.posx!=0 && piece.desty-piece.posy !=0){
                return [false, "CANT_MOVE_ON_DIAGONAL"];
            }
            for (let index = 1; index < piece.destx-piece.posx; index > piece.destx-piece.posx ? index--:index++) {
                if(map.tables[playerID][piece.posx+index][piece.posy] !=0){
                    return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                }
                if(map.tables[player2ID][piece.posx+index][piece.posy] !=0){
                    return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                }
            }
            for (let index = 1; index < piece.desty-piece.posy; index > piece.desty-piece.posy ? index--:index++) {
                if(map.tables[playerID][piece.posx][piece.posy+index] !=0){
                    return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                }
                if(map.tables[player2ID][piece.posx][piece.posy+index] !=0){
                    return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                }
            }
        }
        else if(map.tables[player2ID][piece.destx][piece.desty] > 0){
            return [true, "BATTLE"];
        }
        return [true, "SUCESS"]
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
    
    /**
    * @function GameVerif.possibleMoves
    * @param {Object} map
    * map you are playing on
    * @param {String} player
    * player which is playing
    * @param {Number} posx
    * posX of the piece
    * @param {Number} posy
    * posX of the piece
    * @returns {Array}
    * return the piece array of move yoru peicecan do
    * @description Give the possible move for a piece
    */

    let possibleMoves = function(map, player, posx, posy){
        let playerID = map.players.findIndex(findPlayer=> findPlayer === player);
        let moves=[
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, -1, -1, 0, 0, -1, -1, 0, 0],
            [0, 0, -1, -1, 0, 0, -1, -1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        let piece = { id: map.tables[playerID][posx][posy], posx: posx, posy: posy};
        for (let y = 0; y <map.tables[0][piece.posx].length; y++) {
            piece.destx = piece.posx;
            piece.desty=y;
            console.log(isMovePossible(map, player, piece));
            if(isMovePossible(map, player,piece)[0] == false){
                moves[piece.destx][piece.desty]=0;
            }else if(isMovePossible(map, player,piece)[1] == "BATTLE" ){
                moves[piece.destx][piece.desty]=2;
            }else if(isMovePossible(map, player,piece)[0] == true){
                moves[piece.destx][piece.desty]=1;
            }         
        }
        piece.desty=posy;
        for (let x = 0; x < map.tables[0].length; x++) {
            piece.destx=x;
            console.log(isMovePossible(map, player, piece));
            if(isMovePossible(map, player,piece)[0] == false){
                moves[piece.destx][piece.desty]=0;
            }
            else if(isMovePossible(map, player,piece)[1] == "BATTLE" ){
                moves[piece.destx][piece.desty]=2;
            }else if(isMovePossible(map, player,piece)[0] == true){
                moves[piece.destx][piece.desty]=1;
            }          
        }
        return moves;
    }

    return {
        checkMove: (map, player, piece) => isMovePossible(map, player, piece),
        checkBattle: (pieceA, pieceB) => makeBattle(pieceA, pieceB),
        possibleMoves: (map, player, posx, posy) => possibleMoves(map, player, posx, posy),
    }
})();

module.exports = GameVerif;
