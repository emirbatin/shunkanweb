import os
from flask import Flask, render_template, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import mediapipe as mp
from utils.mediapipe_utils import draw_landmarks, mediapipe_detection
from utils.model_utils import extract_keypoints
from tensorflow.keras.models import load_model
import time
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

model_file_path = os.path.join(os.path.dirname(__file__), 'ML_Models/action.keras')
actions = np.array(['hello', 'howareyou', 'thanks'])
model = load_model(model_file_path)

mp_holistic = mp.solutions.holistic
executor = ThreadPoolExecutor(max_workers=2)

client_connected = False

def process_frame(frame, holistic, model, sequence, sentence, predictions, threshold):
    res = None  # Initialize res to ensure it's defined
    image, results = mediapipe_detection(frame, holistic)
    #draw_landmarks(image, results) landmarklar kapalı

    if results.left_hand_landmarks or results.right_hand_landmarks:
        keypoints = extract_keypoints(results)
        sequence.append(keypoints)
        sequence = sequence[-30:]

        if len(sequence) == 30:
            res = model.predict(np.expand_dims(sequence, axis=0))[0]
            predictions.append(np.argmax(res))
    else:
        predictions.append(len(actions) - 1)

    if len(predictions) > 0 and res is not None and np.unique(predictions[-10:])[0] == np.argmax(res) and (res[np.argmax(res)].any() > threshold):
        if len(sentence) > 0 and actions[np.argmax(res)] != sentence[:1]:
            sentence.append(actions[np.argmax(res)])
        else:
            sentence.append(actions[np.argmax(res)])

    if len(sentence) > 1:
        sentence = sentence[-1:]

    ret, buffer = cv2.imencode('.jpg', image)
    frame = buffer.tobytes()

    return frame, sentence

def gen_frames():
    threshold = 0.4
    sequence = []
    sentence = []
    predictions = []

    with mp_holistic.Holistic(
            static_image_mode=False,
            model_complexity=0, 
            smooth_landmarks=True,
            enable_segmentation=False,
            refine_face_landmarks=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5) as holistic:
        cap = cv2.VideoCapture(0)
        frame_rate = 15
        prev = 0

        while cap.isOpened() and client_connected:
            time_elapsed = time.time() - prev

            if time_elapsed > 1.0 / frame_rate:
                ret, frame = cap.read()
                prev = time.time()

                if not ret:
                    continue

                future = executor.submit(process_frame, frame, holistic, model, sequence, sentence, predictions, threshold)
                frame, sentence = future.result()

                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                socketio.emit('sentence_update', {'sentence': ' '.join(sentence)})

        cap.release()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def connect():
    global client_connected
    client_connected = True
    print('Client connected')

@socketio.on('disconnect')
def disconnect():
    global client_connected
    client_connected = False
    print('Client disconnected')

@app.route('/video_feed')
def video_feed():
    print('Video feed requested')
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
