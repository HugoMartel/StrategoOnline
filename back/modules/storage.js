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
   * @param {Function} edit
   * File edit function
   * @returns {} /
   * @description Edit the content of a JSON file with a function
   */
  let editJSONData = function (name, edit) {
    fs.readFile("../storage/" + name + ".json", function (err, content) {
      if (err) throw err;
      let inputVar = JSON.parse(content);

      inputVar = edit(inputVar);

      let json = JSON.stringify(inputVar);

      fs.writeFile(
        __dirname + "/back/storage/" + name + ".json",
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
   * @function Storage.editData
   * @param {string} name
   * Path to define where the file should be stored
   * @param {JSON} JSONObject
   * JSON Object to save as a file
   * @returns {} /
   * @description Edit the content of a JSON file with a function
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
  //============================================================================
  // Returned Object
  return {
    getData: (name) => getJSONData(name),
    editData: (name, edit) => editJSONData(name, edit),
    saveData: (name, JSONObject) => saveJSONData(name, JSONObject),
  };
})();

module.exports = Storage;
