from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal_with
import csv
import io

app = Flask(__name__)
CORS(app)
api = Api(app)

class SheetMusic(Resource):
    def post(self):
        try:
            uploaded_file = request.files['csv']
            if uploaded_file.filename == '' or uploaded_file.filename[-4:] != ".csv":
                return {"response": "Not A csv File"}, 415
        except KeyError:
            print("HI there no file fucker")
            return {"response": "No File in the HTTP Body"}, 400

        json_data = []
        # Read directly from the FileStorage object
        try:
            # Use TextIOWrapper to handle encoding
            file_stream = io.TextIOWrapper(uploaded_file, encoding='utf-8')
            reader = csv.DictReader(file_stream)
            for row in reader:
                json_data.append(row)
            print(json_data)
        except Exception as e:
            return {"response": "Error Processing CSV File", "error": str(e)}, 500

        return {"content": json_data}, 200


api.add_resource(SheetMusic, "/sheetmusic")


app.run(host="0.0.0.0", port=49152)
