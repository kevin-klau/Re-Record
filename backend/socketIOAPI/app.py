import eventlet
eventlet.monkey_patch()

import time
from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal_with

from flask_socketio import SocketIO, emit
import cv2
import base64
import numpy as np
import mediapipe as mp
import numpy as np
import os

# FLASK API SETUP
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# CONSTANTS
recorder_holes = {
    1: 400,
    2: 475,        
    3: 550,
    4: 625,
    5: 700,
    6: 775,
    7: 870,
}

# Convert Note Into Hole
hole_toNote = {
    (1, 2, 3, 4, 5, 6, 7):   "c1",
    (1, 2, 3, 4, 5, 6): "d",
    (1, 2, 3, 4, 5): "e",
    (1, 2, 3, 4, 6, 7): "f",
    (1, 2, 3): "g",
    (1, 2): "a",
    (1): "b",
    (2): "c2"
}

def singlePlayerRun(numHands=2):
    # Initialize MediaPipe Hands model.
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(static_image_mode=False,
                        max_num_hands=numHands,
                        min_detection_confidence=0.5,
                        min_tracking_confidence=0.5)
    mp_drawing = mp.solutions.drawing_utils
    isMultiplayer = numHands == 4 # DETERMINING IF MULTIPLAYER
        
    def is_hole_covered(hole_x, hole_y, landmarks, threshold=40, isRightHand=False):
        if isRightHand:
            finger_tip_indices = [4, 8, 12, 16]
        else:
            finger_tip_indices = [8, 12, 16, 20]

        for i, lm in enumerate(landmarks.landmark):
            if i not in finger_tip_indices:
                continue  # Skip non-tip landmarks and the thumb
            x, y = int(lm.x * image_width), int(lm.y * image_height)
            if np.linalg.norm(np.array([x, y]) - np.array([hole_x, hole_y])) < threshold:
                return True
        return False


    # Replace with your video source
    cap = cv2.VideoCapture(1)

    print(os.getcwd())
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            break

        # Flip the image for a selfie-view display and convert the color space.
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        results = hands.process(image)

        # Defining Constants
        image_height, image_width, _ = image.shape

        if isMultiplayer:
            center_x1 = image_width // 3
            center_x2 = 2 * center_x1
            IS_RED_P1 = [True] * len(recorder_holes)
            IS_RED_P2 = [True] * len(recorder_holes)
        else:
            center_x = image_width // 2
            IS_RED = [True] * len(recorder_holes)


        # Draw the hand annotations on the image and check for covered holes.
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:

                # Finding Landmarks
                thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP].x
                pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP].x
                wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].x
                
                if thumb_tip > pinky_tip:
                    hand_type = "Right" if wrist < thumb_tip else "Left"
                else:
                    hand_type = "Left" if wrist > thumb_tip else "Right"

                mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                for i, (note, holeY) in enumerate(recorder_holes.items()):
                    if isMultiplayer:
                        if is_hole_covered(center_x1, holeY, hand_landmarks, isRightHand=(hand_type == "Right")):
                            IS_RED_P1[i] = False
                        if is_hole_covered(center_x2, holeY, hand_landmarks, isRightHand=(hand_type == "Right")):
                            IS_RED_P2[i] = False
                    else:
                        if is_hole_covered(center_x, holeY, hand_landmarks, isRightHand=(hand_type == "Right")):
                            IS_RED[i] = False

        # Drawing the Red and Green Holes
        if isMultiplayer:
            holesCoveredP1 = []
            holesCoveredP2 = []
        else:
            holesCovered = []

        for i, holeY in enumerate(recorder_holes.values()):
            if isMultiplayer:
                if not IS_RED_P1[i]:
                    holesCoveredP1.append(i+1)
                    cv2.circle(image, (center_x1, holeY), 15, (0, 255, 0), -1)
                else:
                    cv2.circle(image, (center_x1, holeY), 15, (0, 0, 255), -1)

                if not IS_RED_P2[i]:
                    holesCoveredP2.append(i+1)
                    cv2.circle(image, (center_x2, holeY), 15, (0, 255, 0), -1)
                else:
                    cv2.circle(image, (center_x2, holeY), 15, (0, 0, 255), -1)

            else:
                if not IS_RED[i]:
                    holesCovered.append(i+1)
                    cv2.circle(image, (center_x, holeY), 15, (0, 255, 0), -1)
                else:
                    cv2.circle(image, (center_x, holeY), 15, (0, 0, 255), -1)

        # Determining the Note and Display it
        x, y = 10, 10  
        if isMultiplayer:
            # Player 1
            try:
                noteP1 = hole_toNote[tuple(holesCoveredP1)]
                socketio.emit("noteP1", noteP1)
                overlayNoteJPGP1 = cv2.imread(f"./backend/socketIOAPI/recorderFingering/{noteP1}.jpg")

                overlay_heightP1, overlay_widthP1 = overlayNoteJPGP1.shape[:2]
                image[y:y+overlay_heightP1, x:x+overlay_widthP1] = overlayNoteJPGP1        
            except (KeyError, AttributeError):
                socketio.emit("noteP1", "")
            
            # Player 2  
            try:
                noteP2 = hole_toNote[tuple(holesCoveredP2)]
                socketio.emit("noteP2", noteP2)
                overlayNoteJPGP2 = cv2.imread(f"./backend/socketIOAPI/recorderFingering/{noteP2}.jpg")

                print("Overlay image loaded player 2")
                if overlayNoteJPGP2 is not None:
                    overlay_heightP2, overlay_widthP2 = overlayNoteJPGP2.shape[:2]
                    # Position the overlay in the top right corner
                    x = image_width - overlay_widthP2  # Calculate the X-coordinate
                    y = 0  # Top Y-coordinate, can be adjusted for padding

                    # Ensuring the overlay fits within the main image
                    if y + overlay_heightP2 <= image_height and x >= 0:
                        image[y:y + overlay_heightP2, x:x + overlay_widthP2] = overlayNoteJPGP2
                    else:
                        print("Overlay image is too large for the main image")
                else:
                    print(f"Failed to load image for note: {noteP2}")
            except (KeyError, AttributeError):
                socketio.emit("noteP2", "")

        else:
            try:
                note = hole_toNote[tuple(holesCovered)]
                socketio.emit("note", note)

                overlayNoteJPG = cv2.imread(f"./backend/socketIOAPI/recorderFingering/{note}.jpg")  
                overlay_height, overlay_width = overlayNoteJPG.shape[:2]
                image[y:y+overlay_height, x:x+overlay_width] = overlayNoteJPG
            except (KeyError, AttributeError):
                socketio.emit("note", "")

        
        # Show the image
        cv2.imshow('MediaPipe Hands', image)
        
        ret, buffer = cv2.imencode('.jpg', image)
        encoded_image = base64.b64encode(buffer).decode('utf-8')
        time.sleep(0.00001)

        if numHands == 4:
            socketio.emit('frameMultiPlayer', {'data': encoded_image})
        else:
            socketio.emit('frameSinglePlayer', {'data': encoded_image})

    cap.release()
    cv2.destroyAllWindows()

def multiPlayerRun(): 
    singlePlayerRun(numHands=4)

@socketio.on('singlePlayer')
def handle_message(message):
    app.logger.info("Start streaming")
    eventlet.spawn(singlePlayerRun)
    socketio.emit("connect", {"message": "successfully connected"})

@socketio.on('multiPlayer')
def handleMultiplayer(message):
    app.logger.info("Start streaming")
    eventlet.spawn(multiPlayerRun)
    socketio.emit("connect", {"message": "successfully connected"})


if __name__ == '__main__':
    print("HI")
    socketio.run(app, port=5001, debug=True)
    print("DONE")