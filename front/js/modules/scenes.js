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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    let txtTop = "Waiting for an opponent...";
    let grdGold = ctx.createLinearGradient(
      parseInt(canvas.width / 2 - ctx.measureText(txtTop).width / 2),
      0,
      parseInt(canvas.width / 2 + ctx.measureText(txtTop).width / 2),
      0
    );
    grdGold.addColorStop(0, "#e1ae33");
    grdGold.addColorStop(0.5, "white");
    grdGold.addColorStop(1, "#e1ae33");
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
    let username1 = "username";
    ctx.font = "normal " + parseInt(canvas.width / 40) + "pt Ancient";
    ctx.fillText(
      username1,
      parseInt(
        canvas.width / 2 -
          canvas.width / 6 -
          canvas.width / 20 -
          ctx.measureText(username1).width / 2
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
    let username2 = "?";
    ctx.fillText(
      username2,
      parseInt(
        canvas.width / 2 +
          canvas.width / 6 +
          canvas.width / 20 -
          ctx.measureText(username2).width / 2
      ),
      parseInt(canvas.height / 4 + canvas.width / 10 + canvas.width / 40)
    );

    /* Animated searching icon */
    //TODO

    /* Optional countdown on player found */
    //TODO
  };
  //=====================================================================//
  //=====================================================================//

  // Returned Object
  return {
    startMenu: (canvas, ctx) => startMenuDraw(canvas, ctx),
    waitingMenu: (canvas, ctx) => waitingMenuDraw(canvas, ctx),
    clear: (canvas, ctx) => clearCall(canvas, ctx),
  };
})();
