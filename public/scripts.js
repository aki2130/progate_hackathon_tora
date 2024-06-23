document.addEventListener('DOMContentLoaded', () => {
    let audio = new Audio();
    let audioSource = '';
    let isPlaying = false;
    let startTime = 0;
    let playTime = 0;
    let selectedGenre = '';

    const songList = document.getElementById('song-list');

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
                selectedGenre = song.genre;
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
            console.log(`曲名: ${songInfo.name}, ジャンル: ${songInfo.genre}`);
            selectedGenre = songInfo.genre;
        } catch (error) {
            console.error('Failed to fetch song info:', error);
        }
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
        }
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playTime += Date.now() - startTime;
        generateImage(selectedGenre);
    });

    async function generateImage(genre) {
        try {
            const response = await fetch('/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genre }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            document.getElementById('generated-image').src = result.imageUrl;
        } catch (error) {
            console.error('Failed to generate image:', error);
        }
    }

    fetchAndDisplaySongs();
});
