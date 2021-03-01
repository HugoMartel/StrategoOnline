//TODO: modify the constructor of the piece class in order to get the right texture for each one
//TODO: maybe try to find better coordonates for the pieces, so they end up centered
//PART 2:
//TODO: check inputs, and find the best way to move the pieces, keyboard ? mouse ?
//TODO: ask the server team to link the inputs with the checking mechanism; in order to avoid strange stuff
//Then I think it might be fine

//window.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas");
    let engine = new BABYLON.Engine(canvas, true);

    let deplace = (newCoord, oldCoord, grid) =>{
        grid[oldCoord[0]][oldCoord[1]].move(newCoord[0], newCoord[1]);
        grid[newCoord[0]][newCoord[1]] = grid[oldCoord[0]][oldCoord[1]];
        grid[oldCoord[0]][oldCoord[1]] = undefined;
    }

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

    //ce qui contient toutes les pieces en jeu et la génération des piéces physique
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
        Les Bombes (B), 6 par joueur
        */
        constructor(playerPieces, opponentPieces, scene){
            //creating the grid, full of nothing like ur damn life
            this.grid = Array(10).fill(null).map(()=>Array(10).fill(undefined));
            //importing the mesh first
            BABYLON.SceneLoader.ImportMesh("", "../mesh/", "piece.babylon", scene, (newMeshes) => {
                const mesh = BABYLON.Mesh.MergeMeshes(newMeshes);
                //filling the grid with opponent pieces, -1 as spec so the player can't see them:
                for(let i = 0; i < opponentPieces.length; ++i){
                    this.grid[opponentPieces[i][0]][opponentPieces[i][1]] = new Pieces(-1, scene, [opponentPieces[i][0], opponentPieces[i][1]], mesh);
                }
                //setting up the player pieces:
                for(let i = 0; i < playerPieces.length; ++i){
                    for(let j = 1; j < playerPieces[i].length; ++j){
                        this.grid[playerPieces[i][j][0]][playerPieces[i][j][1]] = new Pieces(playerPieces[i][0], scene, [playerPieces[i][j][0], playerPieces[i][j][1]], mesh);
                    }
                }
                //hiding the base mesh
                mesh.setEnabled(false);
            });   
        }
    }
    let createScene = () => {
        //basic
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 12, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
        //max beta angle, so the player can't look under 
        camera.upperBetaLimit = 1.2;
        //max and min radius, so you can't cross the tabletop, or go far away because ur afraid to loose
        camera.lowerRadiusLimit = 7;
        camera.upperRadiusLimit = 15;
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
        //first meshes
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height: 10});
        //TODO: find better stratego texture lmao
        const tabletop = new BABYLON.StandardMaterial("tabletop");
        tabletop.diffuseTexture = new  BABYLON.Texture("../textures/tabletop.png", scene);        
        ground.material = tabletop;
        //end of the creation
        return scene;
    }
    var scene = createScene();
    //creating the class of every pieces:
    let test = new table([
        [1, [0, 2], [1, 2]],
        [3, [0, 3], [1, 1]],
        [6, [0,0]]
    ], [[9, 9], [8, 8]], scene);
    //juste pour obtenir le tableau et check que tout est ok
    console.log(test);
    //ANIMATION
    scene.registerBeforeRender(function () {
        //on verifie le positionnement des pieces physiques comparé à leur placement sur la grid:
        for(x = 0; x < 10; ++x){
            for(z = 0; z < 10; ++z){
                if(test.grid[x][z] != undefined){
                    let coord = test.grid[x][z].check()
                    if(coord != 0){
                        //move the piece because not in the good position:
                        if(coord[0] > 0) test.grid[x][z].physicalPiece.position.x+=0.01;
                        else if(coord[0] < 0) test.grid[x][z].physicalPiece.position.x-=0.01
                        if(coord[1] > 0) test.grid[x][z].physicalPiece.position.z+=0.01;
                        else if(coord[1] < 0) test.grid[x][z].physicalPiece.position.z-=0.01;
                    }
                }
            }
        }
    });

    engine.runRenderLoop(() => { 
        scene.render();
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
    console.log(scene);
//});