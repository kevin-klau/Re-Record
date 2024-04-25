import eventlet
eventlet.monkey_patch()

import cv2
import base64
import mediapipe as mp
from mediapipe.framework.formats import landmark_pb2
import numpy as np
import time
from numpy import ndarray

from flask_socketio import SocketIO
from rerecorder.socketIO.constants import RECORDER_NOTES, HOLES2NOTES, RED, GREEN


def start_hand_tracking(numHands: int, socketio: SocketIO = None):
    """
    :param numHands: 2 hands = Singleplayer, 4 hands = Multiplayer
    :param socketio: SocketIO
    :return: n/a
    """

    # Initialize MediaPipe Hands Model
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(static_image_mode=False,
                           max_num_hands=numHands,
                           min_detection_confidence=0.5,
                           min_tracking_confidence=0.5)
    mp_drawing = mp.solutions.drawing_utils
    cap = cv2.VideoCapture(0)

    # Initialing Constant Value
    is_multiplayer = numHands == 4  # DETERMINING IF MULTIPLAYER OR SINGLEPLAYER
    CENTER_X1 = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) // 3
    CENTER_X2 = CENTER_X1 * 2  # Player 2's Center Line
    CENTER_X = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) // 2  # Singleplayer's Center Line

    # Staring Main Video Loop
    while cap.isOpened():
        # Setting Up Image and Hand Processing
        success, image = cap.read()

        if not success:
            print("Failed to Read Camera's Frame")
            continue

        HEIGHT, WIDTH = image.shape[:2]
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        results = hands.process(image)

        # Setting Up Multiplayer and Singleplayer Variables
        if is_multiplayer:
            IS_RED = {"player1": [True] * len(RECORDER_NOTES), "player2": [True] * len(RECORDER_NOTES)}
        else:
            IS_RED = {"player": [True] * len(RECORDER_NOTES)}

        # Iterating Over Each Hand Detected to Determine Which Holes Are Covered
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Determining If Hand Is Left or Right
                mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP].x
                pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP].x

                # Determining If Hand is Left or Right Based on Thumb and Pinky Location
                hand_type = "Right" if thumb_tip > pinky_tip else "Left"

                # Iterating Over All Hands and Drawing in Circles
                for i, (note, y_coor) in enumerate(RECORDER_NOTES.items()):
                    if is_multiplayer:
                        draw_circle(hand_landmarks, image, i, IS_RED["player1"], hand_type, y_coor,
                                    CENTER_X1, WIDTH, HEIGHT)  # Player 1
                        draw_circle(hand_landmarks, image, i, IS_RED["player2"], hand_type, y_coor,
                                    CENTER_X2, WIDTH, HEIGHT)  # Player 2
                    else:
                        draw_circle(hand_landmarks, image, i, IS_RED["player"], hand_type, y_coor,
                                    CENTER_X, WIDTH, HEIGHT)  # Singleplayer
        else:
            # Drawing Red Circles (if no hands are detected)
            for y_coor in RECORDER_NOTES.values():
                if is_multiplayer:
                    cv2.circle(image, (CENTER_X1, y_coor), 15, RED, -1)
                    cv2.circle(image, (CENTER_X2, y_coor), 15, RED, -1)
                else:
                    cv2.circle(image, (CENTER_X, y_coor), 15, RED, -1)

        # Determining the Note and Overlaying The Note Image
        if is_multiplayer:
            # Detecting Player 1's Notes
            image = overlay_note(socketio, image, "player1", WIDTH, HEIGHT, IS_RED)  # Overlay for Player 1
            image = overlay_note(socketio, image, "player2", WIDTH, HEIGHT, IS_RED)  # Overlay for Player 2
        else:
            image = overlay_note(socketio, image, "player", WIDTH, HEIGHT, IS_RED)  # Overlay for Singleplayer

        # Displaying the Note and Sending Back The New Frame
        cv2.imshow('MediaPipe Hands', image)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        ret, buffer = cv2.imencode('.jpg', image)
        encoded_image = base64.b64encode(buffer).decode('utf-8')
        time.sleep(0.0000000001)  # Needed to Ensure Frames Properly Send
        socketio.emit('frame', {'data': encoded_image})

    cap.release()
    cv2.destroyAllWindows()


