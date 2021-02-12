let Database = (function () {
  const mysql = require("mysql").createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "strategoonline",
  });

  let connectCall = () => {
    mysql.connect((err) => {
      if (err) throw err;
      console.log("Database".bold + " connected as " + mysql.threadId);
      //! NEVER DISCONNECTS
    });
  };

  let loginCall = (email, password, callback) => {
    mysql.query(
      "SELECT Username FROM logins WHERE Login=? AND Password=?;",
      [email, password],
      (err, result) => {
        if (err) throw err;

        if (result[0] !== undefined) callback(result[0].Username);
        else callback(undefined);

        return;
      }
    );
  };

  let registerCall = (email, password, username, callback) => {
    // Add the user to the db
    mysql.query(
      "INSERT INTO logins SET ?;",
      { Login: email, Password: password, Username: username },
      (err, result) => {
        if (err) throw err;
        
        if (result !== undefined) callback(result.affectedRows);
        else callback(undefined);

        return;
      }
    );
  };

  let findCall = (email, callback) => {
    // Check if the user already exists
    mysql.query(
      "SELECT Username FROM logins WHERE Login=?",
      [email],
      (err, result) => {
        if (err) throw err;

        if (result[0] !== undefined) callback(result[0].Username);
        else callback(undefined);
        return;
      }
    );
  };

  //--------------------------------------------

  return {
    connect: () => connectCall(),
    login: (email, password, callback) => loginCall(email, password, callback),
    register: (email, password, username, callback) =>
      registerCall(email, password, username, callback),
    find: (email, callback) => findCall(email, callback),
  };
})();

module.exports = { database: Database };
