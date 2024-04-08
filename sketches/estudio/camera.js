var chunk = 5;
const chunkSlider = document.getElementById('chunk-slider');

const franjas = document.getElementById('franjas');
const video = document.getElementById('webcam');
const canvas = document.getElementById('filtered');
const ctx = canvas.getContext('2d');

function newMemory() {
    return new FrameMemory(video.videoWidth, video.videoHeight, 2000);
}

var memory = newMemory();

function pastDepth(x, y, tipoFranja) {
    if (tipoFranja == "Horizontal")
        return Math.floor(y / chunk);

    if (tipoFranja == "Vertical")
        return Math.floor(x / chunk);

    if (tipoFranja == "Radial") {
        var newX = x - video.videoWidth / 2;
        var newY = y - video.videoHeight / 2;
        var dist = Math.sqrt(newX * newX + newY * newY);
        return Math.floor(dist / chunk);
    }

    return 0;
}

function computeFrame() {
    // Get data from video element
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    var data = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    var frame = new Frame(video.videoWidth, video.videoHeight, data.data);
    memory.pushPresent(frame);

    var newFrame = new Frame(video.videoWidth, video.videoHeight);
    var tipoFranja = franjas.value;

    var newX;
    var pixel;

    for (var x = 0; x < newFrame.width; x++) {
        newX = newFrame.width - x;
        for (var y = 0; y < newFrame.height; y++) {
            pixel = memory.getPixelFromPast(newX, y, pastDepth(x, y, tipoFranja));
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
    }, 20);
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