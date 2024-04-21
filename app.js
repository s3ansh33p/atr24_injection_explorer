const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const FLAG = 'ATR{TEST_FLAG}';

const app = express();
const port = 3000;

db.serialize(() => {
    db.run('CREATE TABLE names (name varchar(255))');
    db.run('CREATE TABLE private (flag varchar(255))');
    db.run('INSERT INTO names (name) VALUES ("Alice"), ("Bob"), ("Carol"), ("Dave"), ("Eve"), ("Frank"), ("Grace"), ("Heidi"), ("Ivan"), ("Judy"), ("Katherine"), ("Lochlan"), ("Michael"), ("Nick"), ("Oscar"), ("Patrick"), ("Quincy"), ("Rupert"), ("Sybil"), ("Trent"), ("Ulysses"), ("Victor"), ("Walter"), ("Xavier"), ("Yvonne"), ("Zoe")');
    db.run('INSERT INTO private (flag) VALUES ("' +  FLAG + '")');
});

app.use(bodyParser.json());

app.post('/query', (req, res) => {
    const query = req.body.query;
    if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return;
    } else {
        const sql = "SELECT name FROM names WHERE name LIKE '%" + query + "%'";
        db.all(sql, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ rows });
            }
        });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

