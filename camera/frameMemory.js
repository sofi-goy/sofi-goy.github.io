class Pixel {
    constructor (data) {
        this.r = data[0];
        this.g = data[1];
        this.b = data[2];
        this.a = data[3];
    }
}

class Frame {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.data = new Uint8ClampedArray(4 * width * height);
    } 

    index (x,y) {
        return 4 * (y * this.width + x);
    }

    getPixel(x,y) {
        var i = this.index(x,y);
        return new Pixel(this.data.slice(i, i+4));
    }

    setPixel(x,y,pixel) {
        var i = this.index(x,y);
        this.data[i] = pixel.r;
        this.data[i+1] = pixel.g;
        this.data[i+2] = pixel.b;
        this.data[i+3] = pixel.a;
    }

    setData(data){
        this.data = data;
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
        this.frames[this.presente] = frame;
    }

    getPixelFromPast(x,y,offset) {
        var i = ((this.presente - offset) % this.depth + this.depth) % this.depth;
        return this.frames[i].getPixel(x,y);
    }
}