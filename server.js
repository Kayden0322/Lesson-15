const express = require('express');
const mysql = require('mysql12/promise');
require('dotenv').config();

const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => {
    console.log('Server running on port', port);
});

app.get('/games', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM games');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching games' });
    }
});


app.get('/games/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM games WHERE id = ?',
            [id]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching game' });
    }
});



app.post('/games', async (req, res) => {
    const { game_name, game_picture, game_publisher } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO games (game_name, game_picture, game_publisher) VALUES (?, ?, ?)',
            [game_name, game_picture, game_publisher]
        );

        res.status(201).json({ message: 'Game added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding game' });
    }
});


app.put('/games/:id', async (req, res) => {
    const { id } = req.params;
    const { game_name, game_picture, game_publisher } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE games SET game_name = ?, game_picture = ?, game_publisher = ? WHERE id = ?',
            [game_name, game_picture, game_publisher, id]
        );

        res.json({ message: 'Game updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating game' });
    }
});

app.delete('/games/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM games WHERE id = ?',
            [id]
        );

        res.json({ message: 'Game deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting game' });
    }
});
