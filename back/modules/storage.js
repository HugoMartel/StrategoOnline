/**
 * @file Process the load and edit of the json files
 * @version 1.0
 * @author Stratego Online
 */

//Requires
const fs = require("fs");

/**
 * Process the load and edit of the json files
 * @type {Object}
 * @return {Function} Functions to edit and load json
 * @name Storage
 * @namespace storage
 */

let Storage = (function () {

  /**
   * @function storage.getData
   * @param {String} name
   * File name request
   * @returns {Array} 
   * File content response
   * @description Get the content of a JSON file
   */

let getJSONData =( function (name){
  let data = fs.readFileSync('../storage/'+name+'.json','utf8')
return (JSON.parse(data));
});

 /**
   * @function storage.editData
   * @param {String} name
   * File name request
   * @param {Function} edit
   * File edit function
   * @returns {} /
   * 
   * @description Edit the content of a JSON file with a function
   */

let editJSONData = (function (name, edit){
  fs.readFile('../storage/'+name+'.json',function(err,content){
    if(err) throw err;
    let inputVar = JSON.parse(content);
  
    inputVar = edit(inputVar);
  
    let json = JSON.stringify(inputVar);
  
    fs.writeFile('../storage/'+name+'.json',json,'utf8',function(err) {
      if (err) throw err;
    })
  })
})

return {
  getData: (name) => getJSONData(name),
  editData: (name, edit) => editJSONData(name, edit),
};

})();

module.exports = { storage: Storage };
