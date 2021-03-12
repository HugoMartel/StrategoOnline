/**
 * @file Notification display using Notyf {@link https://www.carlosroso.com/notyf/}
 * @version 1.0
 * @author Stratego Online
 */

/**
 * Module to display notification
 * @type {Object}
 * @return {Object} functions to use with the Toast module
 * @name Toast
 * @namespace Toast
 */
let Toast = (function () {
  //Consts
  /** @constant {number} Toast~duration Notification's JSON duration amount to add to display it correctly*/
  const duration = 2500;
  /** @constant {Object} Toast~position Notification's JSON position object to add to display it correctly*/
  const position = { x: "center", y: "top" };

  // Nested functions

  /**
   * @function Toast.error
   * @param {string} message
   * message to add to the notification
   * @returns {} /
   * @description Generates the HTML code to insert to the page to display an error notification with a given message
   */
  let errorCall = function (message) {
    let notyf = new Notyf({ duration: duration, position: position });
    notyf.error(message);
  };

  //=============================================================================
  /**
   * @function Toast.error
   * @param {string} message
   * message to add to the notification
   * @returns {} /
   * @description Generates the HTML code to insert to the page to display an error notification with a given message
   */
  let successCall = function (message) {
    let notyf = new Notyf({ duration: duration, position: position });
    notyf.success(message);
  };

  //=============================================================================
  //=============================================================================
  //Returned object
  return {
    error: (message) => errorCall(message),
    success: (message) => successCall(message),
  };
})();
