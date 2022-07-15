const video = document.getElementById('webcam');
const canvas = document.getElementById('filtered');
const ctx = canvas.getContext('2d');

video.style.display = "none";
canvas.style.transform = "scale(-1,1)";

/* Setting up the constraint */
var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
var constraints = {
    audio: false,
    video: {
        facingMode: facingMode
    }
};

const chunk = 5;
var memory = new FrameMemory(video.width, video.height, Math.floor(video.height / chunk));

function computeFrame() {
    // Get data from video element
    ctx.drawImage(video, 0, 0, video.width, video.height);
    var data = ctx.getImageData(0, 0, video.width, video.height);
    var frame = new Frame(video.width, video.height);
    frame.setData(data.data);

    memory.pushPresent(frame);
    var newFrame = new Frame(video.width, video.height);

    for (var y = 0; y < video.height; y++) {
        for (var x = 0; x < video.width; x++) {
            var pixel = memory.getPixelFromPast(x,y,Math.floor(y/chunk));
            newFrame.setPixel(x,y,pixel);
        }
    }

    ctx.putImageData(new ImageData(newFrame.data, newFrame.width, newFrame.height), 0, 0);
}

function timerCallback() {
    computeFrame();
    setTimeout(function () {
        self.timerCallback();
    }, 1); // roughly 60 frames per second
}

/* Stream it to video element */
navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    video.srcObject = stream;
    video.addEventListener('play', timerCallback);
})