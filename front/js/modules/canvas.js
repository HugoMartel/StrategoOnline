/**
 * @file Canvas manipulation toolbox
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Function to use to display stuff on the canvas
 * @type {Object}
 * @return {Object} functions to use with the Request module
 * @name Canvas
 * @namespace Canvas
 */
let Canvas = (function () {
  /*
  Variables to use in every function
  */
  let canvas;
  let ctx;
  let currentScene = 0;
  // used to draw a rectangle around the play button
  let playButtonSelected = false;

  /*
  Static functions to use as callback (EventListeners)
  */
  let playButtonClickedCallback = (event) => {
    event.preventDefault();

    let clickCoords = Canvas.getCursorPosition(event);

    // If the play button is pressed
    /* 1920x1080 resolution -> button between : 1100-810 x 315-165 */
    if (
      clickCoords[0] <=
        Math.round(canvas.width / 2 + ctx.measureText("play").width / 2) &&
      clickCoords[0] >=
        Math.round(canvas.width / 2 - ctx.measureText("play").width / 2) &&
      clickCoords[1] <= Math.round(canvas.height / 3) &&
      clickCoords[1] >=
        Math.round(canvas.height / 3 - parseInt(canvas.width / 10))
    ) {
      //Inform the server that someone wants to play
      socket.emit("newGame"); //TODO add args ?

      //Remove the events attached to the start menu
      canvas.removeEventListener("click", playButtonClickedCallback);
      canvas.removeEventListener("mousemove", playButtonHoveredCallback);
      document.getElementById("startMenuBottom").remove();

      //Change the canvas scene
      Scenes.clear(canvas, ctx);
      currentScene = 1;
      drawCanvasCall();
      //TODO
    }
  };

  //=====================================================================

  let playButtonHoveredCallback = (event) => {
    event.preventDefault();

    let clickCoords = Canvas.getCursorPosition(event);

    // If the play button is pressed
    /* 1920x1080 resolution -> button between : 1100-810 x 315-165 */
    if (
      clickCoords[0] <=
        Math.round(canvas.width / 2 + ctx.measureText("play").width / 2) &&
      clickCoords[0] >=
        Math.round(canvas.width / 2 - ctx.measureText("play").width / 2) &&
      clickCoords[1] <= Math.round(canvas.height / 3) &&
      clickCoords[1] >= Math.round(canvas.height / 3 - canvas.width / 10)
    ) {
      if (playButtonSelected === false) {
        playButtonSelected = true;

        // Put a rectangle around the play button
        let grdText = ctx.createLinearGradient(
          Math.round(canvas.width / 2 - ctx.measureText("play").width / 2),
          0,
          Math.round(canvas.width / 2 + ctx.measureText("play").width / 2),
          0
        );
        grdText.addColorStop(0, "#e1ae33");
        grdText.addColorStop(0.5, "white");
        grdText.addColorStop(1, "#e1ae33");
        ctx.fillStyle = grdText;
        ctx.fillRect(
          Math.round(canvas.width / 2 - ctx.measureText("play").width / 2),
          Math.round(canvas.height / 3 + parseInt(canvas.width / 30)),
          ctx.measureText("play").width,
          5
        );
      }
    } else {
      if (playButtonSelected === true) {
        playButtonSelected = false;

        //Clear the rectangle
        drawCanvasCall();
      }
    }
  }

  //****************************************************************
  //****************************************************************

  /**
   * @function Canvas.getCursorPosition
   * @param {Event} event
   * event storing the mouse's coordinates
   * @returns {Number[]} Coordinates converted for the canvas
   * @description Converts the event coords to canvas coords
   */
  let getCursorPositionCall = function (event) {
    const rect = canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  };

  //=====================================================================
  /**
   * @function Canvas.firstSetup
   * @returns {} /
   * @description Converts the event coords to canvas coords
   */
  let startMenuSetupCall = function () {
    // Canvas related
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    //**************
    //*   EVENTS   *
    //**************
    /* Redisplay the canvas if the window is resized */
    window.addEventListener("resize", Canvas.resizeCanvas);

    /* Starts the game if the play button is clicked */
    canvas.addEventListener("click", playButtonClickedCallback);

    /* Add some visuals to the play button */
    canvas.addEventListener("mousemove", playButtonHoveredCallback);

    Canvas.resizeCanvas();
  };

  //=====================================================================
  /**
   * @function Canvas.drawCanvas
   * @returns {} /
   * @description Draws the correct scene onto the canvas
   */
  let drawCanvasCall = () => {
    switch (currentScene) {
      case 0:
        Scenes.startMenu(canvas, ctx);
        break;
      case 1:
        Scenes.waitingMenu(canvas, ctx);
        break;
      default:
        Scenes.clear(canvas, ctx);
        break;
    }
  }


  //=====================================================================
  /**
   * @function Canvas.resizeCanvas
   * @returns {} /
   * @description Make the canvas fit the screen resolution
   */
  function resizeCanvasCall() {
    /* 16:9 format */
    canvas.width = window.innerWidth;
    canvas.height = parseInt((window.innerWidth * 7) / 16); //16:9 minus navbar

    /* Canvas display */
    drawCanvasCall();
  }

  // Returned object
  return {
    getCursorPosition: (event) => getCursorPositionCall(event),
    startMenuSetup: () => startMenuSetupCall(),
    drawCanvas: () => drawCanvasCall(),
    resizeCanvas: () => resizeCanvasCall(),
  };
})();
