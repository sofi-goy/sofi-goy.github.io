class Frame {
    constructor (width, height, data) {
        this.width = width;
        this.height = height;

        if (data === undefined)
            this.data = new Uint8ClampedArray(4 * width * height);

        else
            this.data = data
    } 

    index (x,y) {
        return 4 * (y * this.width + x);
    }

    getPixel(x,y) {
        var i = this.index(x,y);
        return [this.data[i], this.data[i+1], this.data[i+2], this.data[i+3]];
    }

    setPixel(x,y,pixel) {
        var i = this.index(x,y);
        this.data[i]   = pixel[0];
        this.data[i+1] = pixel[1];
        this.data[i+2] = pixel[2];
        this.data[i+3] = pixel[3];
    }
}

class FrameMemory {
    constructor (width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.presente = 0;
        this.frames = new Array(depth);
        for (var i=0; i < depth; i++) {
            this.frames[i] = new Frame(width, height);
        }
    }

    pushPresent(frame) {
        this.presente = (this.presente + 1) % this.depth;
        this.frames[this.presente].data = undefined;
        this.frames[this.presente] = frame;
    }

    getPixelFromPast(x,y,offset) {
        var i = ((this.presente - offset) % this.depth + this.depth) % this.depth;
        return this.frames[i].getPixel(x,y);
    }
}