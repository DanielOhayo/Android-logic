import librosa
import matplotlib.pyplot as plt
import librosa.display
from IPython.display import Audio
import numpy as np
import tensorflow as tf
from matplotlib.pyplot import specgram
import pandas as pd
from sklearn.metrics import confusion_matrix
import IPython.display as ipd  # To play sound in the notebook
import os  # interface with underlying OS that python is running on
import sys
import warnings
import soundfile as sf
import ffmpeg
input_file = 'C:/Users/ohayo/AppData/Local/Google/AndroidStudio2022.1/device-explorer/Nexus_6P_Edited_API_33 [emulator-5554]/data/data/com.example.flutter_dev/cache/audio.aac'
output_file = 'my_unique_voice.wav'

(
    ffmpeg
    .input(input_file, format='aac')
    .output(output_file, format='wav')
    .run()
)

x, sr = librosa.load(
    'my_unique_voice.wav')
# DISPLAY WAVEPLOT
plt.figure(figsize=(8, 4))
librosa.display.waveshow(x, sr=sr)
plt.title('Waveplot - Male Neutral')
plt.savefig('plt_img/Waveplot_MaleNeutral.png')

# PLAY AUDIO FILE

sf.write('audio_/MaleNeutral.wav', x, sr)
Audio(data=x, rate=sr)

# CREATE LOG MEL SPECTROGRAM
spectrogram = librosa.feature.melspectrogram(y=x, sr=sr, n_mels=128, fmax=8000)
spectrogram = librosa.power_to_db(spectrogram)

librosa.display.specshow(spectrogram, y_axis='mel', fmax=8000, x_axis='time')
plt.title('Mel Spectrogram - Male Neutral')
plt.savefig('mel_spec_img/MelSpec_MaleNeutral.png')
plt.colorbar(format='%+2.0f dB')