""" HELPER FUNCTIONS """
# Helper Function to Determine If A Hole is Covered Or Not
def is_hole_covered(hole_x: int, hole_y: int, landmarks: landmark_pb2.NormalizedLandmarkList,
                    WIDTH: int, HEIGHT: int, threshold: int = 40, is_right_hand: bool = False) -> bool:
    # Determining Which Fingers to Scan For
    #   Right -> finger_tip_indices = [index, middle, ring and pinky]
    #   Left -> finger_tip_indices = [thumb, index, middle and ring]
    finger_tip_indices = [4, 8, 12, 16] if is_right_hand else [8, 12, 16, 20]

    # Enumerating Over All Fingers
    for i, lm in enumerate(landmarks.landmark):
        if i in finger_tip_indices:
            x, y = int(lm.x * WIDTH), int(lm.y * HEIGHT)

            # If the Euclidean Distance Between the Two Points Is Smaller Than The Threshold, Return True
            if np.linalg.norm(np.array([x, y]) - np.array([hole_x, hole_y])) < threshold:
                return True
    return False


# Helper Function to Draw Circles and Determine If They Are Covered
def draw_circle(hand_landmarks: landmark_pb2.NormalizedLandmarkList, image: ndarray, index: int, IS_RED: list[bool],
                hand_type: str, y_coor: int, CENTER: int, WIDTH: int, HEIGHT: int) -> None:
    # Determining If Hole Needs to be RED or GREEN
    if is_hole_covered(CENTER, y_coor, hand_landmarks, WIDTH, HEIGHT, is_right_hand=(hand_type == "Right")):
        IS_RED[index] = False
        cv2.circle(image, (CENTER, y_coor), 15, GREEN, -1)
    else:
        cv2.circle(image, (CENTER, y_coor), 15, RED, -1)


# Helper Function to Overlay Notes On The Frame
def overlay_note(socketio: SocketIO, image: ndarray, player: str, WIDTH: int, HEIGHT: int, IS_RED: dict) -> ndarray:
    # Determining the Note Based On Which Notes Are Pressed
    note = HOLES2NOTES.get(tuple(i + 1 for i, is_open in enumerate(IS_RED[player]) if not is_open), "")

    # Dealing With No Note Detected
    if note == "":
        overlayNoteJPG = None
    else:
        overlayNoteJPG = cv2.imread(f"./rerecorder/socketIO/assets/{note}.jpg")

    x, y = 10, 10

    if overlayNoteJPG is not None:
        # Overlaying Note On Left Side of the Screen
        if player == "player 1" or player == "player":
            overlay_height, overlay_width = overlayNoteJPG.shape[:2]
            image[y:y + overlay_height, x:x + overlay_width] = overlayNoteJPG

        # Overlaying Note On the Right Side of the Screen
        else:
            overlay_heightP2, overlay_widthP2 = overlayNoteJPG.shape[:2]
            x = WIDTH - overlay_widthP2  # Calculate the X-coordinate
            y = 0  # Top Y-coordinate, can be adjusted for padding

            # Ensuring the overlay fits within the main image
            if y + overlay_heightP2 <= HEIGHT and x >= 0:
                image[y:y + overlay_heightP2, x:x + overlay_widthP2] = overlayNoteJPG

    # Emitting SocketIO
    if player == "player1":
        socketio.emit("noteP1", note)
    elif player == "player2":
        socketio.emit("noteP2", note)
    else:
        print("this is a note: " + note)
        socketio.emit("note", note)

    return image


from flask import Flask
import os

if __name__ == "__main__":
    print(os.getcwd())

    app: Flask = Flask(__name__)
    socketio: SocketIO = SocketIO(app, cors_allowed_origins="*")
    start_hand_tracking(2, socketio)
    socketio.run(app, host="0.0.0.0", port=5002, debug=True)


