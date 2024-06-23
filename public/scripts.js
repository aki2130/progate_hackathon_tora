// document.addEventListener('DOMContentLoaded', () => {
//     let audio = new Audio();
//     let audioSource = '';
//     let isPlaying = false;
//     let startTime = 0;
//     let playTime = 0;
//     const songList = document.getElementById('song-list');

//     // 曲リストを取得し、表示する関数
//     async function fetchAndDisplaySongs() {
//         try {
//             const response = await fetch('/random-songs');
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const songs = await response.json();
//             displaySongs(songs);
//         } catch (error) {
//             console.error('Failed to fetch songs:', error);
//         }
//     }

//     function displaySongs(songs) {
//         songs.forEach(song => {
//             const songItem = document.createElement('div');
//             songItem.className = 'song-item';
//             songItem.textContent = song.name;
//             songItem.addEventListener('click', () => {
//                 fetchSongInfo(song.name);
//                 audioSource = `/audio/${song.genre.toLowerCase()}/${song.name}.mp3`;
//                 console.log(`Playing audio from: ${audioSource}`); // デバッグ用
//                 resetAudio();
//                 audio.src = audioSource;
//                 audio.play();
//                 isPlaying = true;
//                 startTime = Date.now();
//             });
//             songList.appendChild(songItem);
//         });
//     }

//     async function fetchSongInfo(songName) {
//         try {
//             const response = await fetch(`/song-info?name=${encodeURIComponent(songName)}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const songInfo = await response.json();
//             displaySongInfo(songInfo);
//             console.log(`Selected genre: ${songInfo}`);
//             localStorage.setItem('selectedGenre', songInfo.genre); // ジャンルをローカルストレージに保存
//         } catch (error) {
//             console.error('Failed to fetch song info:', error);
//         }
//     }

//     function displaySongInfo(song) {
//         console.log(`曲名: ${song.name}, ジャンル: ${song.genre}, ID：${song.music_id}`);
//         //console.log(`曲名: ${song.name}, ジャンル: ${song.genre}`);
//     }

//     function resetAudio() {
//         audio.pause();
//         isPlaying = false;
//         startTime = 0;
//         playTime = 0;
//         audio.src = '';
//     }

//     const playButton = document.getElementById('play-button');
//     const stopButton = document.getElementById('stop-button');

//     playButton.addEventListener('click', () => {
//         if (audioSource && !isPlaying) {
//             audio.play();
//             isPlaying = true;
//             startTime = Date.now();
//         } else if (isPlaying) {
//             audio.play();
//             startTime = Date.now() - playTime;
//         }
//     });

//     stopButton.addEventListener('click', () => {
//         if (isPlaying) {
//             audio.pause();
//             isPlaying = false;
//             playTime += Date.now() - startTime;
//         }
//     });

//     audio.addEventListener('ended', () => {
//         isPlaying = false;
//         playTime += Date.now() - startTime;
//         // 画像生成の処理を追加
//         generateImage();
//     });

//     function generateImage() {
//         // ここにStable Diffusionを使った画像生成の処理を追加
//         // 生成された画像をimgタグに表示
//         document.getElementById('generated-image').src = 'generated-image-url';
//     }

//     // ページが読み込まれたら曲を表示
//     fetchAndDisplaySongs();
// });


document.addEventListener('DOMContentLoaded', () => {
    let audio = new Audio();
    let audioSource = '';
    let isPlaying = false;
    let startTime = 0;
    let playTime = 0;
    const songList = document.getElementById('song-list');

    // 曲リストを取得し、表示する関数
    async function fetchAndDisplaySongs() {
        try {
            const response = await fetch('/random-songs');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const songs = await response.json();
            displaySongs(songs);
        } catch (error) {
            console.error('Failed to fetch songs:', error);
        }
    }

    function displaySongs(songs) {
        songs.forEach(song => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.textContent = song.name;
            songItem.addEventListener('click', () => {
                fetchSongInfo(song.name);
                audioSource = `/audio/${song.genre.toLowerCase()}/${song.name}.mp3`;
                console.log(`Playing audio from: ${audioSource}`); // デバッグ用
                resetAudio();
                audio.src = audioSource;
                audio.play();
                isPlaying = true;
                startTime = Date.now();
            });
            songList.appendChild(songItem);
        });
    }

    async function fetchSongInfo(songName) {
        try {
            const response = await fetch(`/song-info?name=${encodeURIComponent(songName)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const songInfo = await response.json();
            displaySongInfo(songInfo);
            console.log(`Selected genre: ${songInfo}`);
            localStorage.setItem('selectedGenre', songInfo.genre); // ジャンルをローカルストレージに保存
            sendGenreToServer(songInfo.genre); // サーバーにジャンルを送信
        } catch (error) {
            console.error('Failed to fetch song info:', error);
        }
    }

    function displaySongInfo(song) {
        console.log(`曲名: ${song.name}, ジャンル: ${song.genre}, ID：${song.music_id}`);
    }

    function resetAudio() {
        audio.pause();
        isPlaying = false;
        startTime = 0;
        playTime = 0;
        audio.src = '';
    }

    const playButton = document.getElementById('play-button');
    const stopButton = document.getElementById('stop-button');


    playButton.addEventListener('click', () => {
        if (audioSource && !isPlaying) {
            audio.play();
            isPlaying = true;
            startTime = Date.now();
        } else if (isPlaying) {
            audio.play();
            startTime = Date.now() - playTime;
        }
    });

    stopButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playTime += Date.now() - startTime;
            console.log('playTime:', playTime);
            generateImage();
            console.log('Image generated');
        }
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playTime += Date.now() - startTime;
        generateImage();
    });

    async function generateImage() {
        const selectedGenre = localStorage.getItem('selectedGenre');
        try {
            const response = await fetch('/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genre: selectedGenre }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            document.getElementById('generated-image').src = "./image_generate/output.png";
            // document.getElementById('generated-image').src = result.imageUrl;
        } catch (error) {
            console.error('Failed to generate image:', error);
        }
    }

    async function sendGenreToServer(genre) {
        try {
            const response = await fetch('/set-genre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genre }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Genre sent to server successfully');
        } catch (error) {
            console.error('Failed to send genre to server:', error);
        }
    }

    // ページが読み込まれたら曲を表示
    fetchAndDisplaySongs();
});
