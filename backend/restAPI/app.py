from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal_with

# FLASK API SETUP
app = Flask(__name__)
CORS(app)
api = Api(app)


class SheetMusic(Resource):
    def post(self):
        try:
            uploaded_file = request.files['pdf']
            if uploaded_file.filename[-4:] != ".pdf":
                return 415, {"response": "Not A PDF File"}
        except KeyError:
            return 400, {"response": "No File in the HTTP Body"}

        # Processing to Return As JSON
        
        return 200

api.add_resource(SheetMusic, "/search/")


app.run(host="0.0.0.0", port=49152)


