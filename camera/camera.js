var chunk = 5;
const chunkSlider = document.getElementById('chunk-slider');

const video = document.getElementById('webcam');
const canvas = document.getElementById('filtered');
const ctx = canvas.getContext('2d');

function newMemory() {
    return new FrameMemory(video.videoWidth, video.videoHeight, Math.floor(video.videoHeight / chunk));
}

var memory = newMemory();

function computeFrame() {
    // Get data from video element
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    var data = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    var frame = new Frame(video.videoWidth, video.videoHeight);
    frame.setData(data.data);

    memory.pushPresent(frame);
    var newFrame = new Frame(video.videoWidth, video.videoHeight);

    for (var y = 0; y < newFrame.height; y++) {
        for (var x = 0; x < newFrame.width; x++) {
            var pixel = memory.getPixelFromPast(x, y, Math.floor(y / chunk));
            newFrame.setPixel(x, y, pixel);
        }
    }

    ctx.putImageData(new ImageData(newFrame.data, newFrame.width, newFrame.height), 0, 0);
}

var streamOn = false;

function timerCallback() {
    if (!streamOn) {
        streamOn = true;
        memory = newMemory();
    }
    computeFrame();
    setTimeout(function () {
        self.timerCallback();
    }, 1); // roughly 40 frames per second
}

function fullscreen() {
    if (canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    }
    else {
        canvas.mozRequestFullScreen();
    }
}

function newChunk() {
    chunk = chunkSlider.value;
    memory = newMemory();
    console.log("Changed chunk", chunk);
}

function setUp() {
    /* Setting up the constraint */
    var constraints = {
        audio: false,
        video: true
    };

    /* Stream it to video element */
    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
        video.srcObject = stream;
        video.addEventListener('play', timerCallback);
    })

    /* Making controls functional */
    var fullbtn = document.getElementById('fullscreen-btn');
    fullbtn.addEventListener("click", fullscreen);
    chunkSlider.addEventListener("input", newChunk);

}

setUp();