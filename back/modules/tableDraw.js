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
 * @namespace TableDraw
 */

let TableDraw = (function () {
    return{
        /**
          * @function tabledraw.draw
          * @param {Number} number
          * Number of displayed line
          * @param {Array} data
          * The data we display
          * @param {Function} line
          * The function which return an html line of our data 
          * @returns {String} 
          * return the html code of the wanted table
          * @description Generate an html table with given lenght, data, html line and and html ID
        */
        draw(number, data, line) {
            let table;
            table += "<tbody>";
            if(number <= data.length){
                for (let i = 1; i <= number; i++) {
                    table += line(i, data);
                }
            }else{
                for (let i = 1; i <= data.length; i++) {
                    table += line(i, data);
                }
            }
            table += "</tbody>";
            return table;
        }
    }
})();

module.exports = TableDraw;
