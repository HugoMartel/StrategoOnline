/**
 * @file Table Class
 * @version 1.0
 * @author Stratego Online
 */

/** Class used to store all the pieces' position on the board */
class Table {
  /*    
    Marshal (10), 1 per player
    General (9), 1 per player
    Colonels (8), 2 per player
    Majors (7), 3 per player
    Captains (6), 4 per player
    Lieutenants (5), 4 per player
    Sergeants (4), 4 per player
    Miners (3), 5 per player
    Scouts (2), 8 per player
    Spy (1), 1 per player
    Flag (0), 1 per player
    Bombs (11), 6 per player
    =====================================
    TOTAL: 40 pieces
    */

  /**
   * Creates the Table storing all the pieces info on the board
   * @param {Object[]} playerPieces client' pieces' position sorted by type
   * @param {Object[]} opponentPieces opponent's pieces position with no type
   * @param {Object} scene Babylonjs 3D Scene 
   */
  constructor(playerPieces, opponentPieces, scene) {
    //creating the grid, full of nothing like ur damn life
    this.grid = Array(10)
      .fill(null)
      .map(() => Array(10).fill(undefined));
    //importing the mesh first
    BABYLON.SceneLoader.ImportMesh(
      "",
      "mesh/",
      "piece.babylon",
      scene,
      (newMeshes) => {
        console.log(newMeshes);

        //loading and setting up variables for the textures
        let topPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        topPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/top.png",
          scene
        );
        let bottomPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        bottomPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/bottom.png",
          scene
        );
        let opponentColor = new BABYLON.StandardMaterial("mat0", scene);
        opponentColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cube/Cube.png",
          scene
        );
        let topOpponentColor = new BABYLON.StandardMaterial("mat0", scene);
        topOpponentColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/top.png",
          scene
        );
        let bottomOpponentColor = new BABYLON.StandardMaterial("mat0", scene);
        bottomOpponentColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Red/Cylinder/bottom.png",
          scene
        );
        //opponentColor.diffuseColor = new BABYLON.Color3(1.00, 0.29, 0.20);
        //loading the textures
        let marechalPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        marechalPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/10.png",
          scene
        );
        let generalPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        generalPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/9.png",
          scene
        );
        let colonelPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        colonelPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/8.png",
          scene
        );
        let commandantPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        commandantPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/7.png",
          scene
        );
        let captainePlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        captainePlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/6.png",
          scene
        );
        let lieuteunantPlayerColor = new BABYLON.StandardMaterial(
          "mat0",
          scene
        );
        lieuteunantPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/5.png",
          scene
        );
        let sergentPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        sergentPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/4.png",
          scene
        );
        let demineurPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        demineurPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/3.png",
          scene
        );
        let eclaireurPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        eclaireurPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/2.png",
          scene
        );
        let spyPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        spyPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/1.png",
          scene
        );
        let flagPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        flagPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/0.png",
          scene
        );
        let BombPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        BombPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/b.png",
          scene
        );

        //filling the grid with opponent pieces, 69420 as spec so the player can't see them:
        for (let i = 0; i < opponentPieces.length; ++i) {
          let top = newMeshes[0].clone();
          let mid = newMeshes[1].clone();
          let bottom = newMeshes[2].clone();
          top.material = topOpponentColor;
          bottom.material = bottomOpponentColor;
          mid.material = opponentColor;
          //creating the assembly
          let mesh = BABYLON.Mesh.MergeMeshes(
            [top, mid, bottom],
            true,
            false,
            null,
            false,
            true
          );
          this.grid[opponentPieces[i][0]][opponentPieces[i][1]] = new Pieces(
            69420,
            scene,
            [opponentPieces[i][0], opponentPieces[i][1]],
            mesh
          );
          //removing the base mesh assembled
          mesh.dispose();
        }
        //setting up the player pieces:
        for (let i = 0; i < playerPieces.length; ++i) {
          for (let j = 1; j < playerPieces[i].length; ++j) {
            let top = newMeshes[0].clone("no");
            let mid = newMeshes[1].clone("no");
            let bottom = newMeshes[2].clone("no");
            top.material = topPlayerColor;
            bottom.material = bottomPlayerColor;
            switch (playerPieces[i][0]) {
              case 10:
                mid.material = marechalPlayerColor;
                break;
              case 9:
                mid.material = generalPlayerColor;
                break;
              case 8:
                mid.material = colonelPlayerColor;
                break;
              case 7:
                mid.material = commandantPlayerColor;
                break;
              case 6:
                mid.material = captainePlayerColor;
                break;
              case 5:
                mid.material = lieuteunantPlayerColor;
                break;
              case 4:
                mid.material = sergentPlayerColor;
                break;
              case 3:
                mid.material = demineurPlayerColor;
                break;
              case 2:
                mid.material = eclaireurPlayerColor;
                break;
              case 1:
                mid.material = spyPlayerColor;
                break;
              case 0:
                mid.material = flagPlayerColor;
                break;
              case 11:
                mid.material = BombPlayerColor;
                break;
              default:
                break;
            }
            //assembling the new mesh with the good textures
            let mesh = BABYLON.Mesh.MergeMeshes(
              [top, mid, bottom],
              true,
              false,
              null,
              false,
              true
            );
            this.grid[playerPieces[i][j][0]][
              playerPieces[i][j][1]
            ] = new Pieces(
              playerPieces[i][0],
              scene,
              [playerPieces[i][j][0], playerPieces[i][j][1]],
              mesh
            );
            //removing the base mesh assembled
            mesh.dispose();
          }
        }
        //assembling and removing the imported one
        let deleted = BABYLON.Mesh.MergeMeshes(newMeshes);
        deleted.dispose();
      }
    );
  }
}
