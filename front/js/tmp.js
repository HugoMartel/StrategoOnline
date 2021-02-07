window.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("canvas");
    let engine = new BABYLON.Engine(canvas, true);
    let createScene = () =>{
        //basic
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI, Math.PI / 3, 3, new BABYLON.Vector3(-5, 5, 0), scene);
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        //first meshes
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height: 10});
        //TODO: texture of the stratego
        //end of the creation
        return scene;
    }
    var scene = createScene();
    engine.runRenderLoop(() => {      
        scene.render();
    });
    //TMP
    window.addEventListener("resize", function () {
        engine.resize();
    });
});