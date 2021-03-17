/**
 * @file Process the load and edit of the json files
 * @version 1.0
 * @author Stratego Online
 */

//Requires
const { json } = require("body-parser");
const fs = require("fs");

/**
 * Process the load and edit of the json files
 * @type {Object}
 * @return {Object} Functions to edit and load json
 * @name Storage
 * @namespace Storage
 */
let Storage = (function () {
  /**
   * @function Storage.getData
   * @param {string} name
   * File name request
   * @returns {Object}
   * JSON Object that was stored in the file
   * @description Get the content of a JSON file
   */
  let getJSONData = function (name) {
    let data = fs.readFileSync("back/storage/" + name + ".json", "utf8");
    return JSON.parse(data);
  };

  //============================================================================
  /**
   * @function Storage.editData
   * @param {string} name
   * File name request
   * @param {array} edit
   * File edit function
   * @returns {} /
   * @description Replace the content of a JSON file with a array
   */
  let editJSONData = function (name, edit) {
    fs.readFile("back/storage/" + name + ".json", function (err, content) {
      if (err) throw err;
      let inputVar = JSON.parse(content);

      inputVar = edit;

      let json = JSON.stringify(inputVar);

      fs.writeFile(
        __dirname + "/../storage/" + name + ".json",
        json,
        "utf8",
        function (err) {
          if (err) throw err;
        }
      );
    });
  };

  //============================================================================
  /**
   * @function Storage.saveJSONData
   * @param {string} name
   * Path to define where the file should be stored
   * @param {JSON} JSONObject
   * JSON Object to save as a file
   * @returns {} /
   * @description Edit the content of a JSON file
   */
  let saveJSONData = (name, JSONObject) => {
    fs.writeFile(
      __dirname + "/../storage/" + name + ".json",
      JSON.stringify(JSONObject),
      {
        encoding: "utf8",
        flag: "w",
        mode: 0o666,
      },
      (err) => {
        if (err) throw err;
      }
    );
  };

  //============================================================================
  /**
   * @function Storage.storeLeaderboard
   * @param {array} leaderboard
   * Old informations you want to edit
   * @param {array} infoAdded
   * Line you want to add
   * @returns {} /
   * @description Edit the leaderboard to add one more line, sort it depending of the leaderbaord.score, delete last lines over the 100th
   */
  let storeLeaderboard = (leaderboard, infoAdded)=>{
    let editedLeaderboard = leaderboard;
    editedLeaderboard[editedLeaderboard.length] = infoAdded;
    editedLeaderboard.sort((a,b)=>(a.score > b.score)? -1 : 1);
    if(editedLeaderboard.length>100){
      editedLeaderboard.splice(100,editedLeaderboard.length-1);
    }
    return editedLeaderboard;
  }

  //============================================================================
  //============================================================================
  // Returned Object
  return {
    getData: (name) => getJSONData(name),
    editData: (name, edit) => editJSONData(name, edit),
    saveData: (name, JSONObject) => saveJSONData(name, JSONObject),
    storeLB: (leaderboard, infoAdded) => storeLeaderboard(leaderboard, infoAdded),
  };
})();

module.exports = Storage;
