document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();
    uploadFile();
});

function uploadFile() {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error sending file');
        })

        .then(data => {
            console.log('Server response:', data);
            const imageElement = document.getElementById('image');
            document.getElementById("result").textContent = "Scanning ..."

            imageElement.onload = function () {
                classifier.classify(imageElement, gotResult);
            };
            imageElement.src = 'data:image/jpeg;base64,' + data.image;
        })


        .catch(error => {
            console.error('Error:', error);
        });
}

const classifier = ml5.imageClassifier('MobileNet');


function gotResult(error, results) {
    const element = document.getElementById("result");
    if (error) {
        element.innerHTML = error;
    } else {
        let num = results[0].confidence * 100;
        element.innerHTML = results[0].label + "<br>Confidence: " + num.toFixed(2) + "%";
    }
}