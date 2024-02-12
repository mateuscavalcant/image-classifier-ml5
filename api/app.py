from flask import Flask, request, jsonify, render_template
import base64

#  creates a Flask application instance named app
app = Flask(__name__)

# class Data with attributes to hold image data
class Data:
    def __init__(self):
        self.image_byte = None
        self.image_base64 = None

# Route for the index page
@app.route('/')
def index():
    return render_template('index.html')

# Route for uploading an image via POST request
@app.route('/upload', methods=['POST'])
def upload_image():
    # Create an instance of the Data class to hold image data
    data = Data()

    # Get the file object from the request
    file = request.files['file']
    if file:
        # Read the image bytes from the file object
        data.image_byte = file.read()
        file.close()

    # Check if image bytes were obtained successfully
    if data.image_byte:
        # Encode the image bytes to base64 and decode to UTF-8
        data.image_base64 = base64.b64encode(data.image_byte).decode('utf-8')
        # Return the base64 encoded image as JSON response
        return jsonify({'image': data.image_base64})
    else:
        # Return an error message if image data couldn't be obtained
        return jsonify({'error': 'Erro ao obter a imagem do formulário'}), 400

if __name__ == '__main__':
    # Run the Flask application
    app.run(debug=True)
