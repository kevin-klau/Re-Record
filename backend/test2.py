import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Hands model.
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False,
                       max_num_hands=2,
                       min_detection_confidence=0.5,
                       min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

def is_hole_covered(hole_x, hole_y, landmarks, threshold=40):
    # Only consider the tips of the index, middle, ring, and pinky fingers
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

recorder_holes = {
    "h1": 400,
    "h2": 475,
    "h3": 550,
    "h4": 625,
    "h5": 700,
    "h6": 775,
    "h7": 870,
}

# 

while cap.isOpened():
    success, image = cap.read()
    if not success:
        break

    # Flip the image for a selfie-view display and convert the color space.
    image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
    results = hands.process(image)

    # Defining Constants
    image_height, image_width, _ = image.shape
    center_x = image_width // 2
    
    # Initialize all holes to red (not covered)
    ISRED = [True] * len(recorder_holes)

    # Draw the hand annotations on the image and check for covered holes.
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            for i, (note, holeY) in enumerate(recorder_holes.items()):
                if is_hole_covered(center_x, holeY, hand_landmarks):
                    ISRED[i] = False

    # Drawing the Red and Green Holes
    for i, holeY in enumerate(recorder_holes.values()):
        if not ISRED[i]:
            cv2.circle(image, (center_x, holeY), 15, (0, 255, 0), -1)
        else:
            cv2.circle(image, (center_x, holeY), 15, (0, 0, 255), -1)

    # Show the image
    cv2.imshow('MediaPipe Hands', image)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
