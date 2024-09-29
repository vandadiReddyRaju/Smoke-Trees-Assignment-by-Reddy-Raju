// I created databse and tables using sqlit3

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  
  db.run(`CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);

  
  db.run(`CREATE TABLE Address (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    address TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
  )`);
});

module.exports = db;
