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
    const scene = new BABYLON.Scene(engine);
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
   * @returns {} /
   * @description Sets everything up to make the 3D scene usable
   */
  let deplaceCall = (newCoord, oldCoord) => {
    board.grid[oldCoord[0]][oldCoord[1]].move(newCoord[0], newCoord[1]);
    board.grid[newCoord[0]][newCoord[1]] = board.grid[oldCoord[0]][oldCoord[1]];
    board.grid[oldCoord[0]][oldCoord[1]] = undefined;
  };

  //=====================================================================//
  //=====================================================================//

  // Returned Object
  return {
    deplace: (newCoord, oldCoord) => deplaceCall(newCoord, oldCoord),
    createScene: (canvas, engine) => createSceneCall(canvas, engine),
    isClicked: () => pieceClicked,
    setClicked: (value) => (typeof value === "boolean")? pieceClicked = value: Toast.error("pieceClicked got a wrong value..."),
  };
})();
