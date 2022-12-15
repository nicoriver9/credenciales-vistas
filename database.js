const db = require("mysql2-promise")();

// database = {
//   host     : "sql811.main-hosting.eu",
//   database : "u748790910_Credentials",
//   user     : "u748790910_Credentials",
//   password : "Credentials123",
//   port:      3306
// }

database = {
  host     : "localhost",
  database : "sys",
  user     : "root",
  password : "Admin",
  port:      3306
}

db.configure (
 database 
);

module.exports = {
  database,
  db
}
