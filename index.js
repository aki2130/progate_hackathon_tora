const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

const db = new sqlite3.Database('music.sqlite3');

// 静的ファイルの提供
app.use('/audio', express.static(path.join(__dirname, 'progate_hackathon_tora_data')));
app.use('/mnt/data', express.static(path.join(__dirname, 'mnt/data')));

app.get('/random-songs', (req, res) => {
    db.all('SELECT * FROM music', [], (err, rows) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Database query error");
            return;
        }

        const genres = { rock: [], kpop: [], jpop: [] };

        rows.forEach(row => {
            if (genres[row.genre]) {
                genres[row.genre].push(row);
            }
        });

        const selectedSongs = [];
        selectedSongs.push(randomElement(genres.rock));
        selectedSongs.push(randomElement(genres.kpop));
        selectedSongs.push(randomElement(genres.jpop));

        const remainingSongs = rows.filter(row => !selectedSongs.includes(row));
        while (selectedSongs.length < 5) {
            const randomSong = randomElement(remainingSongs);
            selectedSongs.push(randomSong);
            remainingSongs.splice(remainingSongs.indexOf(randomSong), 1);
        }

        res.json(selectedSongs);
    });
});

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
