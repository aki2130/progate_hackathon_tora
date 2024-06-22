document.addEventListener('DOMContentLoaded', () => {
    let audio = new Audio();
    let audioSource = '';
    let isPlaying = false;
    let startTime = 0;
    let playTime = 0;
    const songList = document.getElementById('song-list');

    // 曲リストを仮で定義
    const songs = [
        { title: 'ロック曲1', url: 'rock1.mp3', genre: 'rock' },
        { title: 'ロック曲2', url: 'rock2.mp3', genre: 'rock' },
        { title: 'ロック曲3', url: 'rock3.mp3', genre: 'rock' },
        { title: 'ロック曲4', url: 'rock4.mp3', genre: 'rock' },
        { title: 'ロック曲5', url: 'rock5.mp3', genre: 'rock' },
        { title: 'ロック曲6', url: 'rock6.mp3', genre: 'rock' },
        { title: 'ロック曲7', url: 'rock7.mp3', genre: 'rock' },
        { title: 'ロック曲8', url: 'rock8.mp3', genre: 'rock' },
        { title: 'ロック曲9', url: 'rock9.mp3', genre: 'rock' },
        { title: 'ロック曲10', url: 'rock10.mp3', genre: 'rock' },
        { title: 'ロック曲11', url: 'rock11.mp3', genre: 'rock' },
        { title: 'ロック曲12', url: 'rock12.mp3', genre: 'rock' },
        { title: 'ロック曲13', url: 'rock13.mp3', genre: 'rock' },
        { title: 'ロック曲14', url: 'rock14.mp3', genre: 'rock' },
        { title: 'ロック曲15', url: 'rock15.mp3', genre: 'rock' },
        { title: 'ロック曲16', url: 'rock16.mp3', genre: 'rock' },
        { title: 'ロック曲17', url: 'rock17.mp3', genre: 'rock' },
        { title: 'ロック曲18', url: 'rock18.mp3', genre: 'rock' },
        { title: 'ロック曲19', url: 'rock19.mp3', genre: 'rock' },
        { title: 'ロック曲20', url: 'rock20.mp3', genre: 'rock' },
        { title: 'K-pop曲1', url: 'kpop1.mp3', genre: 'kpop' },
        { title: 'K-pop曲2', url: 'kpop2.mp3', genre: 'kpop' },
        { title: 'K-pop曲3', url: 'kpop3.mp3', genre: 'kpop' },
        { title: 'K-pop曲4', url: 'kpop4.mp3', genre: 'kpop' },
        { title: 'K-pop曲5', url: 'kpop5.mp3', genre: 'kpop' },
        { title: 'K-pop曲6', url: 'kpop6.mp3', genre: 'kpop' },
        { title: 'K-pop曲7', url: 'kpop7.mp3', genre: 'kpop' },
        { title: 'K-pop曲8', url: 'kpop8.mp3', genre: 'kpop' },
        { title: 'K-pop曲9', url: 'kpop9.mp3', genre: 'kpop' },
        { title: 'K-pop曲10', url: 'kpop10.mp3', genre: 'kpop' },
        { title: 'J-pop曲1', url: 'jpop1.mp3', genre: 'jpop' },
        { title: 'J-pop曲2', url: 'jpop2.mp3', genre: 'jpop' },
        { title: 'J-pop曲3', url: 'jpop3.mp3', genre: 'jpop' },
        { title: 'J-pop曲4', url: 'jpop4.mp3', genre: 'jpop' },
        { title: 'J-pop曲5', url: 'jpop5.mp3', genre: 'jpop' },
        { title: 'J-pop曲6', url: 'jpop6.mp3', genre: 'jpop' },
        { title: 'J-pop曲7', url: 'jpop7.mp3', genre: 'jpop' },
        { title: 'J-pop曲8', url: 'jpop8.mp3', genre: 'jpop' },
        { title: 'J-pop曲9', url: 'jpop9.mp3', genre: 'jpop' },
        { title: 'J-pop曲10', url: 'jpop10.mp3', genre: 'jpop' }
    ];

    // 曲リストを取得し、表示する関数
    function displaySongs() {
        const selectedSongs = selectRandomSongs(songs);

        selectedSongs.forEach(song => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.textContent = song.title;
            songItem.addEventListener('click', () => {
                audioSource = song.url;
                resetAudio();
                audio.src = audioSource;
                audio.play();
                isPlaying = true;
                startTime = Date.now();
            });
            songList.appendChild(songItem);
        });
    }

    function selectRandomSongs(songs) {
        const genres = { rock: [], kpop: [], jpop: [] };
        songs.forEach(song => {
            if (genres[song.genre]) {
                genres[song.genre].push(song);
            }
        });

        const selectedSongs = [];
        selectedSongs.push(randomElement(genres.rock));
        selectedSongs.push(randomElement(genres.kpop));
        selectedSongs.push(randomElement(genres.jpop));

        const remainingSongs = songs.filter(song => !selectedSongs.includes(song));
        while (selectedSongs.length < 5) {
            const randomSong = randomElement(remainingSongs);
            selectedSongs.push(randomSong);
            remainingSongs.splice(remainingSongs.indexOf(randomSong), 1);
        }

        return selectedSongs;
    }

    function randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function resetAudio() {
        audio.pause();
        isPlaying = false;
        startTime = 0;
        playTime = 0;
        audio.src = '';
    }

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
    displaySongs();
});
