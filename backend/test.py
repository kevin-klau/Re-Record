import cv2
import time
import os

WIDTH = 640
HEIGHT = 480
FOLDER_PATH = "recorderFingering"

cap = cv2.VideoCapture(1)
cap.set(3, WIDTH)
cap.set(4, HEIGHT)

while True:
    success, image = cap.read()
    cv2.imshow("image", image)
    cv2.waitKey(1)