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
                audioSource = `/audio/${song.genre}/${song.name}.mp3`;
                resetAudio();
                audio.src = audioSource;
                audio.play();
                isPlaying = true;
                startTime = Date.now();
            });
            songList.appendChild(songItem);
        });
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
        // 画像生成の処理を追加
        generateImage();
    });

    function generateImage() {
        // ここにStable Diffusionを使った画像生成の処理を追加
        // 生成された画像をimgタグに表示
        document.getElementById('generated-image').src = 'generated-image-url';
    }

    // ページが読み込まれたら曲を表示
    fetchAndDisplaySongs();
});
