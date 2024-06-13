import librosa
import librosa.display
import matplotlib.pyplot as plt

y, sr = librosa.load("CITRUSver1.wav")
mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=10)

plt.figure(figsize=(12, 4))
librosa.display.specshow(mfccs, x_axis='time', sr=sr)
plt.colorbar(label='MFCC coefficient')
plt.title('MFCC')
plt.tight_layout()
plt.show()
