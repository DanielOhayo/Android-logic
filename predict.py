import librosa
import numpy as np
import pandas as pd
import tensorflow as tf
import ffmpeg


input_file = 'C:/Users/ohayo/AppData/Local/Google/AndroidStudio2022.1/device-explorer/Nexus_6P_Edited_API_33 [emulator-5554]/data/data/com.example.flutter_dev/cache/audio_5_sec.aac'
output_file = 'my_emotion_voice_check.wav'
(
    ffmpeg
    .input(input_file, format='aac')
    .output(output_file, format='wav')
    .run(cmd=['ffmpeg', '-y'])
)


# Load the audio file and extract features


def extract_features(file_path):
    X, sample_rate = librosa.load(file_path, res_type='kaiser_fast',
                                  duration=2.5, sr=22050*2, offset=0.5)
    mfccs = np.mean(librosa.feature.mfcc(
        y=X, sr=sample_rate, n_mfcc=13), axis=0)
    features = mfccs
    print(features.shape)
    return features


# Load the model
model = tf.keras.models.load_model('Emotion_Voice_Detection_Model.h5')
model.summary()
# Load the audio file and extract features
audio_file = 'C:\\Users\\ohayo\\Desktop\\Folders\\Android inrerface\\my_emotion_voice_check.wav'
features = extract_features(audio_file)
print(features.shape)

feat = np.expand_dims(features, axis=1)
feat = np.expand_dims(feat, axis=2)
feat = feat.reshape(1, -1, 1)
print(feat.shape)

prediction = model.predict(feat)

# Make a prediction on the features
# prediction = model.predict(np.expand_dims(features, axis=0))

# Map the prediction to an emotion label
emotion_labels = ['angry', 'calm', 'disgust',
                  'fear', 'happy', 'neutral', 'sad', 'surprise']
emotion_index = np.argmax(prediction)
emotion_label = emotion_labels[emotion_index-1]

print('Predicted emotion:', emotion_label)


def retLabel():
    return emotion_label
