import eventlet
eventlet.monkey_patch()

from flask import Flask, request
from flask_socketio import SocketIO, emit
from model import openCVHandTracking

# FLASK API SETUP
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


def singlePlayerRunSocket():
    openCVHandTracking.singlePlayerRun(2, socketio)

def multiPlayerRunSocket():
    openCVHandTracking.multiPlayerRun(4, socketio)

@socketio.on('singlePlayer')
def handle_message(message):
    app.logger.info("Start streaming")
    eventlet.spawn(singlePlayerRunSocket)
    socketio.emit("connect", {"message": "successfully connected"})

@socketio.on('multiPlayer')
def handleMultiplayer(message):
    app.logger.info("Start streaming")
    eventlet.spawn(multiPlayerRunSocket)
    socketio.emit("connect", {"message": "successfully connected"})



if __name__ == '__main__':
    print("HI")
    socketio.run(app, port=5001, debug=True)
    print("DONE")
