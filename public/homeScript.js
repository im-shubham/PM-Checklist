 // Function to open the camera and scan QR code
 function openCamera() {
    var scanner = new Instascan.Scanner({ video: document.getElementById('cameraVideo') });
    scanner.addListener('scan', function(content) {
        console.log('QR Code detected:', content);
        // Populate the machine ID input field with the content of the QR code
        document.getElementById('machineId').value = content;
        // Hide the camera preview after scanning
        document.getElementById('cameraPreview').style.display = 'none';
    });
    Instascan.Camera.getCameras().then(function(cameras) {
        if (cameras.length > 0) {
            // Start scanning using the first available camera
            scanner.start(cameras[0]);
            // Show the camera preview
            document.getElementById('cameraPreview').style.display = 'block';
        } else {
            console.error('No cameras found.');
        }
    }).catch(function(e) {
        console.error('Error accessing the camera:', e);
    });
}