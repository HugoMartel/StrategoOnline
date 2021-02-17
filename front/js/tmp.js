//TODO: TT create a blender model or find one on the net + find how to add a number on them easily
//TODO: creating a class or idk for the pieces
//TODO: need to create constructor etc to create each peices
//TODO: adding a easy way to move each pieces individualy (need to figure out what is the size of a case on the tabletop)
//TODO: Fill the constructor grid of the table, and add a way to animate pieces inside the renderLoop
//PART 2:
//TODO: check inputs, and find the best way to move the pieces, keyboard ? mouse ?
//TODO: ask the server team to link the inputs with the checking mechanism; in order to avoid strange stuff
//Then I think it might be fine

window.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas");
    let engine = new BABYLON.Engine(canvas, true);
    class Pieces{
        constructor(spec, scene, position){
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
            //args: height, diameterTop, diameterBottom, tessellation, subdivisions, scene etc
            this.physicalPiece = BABYLON.Mesh.CreateCylinder("cylinder", 1, 0.8, 0.8, 10, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
            this.physicalPiece.position.y = 0;
            this.physicalPiece.position.x = this.x * 0.84 - 3.77;
            this.physicalPiece.position.z = this.z * 0.84 - 3.76;

        }
        //only 
        move(x, z) {
            //not checking cause backend stuff
            this.x = x;
            this.z = z;
            this.physicalPiece.position.x = this.x * 0.84 - 3.77;
            this.physicalPiece.position.z = this.z * 0.84 - 3.76;
        }
    }

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
            //TODO: fill the grid with:
            //playerPieces, deux dimensions avec:
            /*[puissancePiece, [coord], [coord], [coord]]*/
            //opponentPieces 
            //[[coord], [coord], [coord], [coord]
            //filling the grid with opponent pieces:
            for(let i = 0; i < opponentPieces.lenght; ++i){
                grid[opponentPieces[i][0]][opponentPieces[i][1]] = new Pieces(-1, scene, [opponentPieces[i][0], opponentPieces[i][1]]);
            }
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
        camera.lowerRadiusLimit = 5;
        camera.upperRadiusLimit = 15;
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
        //first meshes
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height: 10});
        //TODO: find better stratego texture lmao
        const tabletop = new BABYLON.StandardMaterial("tabletop");
        tabletop.diffuseTexture = new  BABYLON.Texture("../textures/tabletop.png", scene);        
        ground.material = tabletop;
        //creating the class of every pieces:
        let test = new Pieces(2, scene, [6, 7]);
        test.move(2, 2);
        //end of the creation
        return scene;
    }
    var scene = createScene();
    //ANIMATION
    scene.registerBeforeRender(function () {

    });

    engine.runRenderLoop(() => { 
        scene.render();
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
    console.log(scene);
});