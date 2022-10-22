var canvas = document.querySelector('#screen');

var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let pixelSize = 2;

class coords
{
    constructor(x_, y_) {
        this.x = x_;
        this.y = y_;
    }
    add(that_) {
        this.x += that_.x;
        this.y += that_.y;
        return this;
    }

    multiply(n_) {
        return new coords(this.x * n_, this.y * n_);
    }

    copy() {
        return new coords(this.x, this.y);
    }

    renderText(text) {
        ctx.fillStyle = "blue";
        ctx.font = "20px Arial";
        ctx.fillText(text, this.x, this.y - 10);
    }

}

const START_POINS = [
    new coords(320, 100),
    new coords(770, 350),
    new coords(770, 50),
    new coords(420, 300),
]

let INITIAL_BEZIER_COORDS = [];

function start() {
    clearScreen();

    console.log("start");

    INITIAL_BEZIER_COORDS = calculateBezierCoords(START_POINS);

    ctx.fillStyle = "black";
    renderBezier(INITIAL_BEZIER_COORDS);

    for (let i = 1; i < START_POINS.length + 1; ++i) {
        const point = START_POINS[i - 1];
        point.renderText(i);
        ctx.fillRect(point.x, point.y, 4, 4);
    }
}

function rotate() {
    let bezierCoords = get_init_bezier_coords();
    ctx.fillStyle = "orange";
    let angle = 0.87;

    console.log("\trotate on ", angle);

    // render arrow

    let matrix = [
        new coords(Math.cos(angle), -Math.sin(angle)),
        new coords(Math.sin(angle), Math.cos(angle)),
    ];
    for (let i = 0; i < bezierCoords.length; ++i) {
        bezierCoords[i] = new coords(
            scalar(matrix[0], bezierCoords[i]),
            scalar(matrix[1], bezierCoords[i]),
        );
    }

    renderBezier(bezierCoords);
}

function scale() {
    let bezierCoords = get_init_bezier_coords();
    ctx.fillStyle = "#0da2dd";
    let size = 0.4;
    console.log("\tscale on ", size);

    // render arrow

    let matrix = [
        new coords(size, 0),
        new coords(0, size),
    ];
    for (let i = 0; i < bezierCoords.length; ++i) {
        bezierCoords[i] = new coords(
            scalar(matrix[0], bezierCoords[i]),
            scalar(matrix[1], bezierCoords[i]),
        );
    }

    renderBezier(bezierCoords);
}

function repulsion() {
    let bezierCoords = get_init_bezier_coords();
    ctx.fillStyle = "green";
    const distanse = 700;
    console.log("\trepilsion on ", distanse);

    let matrix = [
        new coords(1, 0),
        new coords(0, -1),
    ];
    for (let i = 0; i < bezierCoords.length; ++i) {
        bezierCoords[i] = new coords(
            scalar(matrix[0], bezierCoords[i]),
            scalar(matrix[1], bezierCoords[i]),
        );
    }

    matrix = [
        new coords(1, 0),
        new coords(0, 1),
    ];
    for (let i = 0; i < bezierCoords.length; ++i) {
        bezierCoords[i] = new coords(
            scalar(matrix[0], bezierCoords[i]),
            scalar(matrix[1], bezierCoords[i]) + distanse,
        );
    }

    renderBezier(bezierCoords);
}

function move() {
    let bezierCoords = get_init_bezier_coords();
    ctx.fillStyle = "red";
    let move_x = 500;
    let move_y = 200;

    console.log("\move on ", );

    // render arrow

    for (let i = 0; i < bezierCoords.length; ++i) {
        bezierCoords[i] = new coords(
            bezierCoords[i].x + move_x, bezierCoords[i].y + move_y
        );
    }

    renderBezier(bezierCoords);
}

function calculateBezierCoords(coords_) {
    let step = 0.0001;
    let bezierCoords = [];
    let point = coords_[0].copy();

    switch (coords_.length) {
        case 1: console.log("invalid"); break;
        case 2: console.log("invalid"); break;
        case 3: console.log("invalid"); break;
        case 4: {
            for (let t = 0; t < 1; t += step) {
                bezierCoords.push(point);
                point = coords_[0].multiply(Math.pow(1 - t, 3))
                        .add(coords_[1].multiply(3 * t * Math.pow(1 - t, 2)))
                        .add(coords_[2].multiply(3 * (1 - t) * Math.pow(t, 2)))
                        .add(coords_[3].multiply(Math.pow(t, 3)))
            }
            break;
        }
        case 5:  console.log("invalid"); break;
        default: console.log("invalid"); break;
    }

    return bezierCoords;
}

function clearScreen() {
    INITIAL_BEZIER_COORDS.length = 0;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPixel(x, y) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, pixelSize, pixelSize);
}

function scalar(a_, b_) {
    return a_.x * b_.x + a_.y * b_.y;
}

function renderBezier(coords_) {
    coords_.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function get_init_bezier_coords() {
    if (INITIAL_BEZIER_COORDS.length === 0) {
        start()
    }
    return INITIAL_BEZIER_COORDS.map((x) => x);
}