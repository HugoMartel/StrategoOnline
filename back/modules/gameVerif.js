/**
 * @file Game logic and verification 
 * @version 1.0
 * @author Stratego Online
 */

// requires
const Storage = require("./storage");

/**
 * Game logic and verification 
 * @type {Object}
 * @return {Object} Informations related to game logic
 * @name GameVerif
 * @namespace GameVerif
 */

let GameVerif = (function () {
    
    /**
    * @function GameVerif.isMovePossible
    * @param {Object} map
    * map informations
    * @param {String} playerID
    * Id of the player which play
    * @param {String} player2ID
    * Id of the other player
    * @param {Object} piece //id, posx, posy, destx, desty
    * piece you want to move
    * @returns {Array}
    * an array with true of false if move is possible and the string of the code error
    * @description Say if a move is possible, adn give you the details information about it
    */
    let isMovePossible = function(map, playerID, player2ID, piece){
        if (piece.destx < 0 || piece.destx > 9 || piece.desty < 0 || piece.desty > 9) {
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
        }
        else if(Math.abs(piece.destx - piece.posx) != 0 && Math.abs(piece.desty - piece.posy) != 0){
            return [false, "CANT_MOVE_ON_DIAGONAL"];
        }
        else if(piece.id != 2){
            if(Math.abs(piece.destx - piece.posx) > 1 || Math.abs(piece.desty - piece.posy) > 1){
                return [false, "CASE_OUT_OF_RANGE"];
            }
        }
        else if(piece.id == 2){
            if (piece.desty === piece.posy) {
                if (piece.destx < piece.posx) {
                    for (let index = piece.posx - 1; index > piece.destx; index--) {
                        if(map.tables[playerID][index][piece.posy] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                        if(map.tables[player2ID][index][piece.posy] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                    }
                }
                else {
                    for (let index = piece.posx + 1; index < piece.destx; index++) {
                        if(map.tables[playerID][index][piece.posy] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                        if(map.tables[player2ID][index][piece.posy] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                    }
                }
            }
            else {
                if (piece.desty < piece.posy) {
                    for (let index = piece.posy - 1; index > piece.desty; index--) {
                        if(map.tables[playerID][piece.posx][index] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                        if(map.tables[player2ID][piece.posx][index] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                    }
                }
                else {
                    for (let index = piece.posy + 1; index < piece.desty; index++) {
                        if(map.tables[playerID][piece.posx][index] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                        if(map.tables[player2ID][piece.posx][index] != 0){
                            return [false, "CANT_MOVE_THROUGH_A_PIECE"];
                        }
                    }
                }
            }
        }
        if(map.tables[player2ID][piece.destx][piece.desty] > 0){
            return [true, "BATTLE"];
        }
        return [true, "SUCCESS"];
    }

    //================================================================
    /**
    * @function GameVerif.checkBattle
    * @param {Number} pionA
    * value of piece attacking
    * @param {Number} pionB
    * value of piece attacked
    * @returns {Number}
    * return the piece which won the battle. If both died return 0, if not possible return -1
    * @description Give the result of a move
    */
    let checkBattle = function(pieceA, pieceB){
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
        return 0;
    }
    
    //================================================================
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
    * return the piece array of move your piece can do
    * @description Give the possible move for a piece
    */
    let possibleMoves = function(map, player, posx, posy){
        let playerID = map.players.findIndex(findPlayer=> findPlayer === player);
        let player2ID = (playerID+1)%2;// in Js !playerID transforms a number to a boolean :)

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
        piece.destx = piece.posx;
        for (let y = 0; y < map.tables[0][piece.posx].length; y++) {
            piece.desty = y;
            let movement = isMovePossible(map, playerID, player2ID, piece);
            moves[piece.destx][piece.desty] = movement[0] ? 1 : 0;
            if (movement[1] == "BATTLE") {
                moves[piece.destx][piece.desty] = 2;
            }      
        }
        piece.desty = posy;
        for (let x = 0; x < map.tables[0].length; x++) {
            piece.destx = x;
            let movement = isMovePossible(map, playerID, player2ID, piece);
            moves[piece.destx][piece.desty] = movement[0] ? 1 : 0;
            if (movement[1] == "BATTLE") {
                moves[piece.destx][piece.desty] = 2;
            }       
        }
        return moves;
    }

    //================================================================
    /**
    * @function GameVerif.makeMove
    * @param {Object} map
    * map you are playing on
    * @param {String} player
    * player which is requesting the move
    * @param {Number} posx
    * posX of the piece
    * @param {Number} posy
    * posX of the piece
    * @param {Number} destx
    * destX of the piece
    * @param {Number} desty
    * destY of the piece
    * @returns {Object}
    *   isPossible    : bool   (if movement is possible)
    *   oldX          : number (posx)
    *   oldY          : number (posy)
    *   newX          : number (destx)
    *   newY          : number (desty)
    *   isFight       : bool   (if battle)
    *   winner        : number (winner of the battle, 2 if same power)
    *   attackerPower : number (power of the piece which attacks)
    *   defenderPower : number (power of the attacked piece)
    *   isFinished    : number   (0 if the game is not finished, 1 if the player won, 2 if player won because opponent have no more peces, 3 if player lost because he have no more peces, 4 if both have no more pieces)
    * @description Make the move if possible
    */
    let makeMove = function (map, player, posx, posy, destx, desty) {
        let playerID = map.players.findIndex(findPlayer => findPlayer === player);
        let player2ID = (playerID+1)%2; // in Js !playerID transforms a number to a boolean :)

        let pieceA = map.tables[playerID][posx][posy];
        let movement = isMovePossible(map, playerID, player2ID, {id: pieceA, posx: posx, posy: posy, destx: destx, desty: desty});
        if (movement[0]) {
            let fileName = "games/" + map.players[0]+"+"+map.players[1];
            map.turn = (map.turn+1)%2;
            map.tables[playerID][posx][posy] = 0;
            if (movement[1] == "BATTLE") {
                let pieceB = map.tables[player2ID][destx][desty];
                let battleResult = checkBattle(pieceA, pieceB);
                let winner = 2;
                let scores = [0,0];
                let gameState = 0; /* The game status : 0 is not finished, 
                1 if player won, 
                2 if player won because opponent have no more peces, 
                3 if player lost because he have no more peces
                4 if both have no more pieces */
                if (battleResult === pieceA) {
                    winner = playerID;
                    map.tables[player2ID][destx][desty] = 0;
                    map.tables[playerID][destx][desty] = pieceA;
                } else if (battleResult === pieceB) {
                    winner = player2ID;
                    map.tables[playerID][destx][desty] = 0;
                    map.tables[player2ID][destx][desty] = pieceB;
                }else if (battleResult === 0) {
                    map.tables[playerID][destx][desty] = 0;
                    map.tables[player2ID][destx][desty] = 0;
                }

                //! DEBUG
                //console.table(map.tables[0]);
                //console.table(map.tables[1]);

                Storage.saveData(fileName, map);

                
                // player playing
                map.tables[playerID].forEach(line => line.forEach(function(pieces){ 
                    if (pieces<11 && pieces>0){
                        scores[0] += pieces;
                    } 
                }));
                // player aopponent
                map.tables[player2ID].forEach(line => line.forEach(function(pieces){ 
                    if (pieces<11 && pieces>0){
                        scores[1] += pieces;
                    } 
                }));
                if(pieceB == 12){
                    gameState = 1;
                    scores[map.turn] = 0;// Nullify the score of the loser
                } else {
                    if(scores[1] == 0 && scores[0] == 0){ // If both have no more pieces
                        gameState = 2;
                    }else if(scores[1] == 0){ // if opponent have no more pieces
                        gameState = 4;
                    }else if(scores[0] == 0) {  // if player have no more pieces
                        gameState = 3;
                    }
                }
                
                
                return {
                    isPossible: true,
                    oldX: posx,
                    oldY: posy,
                    newX: destx,
                    newY: desty,
                    isFight: true,
                    winner: winner,
                    attackerPower: pieceA,
                    defenderPower: pieceB,
                    isFinished: gameState,
                    scores: (!gameState) ? undefined : scores
                }
                //return [true, posx, posy, destx, desty, true, winner, pieceA, pieceB];//old method
            } else {
                map.tables[playerID][destx][desty] = pieceA;

                //! DEBUG
                //console.table(map.tables[0]);
                //console.table(map.tables[1]);

                Storage.saveData(fileName, map);
                return {
                    isPossible: true,
                    oldX: posx,
                    oldY: posy,
                    newX: destx,
                    newY: desty,
                    isFight: false
                }
                //return [true, posx, posy, destx, desty, false];//old method
            }
        } else {
            return { isPossible: false };
        }
    }

    //================================================================
    /**
    * @function GameVerif.makeSwap
    * @param {Object} map
    * map you are playing on
    * @param {String} player
    * player which is requesting the swap
    * @param {Number} pa_posx
    * posX of the piece A
    * @param {Number} pa_posy
    * posY of the piece A
    * @param {Number} pb_posx
    * posX of the piece B
    * @param {Number} pb_posy
    * posY of the piece B
    * @return {Bool}
    * if swap is done
    * @description Make the swap if possible
    */
    let makeSwap = function(map, player, pa_posx, pa_posy, pb_posx, pb_posy) {
        //! Don't forget to convert coords to match the server's standards
        /*
        player0: (x,y) -> server: ( y , 9-x)
        player1: (x,y) -> server: (9-y,  x ) 
        */
        let playerID = map.players.findIndex(findPlayer => findPlayer === player);
        if (playerID == 0) {
            let tmp_x = pa_posx;
            pa_posx = pa_posy;
            pa_posy = 9-tmp_x;
            tmp_x = pb_posx;
            pb_posx = pb_posy;
            pb_posy = 9-tmp_x;
        } else {
            let tmp_x = pa_posx;
            pa_posx = 9-pa_posy;
            pa_posy = pa_posx;
            tmp_x = pb_posx;
            pb_posx = 9-pb_posy;
            pb_posy = pb_posx;
        }
        
        let pa = map.tables[playerID][pa_posx][pa_posy];
        let pb = map.tables[playerID][pb_posx][pb_posy];

        if (pa != -1 && pa != 0 && pb != -1 && pb != 0) {
            map.tables[playerID][pa_posx][pa_posy] = pb;
            map.tables[playerID][pb_posx][pb_posy] = pa;
            Storage.saveData("games/" + map.players[0]+"+"+map.players[1], map);
            return true;
        }
        return false;
    }

    //================================================================
    //================================================================
    return {
        possibleMoves: (map, player, posx, posy) => possibleMoves(map, player, posx, posy),
        makeMove : (map, player, posx, posy, destx, desty) => makeMove(map, player, posx, posy, destx, desty),
        makeSwap : (map, player, pa_posx, pa_posy, pb_posx, pb_posy) => makeSwap(map, player, pa_posx, pa_posy, pb_posx, pb_posy)
    }
})();

module.exports = GameVerif;
