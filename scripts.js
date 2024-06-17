document.addEventListener('DOMContentLoaded', () => {
  let audio = new Audio();
  let audioSource = '';
  let isPlaying = false;
  let startTime = 0;
  let playTime = 0;

  const uploadButton = document.getElementById('upload-button');
  const musicUpload = document.getElementById('music-upload');
  const playButton = document.getElementById('play-button');
  const stopButton = document.getElementById('stop-button');
  const audioOptions = document.querySelectorAll('.audio-option');

  uploadButton.addEventListener('click', () => {
      musicUpload.click();
  });

  musicUpload.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
          audioSource = URL.createObjectURL(file);
          resetAudio();
      }
  });

  audioOptions.forEach(button => {
      button.addEventListener('click', () => {
          audioSource = button.getAttribute('data-source');
          resetAudio();
      });
  });

  playButton.addEventListener('click', () => {
      if (audioSource && !isPlaying) {
          audio.src = audioSource;
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

  function resetAudio() {
      audio.pause();
      isPlaying = false;
      startTime = 0;
      playTime = 0;
      audio.src = '';
  }

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
});
