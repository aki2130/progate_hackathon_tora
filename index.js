// // const express = require('express');
// // const sqlite3 = require('sqlite3').verbose();
// // const path = require('path');
// // const app = express();
// // const port = 3000;

// // const { spawn } = require('child_process');

// // const db = new sqlite3.Database('music2.db');
// // //const db = new sqlite3.Database('music.sqlite3');

// // // 静的ファイルの提供
// // app.use('/audio/jpop', express.static(path.join(__dirname, 'jpop')));
// // app.use('/audio/kpop', express.static(path.join(__dirname, 'kpop')));
// // app.use('/audio/rock', express.static(path.join(__dirname, 'rock')));
// // app.use('/mnt/data', express.static(path.join(__dirname, 'mnt/data')));
// // app.use(express.static(path.join(__dirname, 'public')));

// // app.get('/', (req, res) => {
// //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// // });

// // app.get('/random-songs', (req, res) => {
// //     db.all('SELECT * FROM music', [], (err, rows) => {
// //         if (err) {
// //             console.error("Database query error:", err);
// //             res.status(500).send("Database query error");
// //             return;
// //         }

// //         const genres = { rock: [], kpop: [], jpop: [] };

// //         rows.forEach(row => {
// //             if (genres[row.genre]) {
// //                 genres[row.genre].push(row);
// //             }
// //         });

// //         const selectedSongs = [];
// //         selectedSongs.push(randomElement(genres.rock));
// //         selectedSongs.push(randomElement(genres.kpop));
// //         selectedSongs.push(randomElement(genres.jpop));

// //         const remainingSongs = rows.filter(row => !selectedSongs.includes(row));
// //         while (selectedSongs.length < 5) {
// //             const randomSong = randomElement(remainingSongs);
// //             selectedSongs.push(randomSong);
// //             remainingSongs.splice(remainingSongs.indexOf(randomSong), 1);
// //         }

// //         res.json(selectedSongs);
// //     });
// // });

// // app.get('/song-info', (req, res) => {
// //     const songName = req.query.name;
// //     db.get('SELECT * FROM music WHERE name = ?', [songName], (err, row) => {
// //         if (err) {
// //             console.error("Database query error:", err);
// //             res.status(500).send("Database query error");
// //             return;
// //         }
// //         if (row) {
// // 			const pythonProcess = spawn('python', ['get_detail.py']);
// // 			pythonProcess.stdout.on('data', (data) => {
// // 			  console.log(`Output: ${data}`);
// // 			});

// //             res.json(row);

// //         } else {
// //             res.status(404).send("Song not found");
// //         }
// //     });
// // });

// // function randomElement(array) {
// //     return array[Math.floor(Math.random() * array.length)];
// // }

// // app.listen(port, () => {
// //     console.log(`Server is running at http://localhost:${port}`);
// // });


// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
// const app = express();
// const port = 3000;
// const { spawn } = require('child_process');
// const fs = require('fs');
// const dotenv = require('dotenv');

// // データベース接続
// const db = new sqlite3.Database('music2.db');

// // 静的ファイルの提供
// app.use('/audio/jpop', express.static(path.join(__dirname, 'jpop')));
// app.use('/audio/kpop', express.static(path.join(__dirname, 'kpop')));
// app.use('/audio/rock', express.static(path.join(__dirname, 'rock')));
// app.use('/mnt/data', express.static(path.join(__dirname, 'mnt/data')));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/random-songs', (req, res) => {
//     db.all('SELECT * FROM music', [], (err, rows) => {
//         if (err) {
//             console.error("Database query error:", err);
//             res.status(500).send("Database query error");
//             return;
//         }

//         const genres = { rock: [], kpop: [], jpop: [] };

//         rows.forEach(row => {
//             if (genres[row.genre]) {
//                 genres[row.genre].push(row);
//             }
//         });

//         const selectedSongs = [];
//         selectedSongs.push(randomElement(genres.rock));
//         selectedSongs.push(randomElement(genres.kpop));
//         selectedSongs.push(randomElement(genres.jpop));

//         const remainingSongs = rows.filter(row => !selectedSongs.includes(row));
//         while (selectedSongs.length < 5) {
//             const randomSong = randomElement(remainingSongs);
//             selectedSongs.push(randomSong);
//             remainingSongs.splice(remainingSongs.indexOf(randomSong), 1);
//         }

//         res.json(selectedSongs);
//     });
// });

