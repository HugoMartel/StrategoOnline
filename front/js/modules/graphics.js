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
  let pieceClicked = false;
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
      "../../textures/tabletop.png",
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
    console.log(board);
    //deplaceCall([5, 5], [1, 1], undefined);
    scene.registerBeforeRender(function () {
      // Checking the position of each 3D Piece whith its board.grid position
      for (x = 0; x < 10; ++x) {
        for (z = 0; z < 10; ++z) {
          if (board.grid[x][z] != undefined) {
            let coord = board.grid[x][z].check();
            if (coord != 0) {
              //move the piece because not in the good position:
              if (coord[0] > 0)
                board.grid[x][z].physicalPiece.position.x += 0.01;
              else if (coord[0] < 0)
                board.grid[x][z].physicalPiece.position.x -= 0.01;
              if (coord[1] > 0)
                board.grid[x][z].physicalPiece.position.z += 0.01;
              else if (coord[1] < 0)
                board.grid[x][z].physicalPiece.position.z -= 0.01;
            }
            //if reveal
            if(board.grid[x][z].status == 3 || board.grid[x][z].status == 4 || board.grid[x][z].status == 0){
              //the reveal rotation (ye cool stuff)
              if(board.grid[x][z].physicalPiece.rotation.y <= 3*Math.PI / 2) board.grid[x][z].physicalPiece.rotation.y += 0.01;
              else if(board.grid[x][z].status == 3){
                board.grid[x][z].physicalPiece.rotation.y = 3 * Math.PI / 2;
                board.grid[x][z].status = 1;
              }
            }
            //if ded
            if(board.grid[x][z].status == 4 || board.grid[x][z].status == 0){
              //ded
              if(board.grid[x][z].physicalPiece.position.y > -20) board.grid[x][z].physicalPiece.position.y -= 0.05;
              else{
                //removing the mesh
                board.grid[x][z].physicalPiece.dispose();
                //removing the piece from the grid
                board.grid[x][z] = undefined;
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
   * If the deplace needs a fight animation, add args to enable the animation
   * object: {enemyCoord: array [x, z],
   * winner: 1 if the attackers win, or 2 if it's a draw, or 0 if it's a loose
   * enemyStrength: used for the reveal of the piece
   * }
   * @returns {} /
   * @description Sets everything up to make the 3D scene usable
   */
  let deplaceCall = (newCoord, oldCoord, fight) => {
    //if fight
    //fight = {winner: 0/1/2, enemyValue: Number, enemyCoord = [x, z] array}
    //winner = 0 => the attacker is the looser, winner == 1 then the attackers win and if winner == 2 so draw
    let isMoving = true;
    console.log(board);
    if(fight !== undefined){
      let enemyColor = new BABYLON.StandardMaterial("mat0", scene);
      let enemyTopColor = new BABYLON.StandardMaterial("mat0", scene);
      //loading the textures of the enemy piece
      //todo: fix that
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
      //TODO: fix that 
      //appllying the new texture:
      board.grid[fight.enemyCoord[0]][fight.enemyCoord[1]].physicalPiece.subMeshes[1].material = enemyColor;
      board.grid[fight.enemyCoord[0]][fight.enemyCoord[1]].physicalPiece.subMeshes[2].material = enemyTopColor;

      if (fight !== undefined && fight.win !== undefined && fight.win == 0) {
        //when the piece attacking is loosing (looser)
        //piece attacking is ded
        board.grid[oldCoord[0]][oldCoord[1]].status = 0;
        //initiating the reveal of the enemy piece
        board.grid[fight.enemyCoord[0]][fight.enemyCoord[1]].status = 3;
        //maybe remove that line
        board.grid[fight.enemyCoord[0]][fight.enemyCoord[1]].physicalPiece.rotation.y +=0.01;
        isMoving = false;
      }

      else if (fight !== undefined && fight.win !== undefined && fight.win == 1) {
        //when the piece attacking is winning
        board.grid[oldCoord[0]][oldCoord[1]].status = 3;
        board.grid[fight.enemyCoord[0]][fight.enemyCoord[1]].status = 0;
        isMoving = true;
      }

      else if(fight !== undefined && fight.win !== undefined && fight.win == 2){
        //draw
        isMoving = false;
        board.grid[oldCoord[0]][oldCoord[1]].status = 4;
        board.grid[fight.enemyCoord[0]][fight.enemyCoord[1]].status = 0;
      }
    }

    //basic move
    if(isMoving){
      board.grid[oldCoord[0]][oldCoord[1]].move(newCoord[0], newCoord[1]);
      board.grid[newCoord[0]][newCoord[1]] = board.grid[oldCoord[0]][oldCoord[1]];
      board.grid[oldCoord[0]][oldCoord[1]] = undefined;
    }
  };

  //=====================================================================//
  //=====================================================================//

  // Returned Object
  return {
    deplace: (newCoord, oldCoord, fight) => deplaceCall(newCoord, oldCoord, fight),
    createScene: (canvas, engine) => createSceneCall(canvas, engine),
    isClicked: () => pieceClicked,
    setClicked: (value) => (typeof value === "boolean")? pieceClicked = value: Toast.error("pieceClicked got a wrong value..."),
  };
})();
