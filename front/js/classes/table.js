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
    Flag (12), 1 per player
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
      "../../mesh/",
      "piece.babylon",
      scene,
      (newMeshes) => {
        //loading and setting up variables for the textures
        let bottomPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        bottomPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/top.png",
          scene
        );
        let topPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        topPlayerColor.diffuseTexture = new BABYLON.Texture(
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
        let marechalTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        marechalTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/10.png",
          scene
        );
        let generalPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        generalPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/9.png",
          scene
        );
        let generalTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        generalTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/9.png",
          scene
        );
        let colonelPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        colonelPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/8.png",
          scene
        );
        let colonelTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        colonelTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/8.png",
          scene
        );
        let commandantPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        commandantPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/7.png",
          scene
        );
        let commandantTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        commandantTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/7.png",
          scene
        );
        let captainePlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        captainePlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/6.png",
          scene
        );
        let captaineTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        captaineTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/6.png",
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
        let lieuteunantTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        lieuteunantTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/5.png",
          scene
        );
        let sergentPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        sergentPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/4.png",
          scene
        );
        let sergentTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        sergentTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/4.png",
          scene
        );
        let demineurPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        demineurPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/3.png",
          scene
        );
        let demineurTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        demineurTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/3.png",
          scene
        );
        let eclaireurPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        eclaireurPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/2.png",
          scene
        );
        let eclaireurTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        eclaireurTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/2.png",
          scene
        );
        let spyPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        spyPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/1.png",
          scene
        );
        let spyTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        spyTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/1.png",
          scene
        );
        let flagPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        flagPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/0.png",
          scene
        );
        let flagTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        flagTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/12.png",
          scene
        );
        let BombPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        BombPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cube/b.png",
          scene
        );
        let bombTopPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
        bombTopPlayerColor.diffuseTexture = new BABYLON.Texture(
          "/textures/pieces/Blue/Cylinder/11.png",
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
            [opponentPieces[i][0], opponentPieces[i][1]],
            mesh
          );
          //removing the base mesh assembled
          mesh.dispose();
        }
        //setting up the player's pieces:
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
                bottom.material = marechalTopPlayerColor;
                break;
              case 9:
                mid.material = generalPlayerColor;
                bottom.material = generalTopPlayerColor;
                break;
              case 8:
                mid.material = colonelPlayerColor;
                bottom.material = colonelTopPlayerColor;
                break;
              case 7:
                mid.material = commandantPlayerColor;
                bottom.material = commandantTopPlayerColor;
                break;
              case 6:
                mid.material = captainePlayerColor;
                bottom.material = captaineTopPlayerColor;
                break;
              case 5:
                mid.material = lieuteunantPlayerColor;
                bottom.material = lieuteunantTopPlayerColor;
                break;
              case 4:
                mid.material = sergentPlayerColor;
                bottom.material = sergentTopPlayerColor;
                break;
              case 3:
                mid.material = demineurPlayerColor;
                bottom.material = demineurTopPlayerColor;
                break;
              case 2:
                mid.material = eclaireurPlayerColor;
                bottom.material = eclaireurTopPlayerColor;
                break;
              case 1:
                mid.material = spyPlayerColor;
                bottom.material = spyTopPlayerColor;
                break;
              case 12:
                mid.material = flagPlayerColor;
                bottom.material = flagTopPlayerColor;
                break;
              case 11:
                mid.material = BombPlayerColor;
                bottom.material = bombTopPlayerColor;
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
            //adding parameter to allow us to pick mesh
            mesh.isPickable = true;
            this.grid[playerPieces[i][j][0]][
              playerPieces[i][j][1]
            ] = new Pieces(
              playerPieces[i][0],
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
    scene.onPointerDown = function (evt, pickResult) {
      // We try to pick an object
      if (pickResult.hit) {
          console.log("tu m'as eu!");
      }
    };
  }
}
