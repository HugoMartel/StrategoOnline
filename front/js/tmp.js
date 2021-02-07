//TODO: TT create a blender model or find one on the net + find how to add a number on them easily
//TODO: creating a class or idk for the pieces
//TODO: need to create constructor etc to create each peices
//TODO: adding a easy way to move each pieces individualy (need to figure out what is the size of a case on the tabletop)

//PART 2:
//TODO: check inputs, and find the best way to move the pieces, keyboard ? mouse ?
//TODO: ask the server team to link the inputs with the checking mechanism; in order to avoid strange stuff
//Then I think it might be fine
window.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas");
    let engine = new BABYLON.Engine(canvas, true);
    let createScene = () => {
        //basic
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
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
        //end of the creation
        return scene;
    }
    var scene = createScene();
    engine.runRenderLoop(() => {  
        scene.render();
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
    console.log(scene);
});