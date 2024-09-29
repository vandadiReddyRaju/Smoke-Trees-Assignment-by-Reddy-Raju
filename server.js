// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file at the root URL
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

    // Insert into Address table
    db.run(`INSERT INTO Address (userId, address) VALUES (?, ?)`, [userId, address], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ userId, name, address });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
