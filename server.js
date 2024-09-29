// To create db connection and perform crud operations I used node js and express js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/users', (req, res) => {
    db.all(`SELECT User.id, User.name, Address.address FROM User
            LEFT JOIN Address ON User.id = Address.userId`, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });


app.post('/register', (req, res) => {
  const { name, address } = req.body;

  db.run(`INSERT INTO User (name) VALUES (?)`, [name], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const userId = this.lastID;

    db.run(`INSERT INTO Address (userId, address) VALUES (?, ?)`, [userId, address], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ userId, name, address });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
