import eventlet
eventlet.monkey_patch()

from flask import Flask, request
from flask_socketio import SocketIO, emit
from backend.rerecorder.socketIO import openCVHandTracking

# Dictionary to keep track of tasks
tasks = {}

# Defining Paths for Singleplayer and Multiplayer Stream
def register_events(app: Flask, socketio: SocketIO):
    # Defining Paths for SocketIO
    with app.app_context():
        @socketio.on("test")
        def test(message):
            socketio.emit("connect", {"message": "successfully connected"})

        # Path for the Single Player Stream
        @socketio.on('singlePlayer')
        def handleSingleplayer(message):
            app.logger.info("Started Singleplayer")
            task = eventlet.spawn(lambda: openCVHandTracking.start_hand_tracking(2, socketio))
            tasks[request.sid] = task
            print(request.sid)
            socketio.emit("connect", {"message": "successfully connected"})

        # Path for the Multi Player Stream
        @socketio.on('multiPlayer')
        def handleMultiplayer(message):
            app.logger.info("Start Multiplayer")
            task = eventlet.spawn(lambda: openCVHandTracking.start_hand_tracking(4, socketio))
            tasks[request.sid] = task
            socketio.emit("connect", {"message": "successfully connected"})

    @socketio.on('disconnect')
    def handle_disconnect():
        app.logger.info(f"Client {request.sid} disconnected")
        # Retrieve and kill the task associated with the session ID
        task = tasks.get(request.sid)
        if task:
            eventlet.kill(task)  # Use the appropriate exception or method to kill the task
            del tasks[request.sid]  # Remove the task from the dictionary
