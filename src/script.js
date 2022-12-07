var canvas = document.querySelector('#screen');

var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
const WIDTH  = canvas.width;
const HEIGHT = canvas.height;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

let pixelSize = 2;
ctx.lineWidth = 2;

class coords{
    constructor(x_, y_)
    {
        this.x = x_;
        this.y = y_;
    }
}
class ComplexNumber {
    constructor(r, i) {
        this.r = r;
        this.i = i;
    }
    mag() {
        return Math.hypot(this.r, this.i);
    }
    add(nmb) {
        this.r += nmb.r;
        this.i += nmb.i;
        return this;
    }
    square() {
        let r = this.r;
        let i = this.i;
        this.r = r * r - i * i;
        this.i = 2 * r * i;
        return this;
    }
}

const squareCoords = new coords(200, 300);
const squareWidth  = 200;
const defaultColor = { r: 200, g: 100, b: 200, a: 255 };

let p0 = new coords(400, 550); // bottom left
let p1 = new coords(600, 100); // top
let p2 = new coords(800, 550); // bottom right

function drawKochSnowflake() {
    console.log("start drawKochSnowflake");
    clearScreen();
    ctx.strokeStyle = "blue";
    KochAlgorithm(p0, p1, 6);
    KochAlgorithm(p1, p2, 6);
    KochAlgorithm(p2, p0, 6);
    console.log("end drawKochSnowflake");

};
function KochAlgorithm(p0, p1, limit) {
    let dx = p1.x - p0.x;
    let dy = p1.y - p0.y
    let dist = Math.sqrt(dx * dx + dy * dy);
    let unit = dist / 3;
    let angle = Math.atan2(dy, dx);
    let pA = new coords(
        p0.x + dx / 3,
        p0.y + dy / 3,
    );
    let pB = new coords(
        pA.x + Math.cos(angle - Math.PI / 3) * unit,
        pA.y + Math.sin(angle - Math.PI / 3) * unit,
    );
    let pC = new coords(
        p1.x - dx / 3,
        p1.y - dy / 3,
    );

    if (limit > 0) {
        KochAlgorithm(p0, pA, limit - 1);
        KochAlgorithm(pA, pB, limit - 1);
        KochAlgorithm(pB, pC, limit - 1);
        KochAlgorithm(pC, p1, limit - 1);
    } else {
        drawLine(p0, pA);
        drawLine(pA, pB);
        drawLine(pB, pC);
        drawLine(pC, p1);
    }
}

let alpha = 1,
    beta = 80,
    k = 0.12,
    k1 = 0.3,
    settings = config(alpha, beta, k, k1);
function config(alpha, beta, k, k1) {
    return {
        A: Math.cos((alpha * Math.PI) / 180),
        B: Math.sin((alpha * Math.PI) / 180),
        C: 1 - k,
        D: k,
        E: 1 - k1,
        F: k1,
        G: Math.cos((beta * Math.PI) / 180),
        H: Math.sin((beta * Math.PI) / 180),
    };
}
function drawBarnsleyFern() {
    console.log("start drawBarnsleyFern");
    clearScreen();
    ctx.strokeStyle = "green";
    bernsleyAlgorithm(WIDTH - 100, HEIGHT / 2 + 80, 50, 180);
    console.log("end drawBarnsleyFern");
};
function bernsleyAlgorithm(x1, y1, x2, y2) {
    if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) > 1) {
        let x3 = (x2 - x1) * settings.A - (y2 - y1) * settings.B + x1;
        let y3 = (x2 - x1) * settings.B + (y2 - y1) * settings.A + y1;
        let x4 = x1 * settings.C + x3 * settings.D;
        let y4 = y1 * settings.C + y3 * settings.D;
        let x5 = x4 * settings.E + x3 * settings.F;
        let y5 = y4 * settings.E + y3 * settings.F;
        let x6 = (x5 - x4) * settings.G - (y5 - y4) * settings.H + x4;
        let y6 = (x5 - x4) * settings.H + (y5 - y4) * settings.G + y4;
        let x7 = (x5 - x4) * settings.G + (y5 - y4) * settings.H + x4;
        let y7 = -(x5 - x4) * settings.H + (y5 - y4) * settings.G + y4;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x4, y4);
        ctx.stroke();

        bernsleyAlgorithm(x4, y4, x3, y3);
        bernsleyAlgorithm(x4, y4, x6, y6);
        bernsleyAlgorithm(x4, y4, x7, y7);
    }
}

function drawMandelbrotSet() {
    console.log("start drawMandelbrotSet");
    clearScreen();
    MandelbrotAlgorithm("orange");
    console.log("end drawMandelbrotSet");
};
function MandelbrotAlgorithm(color_) {
    ctx.translate(0, -(WIDTH - HEIGHT) / 2);
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < WIDTH; y++) {
            let a = (x - WIDTH / 2) / (WIDTH / 5);
            let b = (y - WIDTH / 2) / (WIDTH / 5);
            let z = new ComplexNumber(0, 0);
            let c = new ComplexNumber(a, b);
            let color = color_;
            for (let i = 0; i < 100; i++) {
                z.square().add(c);
                if (z.mag() > 2) {
                    color = "rgb(" + (225 * (i / 100) + 30) + ", 1, 1, 1)";
                    break;
                }
            }
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    ctx.translate(0, (WIDTH - HEIGHT) / 2);
};

function drawLine(p0, p1) {
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
}

function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}