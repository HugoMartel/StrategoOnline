let Database = (function () {
  const mysql = require("mysql").createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "strategoonline"
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

          if (result[0] !== undefined)
            callback(result[0].Username);
          else 
            callback(undefined);
          return;
        }
      );
  };

  let registerCall = (email, password, username, callback) => {
      // Check if the user already exists
      mysql.query("SELECT Login FROM logins WHERE Login=?", [email]);

      mysql.query("INSERT INTO logins SET ?;", {Username: username, Login: email, Password: password}, (err, result) => {
        if (err) throw err;
        //TODO

        

        // Add the user to the db

        // If everything went well
        callback(username);
        return;
      });
  };

  //--------------------------------------------

  return {
    connect: () => connectCall(),
    login: (email, password, callback) => loginCall(email, password, callback),
    register: (email, password, username, callback) =>
      registerCall(email, password, username, callback),
  };
})();

module.exports = { database: Database };
