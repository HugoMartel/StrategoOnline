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
  // used to draw a rectangle around the play button
  let playButtonSelected = false;

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
    canvas.addEventListener("click", (event) => {
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
        /*
          canvas.removeEventListener("click", playButtonClick);
          canvas.removeEventListener("mousemove", playButtonHover);
          document.getElementById("startMenuBottom").deleteElement();
          // change the resize function ?
          */

        //Proceed to the opponent waiting screen
        //Change the canvas
        //TODO
      }
    });

    /* Add some visuals to the play button */
    canvas.addEventListener("mousemove", (event) => {
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
          Canvas.drawCanvas();
        }
      }
    });

    Canvas.resizeCanvas();
  };

  //=====================================================================
  /**
   * @function Canvas.drawCanvas
   * @returns {} /
   * @description Function to refresh the canvas' display
   */
  function drawCanvasCall() {
    /* Background gradient */
    //ctx.fillStyle = "#0c1821";
    //ctx.fillStyle = "#1e2f48";

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
    Canvas.drawCanvas();
  }

  // Returned object
  return {
    getCursorPosition: (event) => getCursorPositionCall(event),
    startMenuSetup: () => startMenuSetupCall(),
    drawCanvas: () => drawCanvasCall(),
    resizeCanvas: () => resizeCanvasCall(),
  };
})();