// app.get('/song-info', (req, res) => {
//     const songName = req.query.name;
//     db.get('SELECT * FROM music WHERE name = ?', [songName], (err, row) => {
//         if (err) {
//             console.error("Database query error:", err);
//             res.status(500).send("Database query error");
//             return;
//         }
//         if (row) {
//             const pythonProcess = spawn('python', ['get_detail.py']);
//             pythonProcess.stdout.on('data', (data) => {
//               console.log(`Output: ${data}`);
//             });

//             res.json(row);
//         } else {
//             res.status(404).send("Song not found");
//         }
//     });
// });

// app.post('/set-genre', (req, res) => {
//     const genre = req.body.genre;
//     const envPath = path.resolve(__dirname, '.env');

//     dotenv.config({ path: envPath });

//     // 既存の環境変数を読み込み、更新する
//     const envConfig = dotenv.parse(fs.readFileSync(envPath));
//     if (genre === 'rock') {
//         envConfig.SELECTED_GENRE = 'red leaves';
//     } else if (genre === 'kpop') {
//         envConfig.SELECTED_GENRE = 'blue leaves';
//     } else if (genre === 'jpop') {
//         envConfig.SELECTED_GENRE = 'purple leaves';
//     }

//     // 更新された環境変数を.envファイルに書き込む
//     const updatedEnv = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');
//     fs.writeFileSync(envPath, updatedEnv);

//     res.send({ message: 'Genre updated successfully' });
// });

// app.post('/generate-image', (req, res) => {
//     const genre = req.body.genre;
//     process.env.SELECTED_GENRE = genre;

//     exec('node image_generate/scripts/controlnet.mjs', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`exec error: ${error}`);
//             return res.status(500).send({ error: 'Image generation failed' });
//         }
//         console.log(`stdout: ${stdout}`);
//         console.error(`stderr: ${stderr}`);
//         // 生成された画像のURLを返す
//         const imageUrl = '/image_generate/output/output_image_1.png';
//         res.send({ imageUrl });
//     });
// });

// function randomElement(array) {
//     return array[Math.floor(Math.random() * array.length)];
// }

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });


const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;
const { exec } = require('child_process');
const { spawn } = require('child_process');
const fs = require('fs');
const dotenv = require('dotenv');

// データベース接続
const db = new sqlite3.Database('music2.db');

// 静的ファイルの提供
app.use('/audio/jpop', express.static(path.join(__dirname, 'jpop')));
app.use('/audio/kpop', express.static(path.join(__dirname, 'kpop')));
app.use('/audio/rock', express.static(path.join(__dirname, 'rock')));
app.use('/mnt/data', express.static(path.join(__dirname, 'mnt/data')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

app.get('/song-info', (req, res) => {
    const songName = req.query.name;
    db.get('SELECT * FROM music WHERE name = ?', [songName], (err, row) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Database query error");
            return;
        }
        if (row) {
            const pythonProcess = spawn('python', ['get_detail.py']);
            pythonProcess.stdout.on('data', (data) => {
              console.log(`Output: ${data}`);
            });

            res.json(row);
        } else {
            res.status(404).send("Song not found");
        }
    });
});

app.post('/set-genre', (req, res) => {
    const genre = req.body.genre;
    const envPath = path.resolve(__dirname, '.env');

    dotenv.config({ path: envPath });

    // 既存の環境変数を読み込み、更新する
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    if (genre === 'rock') {
        envConfig.SELECTED_GENRE = 'red leaves';
    } else if (genre === 'kpop') {
        envConfig.SELECTED_GENRE = 'blue leaves';
    } else if (genre === 'jpop') {
        envConfig.SELECTED_GENRE = 'purple leaves';
    }

    // 更新された環境変数を.envファイルに書き込む
    const updatedEnv = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');
    fs.writeFileSync(envPath, updatedEnv);

    // .envファイルの書き込みが完了したら、controlnet.mjsを実行
    exec('node image_generate/scripts/controlnet.mjs', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ error: 'Image generation failed' });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        // 生成された画像のURLを返す
        const imageUrl = '/image_generate/output/output_image_1.png';
        res.send({ imageUrl });
    });
});

app.post('/generate-image', (req, res) => {
    const genre = req.body.genre;
    process.env.SELECTED_GENRE = genre;

    exec('node image_generate/scripts/controlnet.mjs', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ error: 'Image generation failed' });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        // 生成された画像のURLを返す
        // const imageUrl = '/image_generate/output/outputleaves.png';
        const imageUrl = '/public/image_generate/outputleaves.png';
        res.send({ imageUrl });
    });
});

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
