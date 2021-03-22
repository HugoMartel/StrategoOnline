/**
 * @file Scenes to display on index.html's canvas
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Function to use to display stuff on the canvas
 * @type {Object}
 * @return {Object} functions to use with the Request module
 * @name Scenes
 * @namespace Scenes
 */
let Scenes = (function () {
  // Intern variables
  let players = [];
  let gameReadyToStart = false;

  // Babylon variables
  let engine = undefined;
  let scene = undefined;

  /**
   * @function Scenes.clear
   * @argument {HTMLCanvasElement} canvas
   * Canvas to display elements in
   * @argument {Object} ctx
   * Canvas's context to be able to draw in
   * @returns {} /
   * @description Clear the canvas
   */
  let clearCall = (canvas, ctx) => {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.width = ctx.canvas.width;
  };

  //=====================================================================//
  /**
   * @function Scenes.startMenu
   * @argument {HTMLCanvasElement} canvas
   * Canvas to display elements in
   * @argument {Object} ctx
   * Canvas's context to be able to draw in
   * @returns {} /
   * @description Draws the start menu
   */
  let startMenuDraw = (canvas, ctx) => {
    /* Background gradient */
    //ctx.fillStyle = "#0c1821";//Main background color
    //ctx.fillStyle = "#1e2f48";//Color used for the canvas' background
    let grdBack = ctx.createRadialGradient(
      Math.round(canvas.width / 2),
      Math.round(canvas.height / 2),
      50,
      Math.round(canvas.width / 2),
      Math.round(canvas.height / 3.2),
      300
    );
    grdBack.addColorStop(0, "#1e2f48");
    grdBack.addColorStop(1, "#0c1821");
    ctx.fillStyle = grdBack;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Play button */
    ctx.font = "normal " + parseInt(canvas.width / 10) + "pt Ancient";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    let grdGold = ctx.createLinearGradient(
      Math.round(canvas.width / 2 - ctx.measureText("play").width / 2),
      0,
      Math.round(canvas.width / 2 + ctx.measureText("play").width / 2),
      0
    );
    grdGold.addColorStop(0, "#e1ae33");
    grdGold.addColorStop(0.5, "white");
    grdGold.addColorStop(1, "#e1ae33");
    ctx.fillStyle = grdGold;

    ctx.fillText(
      "play",
      Math.round(canvas.width / 2 - ctx.measureText("play").width / 2),
      Math.round(canvas.height / 3)
    );

    /* Bottom image */
    let img = document.getElementById("startMenuBottom");
    let scaleFactor = canvas.width / img.width;
    ctx.imageSmoothingEnable = false;
    ctx.drawImage(
      img,
      0,
      parseInt(canvas.height - img.height * scaleFactor),
      canvas.width,
      parseInt(img.height * scaleFactor)
    );
  };

  //=====================================================================//
  /**
   * @function Scenes.waitingMenu
   * @argument {HTMLCanvasElement} canvas
   * Canvas to display elements in
   * @argument {Object} ctx
   * Canvas's context to be able to draw in
   * @returns {} /
   * @description Draws the waiting menu
   */
  let waitingMenuDraw = (canvas, ctx) => {
    /* Background gradient */
    let grdBack = ctx.createRadialGradient(
      Math.round(canvas.width / 2),
      Math.round(canvas.height / 2),
      50,
      Math.round(canvas.width / 2),
      Math.round(canvas.height / 3.2),
      300
    );
    grdBack.addColorStop(0, "#1e2f48");
    grdBack.addColorStop(1, "#0c1821");
    ctx.fillStyle = grdBack;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Waiting for an opponent text */
    let txtTop = gameReadyToStart
      ? "Your game will start in a few seconds"
      : "Waiting for an opponent...";
    let grdGold = ctx.createLinearGradient(
      parseInt(canvas.width / 2 - ctx.measureText(txtTop).width / 2),
      0,
      parseInt(canvas.width / 2 + ctx.measureText(txtTop).width / 2),
      0
    );
    grdGold.addColorStop(0, "#e1ae33");
    grdGold.addColorStop(0.5, "white");
    grdGold.addColorStop(1, "#e1ae33");
    grdGold.textBaseline = "top";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.font = "normal " + parseInt(canvas.width / 35) + "pt Ancient";
    ctx.fillStyle = grdGold;
    ctx.fillText(
      txtTop,
      parseInt(canvas.width / 2 - ctx.measureText(txtTop).width / 2),
      parseInt(canvas.height / 8 + canvas.width / 100)
    );

    /* Players icons */
    //Icon 1
    let grdGold1 = ctx.createLinearGradient(
      parseInt(canvas.width / 2 - canvas.width / 6 - canvas.width / 10),
      0,
      parseInt(canvas.width / 2 - canvas.width / 6),
      0
    );
    grdGold1.addColorStop(0, "#e1ae33");
    grdGold1.addColorStop(0.5, "white");
    grdGold1.addColorStop(1, "#e1ae33");
    ctx.fillStyle = grdGold1;
    ctx.fillRect(
      parseInt(canvas.width / 2 - canvas.width / 6 - canvas.width / 10),
      parseInt(canvas.height / 4),
      parseInt(canvas.width / 10),
      parseInt(canvas.width / 10)
    );
    //Name 1
    ctx.font = "normal " + parseInt(canvas.width / 50) + "pt Arial";
    ctx.fillText(
      players[0],
      parseInt(
        canvas.width / 2 -
          canvas.width / 6 -
          canvas.width / 20 -
          ctx.measureText(players[0]).width / 2
      ),
      parseInt(canvas.height / 4 + canvas.width / 10 + canvas.width / 40)
    );

    //Icon 2
    let grdGold2 = ctx.createLinearGradient(
      parseInt(canvas.width / 2 + canvas.width / 6),
      0,
      parseInt(canvas.width / 2 + canvas.width / 6 + canvas.width / 10),
      0
    );
    grdGold2.addColorStop(0, "#e1ae33");
    grdGold2.addColorStop(0.5, "white");
    grdGold2.addColorStop(1, "#e1ae33");
    ctx.fillStyle = grdGold2;
    ctx.fillRect(
      parseInt(canvas.width / 2 + canvas.width / 6),
      parseInt(canvas.height / 4),
      parseInt(canvas.width / 10),
      parseInt(canvas.width / 10)
    );
    //Name 2
    ctx.fillText(
      players[1] !== undefined ? players[1] : "?",
      parseInt(
        canvas.width / 2 +
          canvas.width / 6 +
          canvas.width / 20 -
          ctx.measureText(players[1] !== undefined ? players[1] : "?").width / 2
      ),
      parseInt(canvas.height / 4 + canvas.width / 10 + canvas.width / 40)
    );

    //if (!gameReadyToStart) {
    /* Animated searching icon */
    // found on https://codepen.io/ruffiem/pen/mHylb (modified)
    sA = (Math.PI / 180) * 45;
    sE = (Math.PI / 180) * 90;

    setInterval(function () {
      ctx.lineWidth = 15;

      ctx.beginPath();
      ctx.strokeStyle = "#ffffff";
      ctx.shadowColor = "#eeeeee";
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 0;
      ctx.arc(
        parseInt(canvas.width / 2),
        parseInt((canvas.height * 3) / 4),
        25,
        0,
        360,
        false
      );
      ctx.stroke();
      ctx.closePath();

      sE += 0.05;
      sA += 0.05;

      ctx.beginPath();
      ctx.strokeStyle = "#aaaaaa";
      ctx.arc(
        parseInt(canvas.width / 2),
        parseInt((canvas.height * 3) / 4),
        25,
        sA,
        sE,
        false
      );
      ctx.stroke();
      ctx.closePath();
    }, 6);
    //}

    /* Optional countdown on player found */
    //TODO
  };

  //=====================================================================//
  /**
   * @function Scenes.gameBoard
   * @argument {HTMLCanvasElement} canvas
   * Canvas to display elements in
   * @returns {} /
   * @description Draws the waiting menu
   */
  let gameBoardDraw = () => {
    engine.runRenderLoop(() => { 
      scene.render();
    });
  };

  //=====================================================================//
  /**
   * @function Scenes.setupBabylon
   * @returns {} /
   * @description Sets everything up to make the 3D scene usable
   */
  let setupBabylonCall = () => {
    // Guetto rally way to change canvas (SUBARU)
    let container = document.getElementById("main");
    document.getElementById("canvas").remove();
    let canvas = document.createElement("canvas");
    canvas.classList.add("w-100");
    canvas.classList.add("h-100");
    canvas.id = "canvas";
    canvas.innerText = "Your browser doesn't support the canvas tag. Please update it to be able to play our game";
    container.appendChild(canvas);


    engine = new BABYLON.Engine(canvas, true);
    scene = Graphics.createScene(canvas, engine);

    window.addEventListener("resize", function () {
      engine.resize();
    });
  };

  //=====================================================================//
  //=====================================================================//

  // Returned Object
  return {
    startMenu: (canvas, ctx) => startMenuDraw(canvas, ctx),
    waitingMenu: (canvas, ctx) => waitingMenuDraw(canvas, ctx),
    gameBoard: () => gameBoardDraw(),
    clear: (canvas, ctx) => clearCall(canvas, ctx),
    addPlayer: (name) => {
      if (players.length < 2) players.push(name);
    },
    resetPlayers: () => (players = []),
    setGameReady: (isReady) => (gameReadyToStart = isReady),
    setupBabylon: () => setupBabylonCall(),
    getEngine: () => engine,
  };
})();
