class Pieces{
    constructor(spec, scene, position, mesh){
        //spec = the number of the piece, or a char if it is a mine
        //scene, the babylonjs scene
        //position: table [X, Y], both are between 0 and 9
        /*
        +-----+-----+-----+-----+
        | 0,9 | 1,9 | ... | 9,9 |
        +-----+-----+-----+-----+
        | ... | ... | ... | ... |
        | 0,1 | 1,1 | ... | 9,1 |
        | 0,0 | 1,0 | ... | 9,0 |
        +-----+-----+-----+-----+
        */
        this.specc = spec;
        this.x = position[0];
        this.z = position[1];
        //this.physicalPiece = BABYLON.Mesh.CreateCylinder("cylinder", 1, 0.8, 0.8, 10, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        //cloning the base mesh:
        this.physicalPiece = mesh.clone("clonedPiece");
        //rescaling it, so it doesn't look like it's straight away from hell
        this.physicalPiece.scaling.x = 0.38;
        this.physicalPiece.scaling.y = 0.38;
        this.physicalPiece.scaling.z = 0.38;
        //making it looking in the right direction
        this.physicalPiece.rotation.y = Math.PI /2;
        //settting up it's position
        this.physicalPiece.position.y = 0;
        this.physicalPiece.position.x = this.x * 0.835 - 3.757;
        this.physicalPiece.position.z = this.z * 0.835 - 3.757;
    }

    //only moving the coordonate inside the class, not the physical piece
    move(x, z) {
        //not checking cause backend stuff
        this.x = x;
        this.z = z;
    }

    //check if the physical piece coords are the same as the coord (check if we need to move the physical piece)
    //return 0 if no difference, else it return the array with the difference coords
    check = () => {
        let retour = [0, 0]
        if(this.x * 0.835 - 3.757 != this.physicalPiece.position.x){
            retour[0] = (this.x * 0.835 - 3.757)- this.physicalPiece.position.x;
        }
        if(this.z * 0.835 - 3.757 != this.physicalPiece.position.z){
            retour[1] = (this.z * 0.835 - 3.757) - this.physicalPiece.position.z;
        }
        if(retour[0] == 0 && retour [1] == 0) return 0;
        return retour;
    }
}

//important
class table{
    /*    
    le Maréchal (10), 1 par joueur
    le Général (9), 1 par joueur
    les Colonels (8), 2 par joueur
    les Commandants (7), 3 par joueur
    les Capitaines (6), 4 par joueur
    les Lieutenants (5), 4 par joueur
    les Sergents (4), 4 par joueur
    les Démineurs (3), 5 par joueur
    les Éclaireurs (2), 8 par joueur
    l'Espion (1), 1 par joueur
    le Drapeau (0), 1 par joueur
    Les Bombes (11), 6 par joueur
    */
    constructor(playerPieces, opponentPieces, scene){
        //creating the grid, full of nothing like ur damn life
        this.grid = Array(10).fill(null).map(()=>Array(10).fill(undefined));
        //importing the mesh first
        BABYLON.SceneLoader.ImportMesh("", "../mesh/", "piece.babylon", scene, (newMeshes) => {
            //loading and setting up variables for the textures
            var topPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            topPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cylinder/top.png", scene);
            var bottomPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            bottomPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cylinder/bottom.png", scene);
            var opponentColor = new BABYLON.StandardMaterial("mat0", scene);
            opponentColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Red/Cube/Cube.png", scene);
            var topOpponentColor = new BABYLON.StandardMaterial("mat0", scene);
            topOpponentColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Red/Cylinder/top.png", scene);
            var bottomOpponentColor = new BABYLON.StandardMaterial("mat0", scene);
            bottomOpponentColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Red/Cylinder/bottom.png", scene);
            //opponentColor.diffuseColor = new BABYLON.Color3(1.00, 0.29, 0.20);
            //loading the textures
            var marechalPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            marechalPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/10.png", scene);
            var generalPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            generalPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/9.png", scene);
            var colonelPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            colonelPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/8.png", scene);
            var commandantPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            commandantPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/7.png", scene);
            var captainePlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            captainePlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/6.png", scene);
            var lieuteunantPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            lieuteunantPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/5.png", scene);
            var sergentPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            sergentPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/4.png", scene);
            var demineurPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            demineurPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/3.png", scene);
            var eclaireurPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            eclaireurPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/2.png", scene);
            var spyPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            spyPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/1.png", scene);
            var flagPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            flagPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/0.png", scene);
            var BombPlayerColor = new BABYLON.StandardMaterial("mat0", scene);
            BombPlayerColor.diffuseTexture = new BABYLON.Texture("/textures/pieces/Blue/Cube/B.png", scene);
            
            
            //
        //filling the grid with opponent pieces, 69420 as spec so the player can't see them:
            for(let i = 0; i < opponentPieces.length; ++i){
                let top = newMeshes[0].clone("no");
                let mid = newMeshes[1].clone("no");
                let bottom = newMeshes[2].clone("no");
                top.material = topOpponentColor;
                bottom.material = bottomOpponentColor;
                mid.material = opponentColor;
                //creating the assembly
                let mesh = BABYLON.Mesh.MergeMeshes([top, mid, bottom], true, false, null, false, true);
                this.grid[opponentPieces[i][0]][opponentPieces[i][1]] = new Pieces(69420, scene, [opponentPieces[i][0], opponentPieces[i][1]], mesh);
                //removing the base mesh assembled
                mesh.dispose();
            }
            //setting up the player pieces:
            for(let i = 0; i < playerPieces.length; ++i){
                for(let j = 1; j < playerPieces[i].length; ++j){
                    let top = newMeshes[0].clone("no");
                    let mid = newMeshes[1].clone("no");
                    let bottom = newMeshes[2].clone("no");
                    top.material = topPlayerColor;
                    bottom.material = bottomPlayerColor;
                    switch(playerPieces[i][0]){
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
                    }
                    //assembling the new mesh with the good textures
                    let mesh = BABYLON.Mesh.MergeMeshes([top, mid, bottom], true, false, null, false, true);
                    this.grid[playerPieces[i][j][0]][playerPieces[i][j][1]] = new Pieces(playerPieces[i][0], scene, [playerPieces[i][j][0], playerPieces[i][j][1]], mesh);
                    //removing the base mesh assembled
                    mesh.dispose();
                }
            }
            //assembling and removing the imported one
            let deleted = BABYLON.Mesh.MergeMeshes(newMeshes);
            deleted.dispose();
        });   
    }
}