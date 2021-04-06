/**
 * @file File used to talk to the mysql database
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Module to handle database queries
 * @type {Object}
 * @return {Object} functions to use with the Database module
 * @name Database
 * @namespace Database
 */
let Database = (function () {

  /** @constant {Object} Database.mysql Connection to the database, required to send queries to the mysql tables*/
  const mysql = require("mysql").createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "strategoonline",
  });

  //==========================================================================
  /**
   * @function Database.login
   * @param {string} email
   * email used to login to an account
   * @param {string} password
   * password hash used to login to an account
   * @param {Function} callback
   * callback function that needs the query's result to execute
   * @returns {} /
   * @description Performs a SELECT query to find an user in the database and get it's email and username
   */
  let loginCall = (email, password, callback) => {
    mysql.query(
      "SELECT Username, Login FROM logins WHERE Login=? AND Password=?;",
      [email, password],
      (err, result) => {
        if (err) throw err;

        callback(result[0] !== undefined ? {username: result[0].Username, login: result[0].Login} : undefined);

        return;
      }
    );
  };

  //==========================================================================
  /**
   * @function Database.register
   * @param {string} email
   * email used to create an account
   * @param {string} password
   * password hash used to create an account
   * @param {string} username
   * username used to create an account
   * @param {Function} callback
   * callback function that needs the query's result to execute
   * @returns {} /
   * @description Performs a INSERT query to add an user to the database
   */
  let registerCall = (email, password, username, callback) => {
    // Add the user to the db
    mysql.query(
      "INSERT INTO logins SET ?;",
      { Login: email, Password: password, Username: username },
      (err, result) => {
        if (err) throw err;

        callback(result !== undefined ? result.affectedRows : 0);

        return;
      }
    );
  };

  //==========================================================================
  /**
   * @function Database.find
   * @param {string} email
   * email used to find an account
   * @param {Function} callback
   * callback function that needs the query's result to execute
   * @returns {} /
   * @description Performs a SELECT query to get an user's email and username from the database
   */
  let findCall = (email, callback) => {
    // Check if the user already exists
    mysql.query(
      "SELECT Username, Login FROM logins WHERE Login=?;",
      [email],
      (err, result) => {
        if (err) throw err;

        callback(result[0] !== undefined ? { username: result[0].Username, login: result[0].Login } : undefined);
        
        return;
      }
    );
  };

  //==========================================================================
  /**
   * @function Database.delete
   * @param {string} email
   * email used to find an account to delete
   * @param {string} username
   * username used to find an account to delete
   * @param {Function} callback
   * callback function that needs the query's result to execute
   * @returns {} /
   * @description Performs a DELETE query to remove an user from the database
   */
  let deleteCall = (email, username, callback) => {
    mysql.query(
      "DELETE FROM logins WHERE Login=? AND Username=?;",
      [email, username],
      (err, result) => {
        if (err) throw err;
        
        callback(result !== undefined ? result.affectedRows : 0);

        return;
      }
    );
  };

  //--------------------------------------------

  // Returned Object
  return {
    login: (email, password, callback) => loginCall(email, password, callback),
    register: (email, password, username, callback) => registerCall(email, password, username, callback),
    find: (email, callback) => findCall(email, callback),
    delete: (email, username, callback) => deleteCall(email, username, callback),
    addScore: (email, score) => addScoreCall(email, score),
  };
})();

module.exports = { database: Database };
