/**
 * @file Module to use 3D elements in the game canvas
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Toolbox to use when manipulating 3D elements for the game
 * @type {Object}
 * @return {Object} functions to use with the Request module
 * @name Graphics
 * @namespace Graphics
 */
let Graphics = (function () {
  // Variables used for 3D
  let board = undefined;
  let pieceClicked = true;
  let scene = undefined;
  /**
   * @function Graphics.createScene
   * @argument {HTMLCanvasElement} canvas
   * Canvas to display elements in
   * @argument {Object} engine
   * 3D Babylon Engine
   * @returns {Object} Scene Object to use when working with the 3D
   * @description Sets everything up for a new 3D scene
   */
  let createSceneCall = (canvas, engine) => {
    //basic
    scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 3,
      12,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas, false);
    //max beta angle, so the player can't look under
    camera.upperBetaLimit = 1.2;
    //prevent players from moving the camera around
    camera.panningDistanceLimit = 0.1;
    //max and min radius, so you can't cross the tabletop, or go far away because ur afraid to loose
    camera.lowerRadiusLimit = 7;
    camera.upperRadiusLimit = 15;
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
    //first meshes
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
      width: 10,
      height: 10,
    });
    const tabletop = new BABYLON.StandardMaterial("tabletop");
    tabletop.diffuseTexture = new BABYLON.Texture(
      "../../textures/tabletop.jpg",
      scene
    );
    ground.material = tabletop;

    //Create a Table with default pices positions stored in board
    board = new Table([
      [1, [0,2]],
      [2, [9,0], [1,1], [2,2], [4,2], [7,2], [3,3], [6,3], [9,3]],
      [3, [0,0], [1,0], [7,0], [8,0], [3,2]],
      [4, [4,1], [1,3], [5,3], [8,3]],
      [5, [0,1], [6,1], [8,1], [6,2]],
      [6, [2,1], [8,2], [0,3], [4,3]],
      [7, [7,1], [1,2], [5,2]],
      [8, [3,1], [7,3]],
      [9, [2,3]],
      [10, [9,2]],
      [11, [2,0], [3,0], [5,0], [6,0], [5,1], [9,1]],
      [12, [4,0]]
    ], [
      [0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9],
      [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],
      [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],
      [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]
    ], scene);
    
    // Load the scene for the render loop
    scene.registerBeforeRender(function () {
      // Checking the position of each 3D Piece whith its board.grid position
      for (x = 0; x < 10; ++x) {
        for (z = 0; z < 10; ++z) {
          if (board.grid[x][z] != undefined) {
            let coord = board.grid[x][z].check();
            // if the error is not minimal
            if (Math.abs(coord[0]) > 0.01) {
              //move the piece because not in the good position:
              if (coord[0] > 0.01)
                board.grid[x][z].physicalPiece.position.x += 0.01;
              else if (coord[0] < -0.01)
                board.grid[x][z].physicalPiece.position.x -= 0.01;
            } else if (Math.abs(coord[1]) > 0.01) {
              if (coord[1] > 0.01)
                board.grid[x][z].physicalPiece.position.z += 0.01;
              else if (coord[1] < -0.01)
                board.grid[x][z].physicalPiece.position.z -= 0.01;
            } else if (board.grid[x][z].status == -1 || board.grid[x][z].status == 2) {
              // The piece has stopped moving
              //set the coords manually since they are close enough to their real position
              // the "real" position is calculated with the savant formula : board.grid.position * 0.835 - 3.757 (found by tiptoeing with values)
              board.grid[x][z].physicalPiece.position.x = board.grid[x][z].x * 0.835 - 3.757;
              board.grid[x][z].physicalPiece.position.z = board.grid[x][z].z * 0.835 - 3.757;

              //to allow the rotation to finish
              if(board.grid[x][z].status != 2){
                board.grid[x][z].status = 1;
                pieceClicked = false;// We can now click on pieces again
                socket.emit("move ready");// To keep both clients synchronised
              }
            }
            //if reveal
            if(board.grid[x][z].status == 2 || board.grid[x][z].status == 0) {
              //the reveal rotation (ye cool stuff)
              if(board.grid[x][z].physicalPiece.rotation.y <= 5 * Math.PI/2) 
                board.grid[x][z].physicalPiece.rotation.y += 0.04;
              else if(board.grid[x][z].status == 2){
                board.grid[x][z].physicalPiece.rotation.y = Math.PI/2;
                board.grid[x][z].status = 1;
                pieceClicked = false;// We can now click on pieces again
                socket.emit("move ready");// To keep both clients synchronised
              }
            }
            //if ded
            if(board.grid[x][z].status == 0) {
              //ded
              if(board.grid[x][z].physicalPiece.position.y > -20) 
                board.grid[x][z].physicalPiece.position.y -= 0.05;
              else{
                //removing the mesh
                board.grid[x][z].physicalPiece.dispose();
                //removing the piece from the grid
                if(board.grid[x][z].replacement !== undefined) {
                  let replace = board.grid[x][z].replacement
                  board.grid[x][z] = board.grid[replace.x][replace.z];
                  board.grid[replace.x][replace.z]= undefined;
                } else { 
                  board.grid[x][z] = undefined;
                }
                pieceClicked = false;// We can now click on pieces again
                socket.emit("move ready");// To keep both clients synchronised
              }
            }
          }
        }
      }
    });

    //end of the creation
    return scene;
  };

  //=====================================================================//
  /**
   * @function Graphics.deplace
   * @argument {number[]} newCoord
   * The coords where the selected piece will be moved
   * @argument {number[]} oldCoord
   * The coords where the selected piece is currently positionned
   * @argument {Object} fight
   * (optional)
   * If the deplace needs a fight animation, add args to enable the animation
   * object: {
   * win: 1 if the attackers win, or 2 if it's a draw, or 0 if it's a lose
   * ? enemyStrength: used for the reveal of the piece //not used yet ?
   * }
   * @returns {} /
   * @description Sets everything up to make the 3D scene usable
   */
  let deplaceCall = (newCoord, oldCoord, fight = undefined) => {
    let isMoving = true;
    Socket.closeMoveDivCallback();
    pieceClicked = true;//Prevent a piece from getting clicked before its animation is done

    if(fight !== undefined){
      /*
      let enemyColor = new BABYLON.StandardMaterial("mat0", scene);
      let enemyTopColor = new BABYLON.StandardMaterial("mat0", scene);
      //loading the textures of the enemy piece
      
      switch(fight.enemyStrength){
      case 10:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/10.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/10.png",
          scene
        );
        break;
      case 9:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/9.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/9.png",
          scene
        );
        break;
      case 8:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/8.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/8.png",
          scene
        );
        break;
      case 7:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/7.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/7.png",
          scene
        );
        break;
      case 6:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/6.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/6.png",
          scene
        );
        break;
      case 5:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/5.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/5.png",
          scene
        );
        break;
      case 4:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/4.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/4.png",
          scene
        );
        break;
      case 3:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/3.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/3.png",
          scene
        );
        break;
      case 2:
        enemyColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/2.png",
          scene
        );
        enemyTopColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/2.png",
          scene
        );
        break
        case 1:
          enemyColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cube/1.png",
            scene
          );
          enemyTopColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cylinder/1.png",
            scene
          );
          break;
        case 12: //flag
          enemyColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cube/0.png",
            scene
          );
          enemyTopColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cylinder/12.png",
            scene
          );
          break;
        case 11:
          enemyColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cube/b.png",
            scene
          );
          enemyTopColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cylinder/11.png",
            scene
          );
          break;
        default:
          enemyColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cube/Cube.png",
            scene
          );
          enemyTopColor.diffuseTexture = new BABYLON.Texture(
            "/textures/pieces/Red/Cylinder/top.png",
            scene
          );
          break;
      }

      //appllying the new texture:
      board.grid[newCoord.x][newCoord.z].physicalPiece.subMeshes[1].material = enemyColor;
      board.grid[newCoord.x][newCoord.z].physicalPiece.subMeshes[2].material = enemyTopColor;
      */


      if (fight.win !== undefined && fight.win == 0) {
        //when the piece attacking is losing (looser)
        //piece attacking is ded
        board.grid[oldCoord.x][oldCoord.z].status = 0;
        //initiating the reveal of the enemy piece
        board.grid[newCoord.x][newCoord.z].status = 2;
        //maybe remove that line
        //board.grid[newCoord.x][newCoord.z].physicalPiece.rotation.y +=0.01;
        isMoving = false;
      }

      else if (fight.win !== undefined && fight.win == 1) {
        //when the piece attacking is winning
        board.grid[oldCoord.x][oldCoord.z].status = 2;
        board.grid[newCoord.x][newCoord.z].status = 0;
        isMoving = true;
      }

      else if (fight.win !== undefined && fight.win == 2){
        //draw
        isMoving = false;
        board.grid[oldCoord.x][oldCoord.z].status = 0;
        board.grid[newCoord.x][newCoord.z].status = 0;
      }
    }

    //basic move
    if (isMoving){
      board.grid[oldCoord.x][oldCoord.z].move(newCoord.x, newCoord.z);
      if (fight !== undefined)
        board.grid[newCoord.x][newCoord.z].replacement = oldCoord;
      else {
        board.grid[newCoord.x][newCoord.z] = board.grid[oldCoord.x][oldCoord.z];
        board.grid[oldCoord.x][oldCoord.z] = undefined;
        board.grid[newCoord.x][newCoord.z].status = -1; // is just moving, this status is used to prevent the click events when a piece is moving
      }
    }
  };

  //=====================================================================//
  /**
   * @function Graphics.swap
   * @argument {object} coordsA
   * coordsA
   * @argument {object} coordsB
   * coordsB
   * @returns {} /
   * @description Swap two pieces
   */
  let swapCall = (coordsA, coordsB) => {
    // Change A
    board.grid[coordsA.x][coordsA.z].x = coordsB.x;
    board.grid[coordsA.x][coordsA.z].z = coordsB.z;
    
    board.grid[coordsA.x][coordsA.z].physicalPiece.position.x = coordsB.x * 0.835 - 3.757;
    board.grid[coordsA.x][coordsA.z].physicalPiece.position.z = coordsB.z * 0.835 - 3.757;

    //Change B
    board.grid[coordsB.x][coordsB.z].x = coordsA.x;
    board.grid[coordsB.x][coordsB.z].z = coordsA.z;
    
    board.grid[coordsB.x][coordsB.z].physicalPiece.position.x = coordsA.x * 0.835 - 3.757;
    board.grid[coordsB.x][coordsB.z].physicalPiece.position.z = coordsA.z * 0.835 - 3.757;
  
    // Swap the pieces in the matrix
    [board.grid[coordsB.x][coordsB.z], board.grid[coordsA.x][coordsA.z]] = [board.grid[coordsA.x][coordsA.z], board.grid[coordsB.x][coordsB.z]]
  }

  //=====================================================================//
  //=====================================================================//
  // Returned Object
  return {
    deplace: (newCoord, oldCoord, fight) => deplaceCall(newCoord, oldCoord, fight),
    swap: (coordsA, coordsB) => swapCall(coordsA, coordsB),
    createScene: (canvas, engine) => createSceneCall(canvas, engine),
    resetSwappable: () => board.resetPieceClicked(),
    startGame: () => board.setupGame(scene),
    endGame: () => board.endGame(),
    isClicked: () => pieceClicked,
    setClicked: (value) => (typeof value === "boolean") ? pieceClicked = value : Toast.error("pieceClicked got a wrong value..."),
    getStrength: (coords) => board.grid[coords[0]][coords[1]].specc
  };
})();
