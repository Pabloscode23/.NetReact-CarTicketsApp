from flask import Flask, request, jsonify
import os
from google.cloud import vision
from werkzeug.utils import secure_filename
from flask_cors import CORS
import logging

# Enable CORS and set up logging
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

# Set up Google Application Credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'C:/Users/kcord/OneDrive/Desktop/RepoProyecto/SistemaMultas/BusinessLogic/PlateDetection/deteccion-de-placas-6cd7e2f2b265.json'
#os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/Pablo/Desktop/ReactNetProyect/SistemaMultas/BusinessLogic/PlateDetection/deteccion-de-placas-6cd7e2f2b265.json'

# Initialize Google Vision API client
client = vision.ImageAnnotatorClient()

# Set up allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Create upload folder if it doesn't exist
upload_folder = 'uploads'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Root route
@app.route('/')
def home():
    return 'Bienvenido a PlateDetectionAPI! Usar / Suba una imagen para detectarla.'

# Image upload route
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        # Save the file securely
        filename = secure_filename(file.filename)
        file.save(os.path.join(upload_folder, filename))
        
        # Process the image with Google Vision API
        with open(os.path.join(upload_folder, filename), 'rb') as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        response = client.text_detection(image=image)

        # Check for errors in the response
        if response.error.message:
            return jsonify({'error': f'Google Vision API error: {response.error.message}'}), 500

        # Extract the detected text
        detected_text = response.text_annotations[0].description if response.text_annotations else ''

        return jsonify({'text': detected_text})
    else:
        return jsonify({'error': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
