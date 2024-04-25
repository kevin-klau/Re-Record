from flask import request, Blueprint
from flask_restful import Resource
import csv
import io

# Adding
sheetConverter = Blueprint('sheetConverter', __name__, url_prefix='/sheetmusic')

class SheetMusic(Resource):
    def post(self):
        # Grabbing File From POST request body
        try:
            uploaded_file = request.files['csv']
            if uploaded_file.filename == '' or uploaded_file.filename[-4:] != ".csv":
                print(f"REST API --> Incorrect File Type")
                return {"response": "Not A csv File"}, 415
        except KeyError:
            print(f"REST API --> No File Uploaded In Post Request")
            return {"response": "No File in the HTTP Body"}, 400

        # Converting Sheet Music Into JSON data
        json_data = []  # list containing converted music notes
        """
        try:
            # Use TextIOWrapper to handle encoding
            file_stream = io.TextIOWrapper(uploaded_file, encoding='utf-8')
            reader = csv.DictReader(file_stream)
            for row in reader:
                json_data.append(row)
            print(json_data)
        except Exception as e:
            return {"response": "Error Processing CSV File", "error": str(e)}, 500
        """
        return {"content": json_data}, 200


