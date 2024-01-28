from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal_with
import csv
import json

app = Flask(__name__)
CORS(app)
api = Api(app)


class SheetMusic(Resource):
    def post(self):
        try:
            uploaded_file = request.files['csv']
            if uploaded_file.filename[-4:] != ".csv":
                return {"response": "Not A csv File"}, 415
        except KeyError:
            return {"response": "No File in the HTTP Body"}, 400


        json_data = []
        with open(uploaded_file, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
        for row in reader:
            json_data.append(row)

        return jsonify(json_data), 200

api.add_resource(SheetMusic, "/search/")


app.run(host="0.0.0.0", port=49152)
