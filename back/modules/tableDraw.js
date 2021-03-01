/**
 * @file Process draw of html table
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Process draw of html table
 * @type {Object}
 * @return {} functions to use to generate html table
 * @name tableDraw
 * @namespace tabledraw
 */

let tableDraw = (function () {
    return{
        /**
          * @function tabledraw.draw
          * @param {Number} number
          * Number of displayed line
          * @param {Array} data
          * The data we display
          * @param {Function} line
          * The function which return an html line of our data 
          * @param {String} id
          * The id of the table yo uwant to complete
          * @returns {} /
          * 
          * @description Generate an html table with given lenght, data, html line and and html ID
        */
        draw(number, data, line, id) {
            let table = document.getElementById(id);
            table.innerHTML += "<tbody>";
            if(number <= data.lenght){
                for (let i = 0; i < number; i++) {
                    table.innerHTML += line(i);
                }
            }else{
                for (let i = 0; i < data.lenght; i++) {
                    table.innerHTML += line(i);
                }
            }
            table.innerHTML += "</tbody>";
        }
    }
})();

module.exports = { tabledraw: tableDraw };
