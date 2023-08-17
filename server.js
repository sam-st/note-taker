const express = require('express');
const fs = require ('fs');
const uuid = require('./helpers/uuid');
const path = require('path');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuid() };
  
      fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
          if (err) throw err;
          const notes = JSON.parse(data);
          notes.push(newNote);
  
          fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes, null, 2), (err) => {
              if (err) throw err;
              res.json(newNote);
          });
      });
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);