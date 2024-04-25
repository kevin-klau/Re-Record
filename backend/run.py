import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO
import socketio as SockIO

from rerecorder.api.routes import SheetMusic, sheetConverter
from rerecorder.socketIO.routes import register_events

from dotenv import load_dotenv
import os


# Starting Point of The Server App
def create_app() -> tuple[Flask, SocketIO]:
    app: Flask = Flask(__name__)
    socketio: SocketIO = SocketIO(app, cors_allowed_origins="*")
    sio = SockIO.Server(async_mode='eventlet')
    CORS(app)

    # Registering Blueprints
    # app.register_blueprint(sheetConverter)
    register_events(app, socketio)

    # Defining API Endpoints
    api = Api(app)
    # api.add_resource(SheetMusic, "/sheetmusic")

    return app, socketio


# Initializing App 
if __name__ == '__main__':
    load_dotenv()

    app, socketio = create_app()
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

    # app.run(host="0.0.0.0", port=5001, debug=True)
    eventlet.wsgi.server(eventlet.listen(('', 5002)), app)

    print("RUNNING APP on PORT 5001 and 5002")
