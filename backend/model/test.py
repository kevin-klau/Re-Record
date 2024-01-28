import cv2
import numpy as np

# Start video capture
cap = cv2.VideoCapture(1)

while True:
    # Capture frame-by-frame
    ret, image = cap.read()
    if not ret:
        break

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (11, 11), 0)  # Increase the kernel size

    # Edge detection
    edges = cv2.Canny(blurred, 100, 200)

    # Find circles using Hough Transform
    circles = cv2.HoughCircles(blurred, cv2.HOUGH_GRADIENT, dp=1.2, minDist=40, param1=100, param2=40, minRadius=5, maxRadius=20)

    # Draw circles
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            cv2.circle(image, (x, y), r, (0, 255, 0), 4)

    # Display the resulting frame
    cv2.imshow('Detected Holes', image)

    # Break the loop with 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything is done, release the capture
cap.release()
cv2.destroyAllWindows()
