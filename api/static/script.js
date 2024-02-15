// Add event listener to the form submission event
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    uploadFile(); // Call the function to upload the file
});

// Function to upload the file to the server
function uploadFile() {
    // Get the file input element
    const fileInput = document.getElementById('file');
    // Get the selected file
    const file = fileInput.files[0];
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', file);

    // Send a POST request to the server with the file data
    fetch('/upload', {
        method: 'POST',
        body: formData // Set the body of the request as the FormData object
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the JSON response from the server
            }
            throw new Error('Error sending file'); // Throw an error if response is not ok
        })
        .then(data => {
            // Log server response and update UI elements
            console.log('Server response:', data);
            const imageElement = document.getElementById('image');
            document.getElementById("result").textContent = "Scanning ..."

            // Load the image and classify it using the ML5.js image classifier
            imageElement.onload = function () {
                classifier.classify(imageElement, gotResult);
            };
            imageElement.src = 'data:image/jpeg;base64,' + data.image; // Set the source of the image element
        })
        .catch(error => {
            console.error('Error:', error); // Log any errors that occur during the process
        });
}

// Initialize ML5.js image classifier using MobileNet model
const classifier = ml5.imageClassifier('MobileNet');

// Callback function to handle classification results
function gotResult(error, results) {
    const element = document.getElementById("result"); // Get the result element by ID
    if (error) {
        element.innerHTML = error; // Display error message if classification fails
    } else {
        let num = results[0].confidence * 100; // Calculate confidence percentage
        // Display the label and confidence percentage
        element.innerHTML = results[0].label + "<br>Confidence: " + num.toFixed(2) + "%";
    }
}
