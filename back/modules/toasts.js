/**
 * @file Notification display using Notyf {@link https://www.carlosroso.com/notyf/}
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Module to insert notification snippets
 * @type {Object}
 * @return {Object} functions to use with the Toast module
 * @name Toast
 * @namespace Toast
 */
let Toast = (function () {
  //Consts
  /** @constant {string} Toast.duration Notification's JSON duration object to add to display it correctly*/
  const duration = "duration: 2500";
  /** @constant {string} Toast.position Notification's JSON position object to add to display it correctly*/
  const position = "position: {x: 'center', y: 'top'}";

  // Nested functions

  /**
   * @function Toast.error
   * @param {string} message
   * message to add to the notification
   * @returns {string} HTML <script> to display the notification
   * @description Generates the HTML code to insert to the page to display an error notification with a given message
   */
  let errorCall = function (message) {
    return `<script>let notyf = new Notyf({${duration}, ${position}}); notyf.error('${message}');</script>`;
  };

  //Returned object
  return {
    error: (message) => errorCall(message),
  };
})();

module.exports = Toast;
