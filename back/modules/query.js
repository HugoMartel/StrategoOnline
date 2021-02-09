let Database = (function () {
  const mysql = require("mysql").createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "StrategoOnline",
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
      "SELECT Username FROM logins WHERE Login='" + email + "' AND Password='" + password + "';",
      (err, result) => {
        if (err)
          throw err;

        //console.log(result[0].Username);
        callback(result[0].Username);
        return;
      });
  };

  let registerCall = (email, password, username, callback) => {
    mysql.query(
        "INSERT ...;",
        (err, result) => {
          if (err)
            throw err;
          //TODO

          // Check if the user already exists


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
    register: (email, password, username, callback) => registerCall(email, password, username, callback),
  };
})();

module.exports = { database: Database };
