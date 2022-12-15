const db = require("mysql2-promise")();


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
