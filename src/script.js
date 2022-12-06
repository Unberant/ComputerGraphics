var canvas = document.querySelector('#screen');

var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let pixelSize = 2;
ctx.lineWidth = 2;

class coords{
    constructor(x_, y_)
    {
        this.x = x_;
        this.y = y_;
    }
}

const squareCoords = new coords(200, 300);
const squareWidth  = 200;
const defaultColor = { r: 200, g: 100, b: 200, a: 255 };

const figure = () => {
    ctx.beginPath();
    ctx.moveTo(800, 350);
    ctx.bezierCurveTo(850, 250, 950, 350, 850, 400);
    ctx.bezierCurveTo(950, 450, 850, 550, 800, 450);
    ctx.bezierCurveTo(750, 550, 650, 450, 750, 400);
    ctx.bezierCurveTo(650, 350, 750, 250, 800, 350);
    ctx.stroke();
};

function startScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // square
    ctx.rect(squareCoords.x, squareCoords.y, squareWidth, squareWidth);
    ctx.stroke();

    // clover
    figure();

    document.getElementById("timeRequired1").innerHTML = "Витрачений час для 1 фігури: ";
    document.getElementById("timeRequired2").innerHTML = "Витрачений час для 2 фігури: ";
}

async function fillFuse()
{
    startScreen();
    await new Promise(x => setTimeout(x, 2));

    {
        const start = window.performance.now()
        zatravka(squareCoords.x + 1, squareCoords.y + 1, defaultColor);
        const end = window.performance.now()
        outputTime(end - start, 1);
    }
    {
        const start = window.performance.now()
        zatravka(800, 400, defaultColor);
        const end = window.performance.now()
        outputTime(end - start, 2);
    }
}

async function fillXor()
{
    startScreen();
    await new Promise(x => setTimeout(x, 2));

    {
        const start = window.performance.now();
        xor(squareCoords.x - 1, squareCoords.x + squareWidth,
            squareCoords.y, squareCoords.y + squareWidth,
            defaultColor);
        const end = window.performance.now()
        outputTime(end - start, 1);
    }
    {
        // 730, 330 860, 480
        const start = window.performance.now()
        rightHand(800, 400, defaultColor);
        const end = window.performance.now()
        outputTime(end - start, 2);
    }
}

async function fillRecursion()
{
    startScreen();
    await new Promise(x => setTimeout(x, 2));

    {
        const start = window.performance.now()
        algDotRecurs(squareCoords.x + 1, squareCoords.y + 1, defaultColor);
        const end = window.performance.now()
        outputTime(end - start, 1);
    }
    {
        const start = window.performance.now()
        algDotRecurs(730, 330, defaultColor); // left top
        algDotRecurs(860, 330, defaultColor); // right top
        algDotRecurs(860, 480, defaultColor); // right bottom
        const end = window.performance.now()
        outputTime(end - start, 2);
    }
}

async function fill4th()
{
    startScreen();
    await new Promise(x => setTimeout(x, 2));

    {
        const start = window.performance.now()
        rightHand(squareCoords.x + 1, squareCoords.y + 1,
            defaultColor);
        const end = window.performance.now()
        outputTime(end - start, 1);
    }
    {
        const start = window.performance.now()
        rightHand(800, 400, defaultColor);
        const end = window.performance.now()
        outputTime(end - start, 2);
    }
}

// functions
function zatravka(x, y, color) {
    let startColor = ctx.getImageData(x, y, 1, 1).data;
    if (
        startColor[0] === color.r &&
        startColor[1] === color.g &&
        startColor[2] === color.b &&
        startColor[3] === color.a
    )
        return;
    plot.color = color;
    let q = [[x, y]];
    for (let i = 0; i != q.length; i++) {
        let x = q[i][0],
            y = q[i][1];
        var data = ctx.getImageData(x, y, 1, 1).data;
        if (
            x >= 0 &&
            y >= 0 &&
            x < screen.width &&
            y < screen.height &&
            data[0] == startColor[0] &&
            data[1] == startColor[1] &&
            data[2] == startColor[2] &&
            data[3] == startColor[3]
        ) {
            plot(x, y, 1);
            let s = q.length;
            q[s] = [x + 1, y];
            q[s + 1] = [x - 1, y];
            q[s + 2] = [x, y + 1];
            q[s + 3] = [x, y - 1];
        }
    }
}
function xor(x, x2, y, y2, color) {
    let fl = true;
    let startColor = ctx.getImageData(x, y, 1, 1).data;
    if (
        startColor[0] === color.r &&
        startColor[1] === color.g &&
        startColor[2] === color.b &&
        startColor[3] === color.a
    )
    { return; }

    for (let y0 = y - 1; y0 < y2; y0++) {
        fl = false;
        for (let x0 = x - 1; x0 < x2 - 1; x0++) {
            let data = ctx.getImageData(x0, y0, 1, 1).data;
            let data1 = ctx.getImageData(x0 + 1, y0, 1, 1).data;
            if (
                (data[0] != startColor[0] ||
                    data[1] != startColor[1] ||
                    data[2] != startColor[2] ||
                    data[3] != startColor[3]) &&
                (data1[0] != color.r ||
                    data1[1] != color.g ||
                    data1[2] != color.b ||
                    data1[3] != color.a)
            )
            {
                fl = !fl;
            }
            if (fl)
            {
                plot.color = { r: 0, g: 0, b: 0, a: 0 };
                plot(x0 + 1, y0, 1);
            }
        }
    }
    yxxxxxxxx = 0;
    for (let y0 = y - 1; y0 < y2; y0++) {
        x0 = x2 - 1;
        let data = ctx.getImageData(x0, y0, 1, 1).data;
        while (
            x0 > x - 2 &&
            data[0] == 0 &&
            data[1] == 0 &&
            data[2] == 0 &&
            data[3] == 0
        ) {

            plot.color = {
                r: startColor[0],
                g: startColor[1],
                b: startColor[2],
                a: startColor[3],
            };
            plot(x0 + 1, y0, 1);
            x0--;
        }
    }
    for (let y0 = y - 1; y0 < y2; y0++) {
        fl = false;
        for (let x0 = x - 1; x0 < x2 - 1; x0++) {
            let data = ctx.getImageData(x0, y0, 1, 1).data;
            if (data[0] == 0 && data[1] == 0 && data[2] == 0) {
                fl = !fl;
            }
            if (fl) {
                plot.color = color;
                plot(x0 + 1, y0, 1);
            }
        }
    }
}
function algDotRecurs(x, y, color) {
    let startColor = ctx.getImageData(x, y, 1, 1).data;
    if (
        startColor[0] != color.r ||
        startColor[1] != color.g ||
        startColor[2] != color.b ||
        startColor[3] != color.a
    )
    dotRecursive(x, x, y, color, startColor);
}
function dotRecursive(x1, x2, y, color, startColor) {
    let xL, xR;
    if (y < 0 || screen.height < y) return;
    for (xL = x1; xL >= 0; --xL) {
        let data = ctx.getImageData(xL, y, 1, 1).data;
        if (
            data[0] != startColor[0] ||
            data[1] != startColor[1] ||
            data[2] != startColor[2] ||
            data[3] != startColor[3]
        )
            break;
        plot.color = color;
        plot(xL, y, 1);
    }
    if (xL < x1) {
        dotRecursive(xL, x1, y - 1, color, startColor);
        dotRecursive(xL, x1, y + 1, color, startColor);
        ++x1;
    }
    for (xR = x2; xR <= screen.width; ++xR) {
        let data = ctx.getImageData(xR, y, 1, 1).data;
        if (
            data[0] != startColor[0] ||
            data[1] != startColor[1] ||
            data[2] != startColor[2] ||
            data[3] != startColor[3]
        )
            break;
        plot.color = color;
        plot(xR, y, 1);
    }
    if (xR > x2) {
        dotRecursive(x2, xR, y - 1, color, startColor);
        dotRecursive(x2, xR, y + 1, color, startColor);
        --x2;
    }
    for (xR = x1; xR <= x2 && xR <= screen.width; ++xR) {
        let data = ctx.getImageData(xR, y, 1, 1).data;
        if (
            data[0] == startColor[0] &&
            data[1] == startColor[1] &&
            data[2] == startColor[2] &&
            data[3] == startColor[3]
        ) {
            plot.color = color;
            plot(xR, y, 1);
        } else {
            if (x1 < xR) {
                dotRecursive(x1, xR - 1, y - 1, color, startColor);
                dotRecursive(x1, xR - 1, y + 1, color, startColor);
                x1 = xR;
            }
            for (; xR <= x2 && xR <= screen.width; ++xR) {
                let data = ctx.getImageData(xR, y, 1, 1).data;
                if (
                    data[0] == startColor[0] &&
                    data[1] == startColor[1] &&
                    data[2] == startColor[2] &&
                    data[3] == startColor[3]
                ) {
                    x1 = xR--;
                    break;
                }
            }
        }
    }
}
function rightHand(x, y, color) {
    let startColor = ctx.getImageData(x, y, 1, 1).data;
    if (
        startColor[0] === color.r &&
        startColor[1] === color.g &&
        startColor[2] === color.b &&
        startColor[3] === color.a
    )
        return;
    let stackSize = (screen.width + 2) * (screen.height + 2);
    let stackHead = 0;
    let stackTail = 0;
    let stackX = new Array(stackSize);
    let stackY = new Array(stackSize);
    stackX[stackHead] = x;
    stackY[stackHead] = y;
    plot.color = color;
    plot(x, y, 1);
    stackHead++;
    while (stackHead < stackSize && stackHead > stackTail) {
        x = stackX[stackTail];
        y = stackY[stackTail];
        stackTail++;
        if (x > 0 && y > 0 && x < screen.width && y < screen.height) {
            let dataR = ctx.getImageData(x + 1, y, 1, 1).data;
            if (
                dataR[0] == startColor[0] &&
                dataR[1] == startColor[1] &&
                dataR[2] == startColor[2] &&
                dataR[3] == startColor[3]
            ) {
                stackX[stackHead] = x + 1;
                stackY[stackHead] = y;
                plot(x + 1, y, 1);
                stackHead++;
            }
            let dataL = ctx.getImageData(x - 1, y, 1, 1).data;
            if (
                dataL[0] == startColor[0] &&
                dataL[1] == startColor[1] &&
                dataL[2] == startColor[2] &&
                dataL[3] == startColor[3]
            ) {
                stackX[stackHead] = x - 1;
                stackY[stackHead] = y;
                plot(x - 1, y, 1);
                stackHead++;
            }
            let dataD = ctx.getImageData(x, y + 1, 1, 1).data;
            if (
                dataD[0] == startColor[0] &&
                dataD[1] == startColor[1] &&
                dataD[2] == startColor[2] &&
                dataD[3] == startColor[3]
            ) {
                stackX[stackHead] = x;
                stackY[stackHead] = y + 1;
                plot(x, y + 1, 1);
                stackHead++;
            }
            let dataU = ctx.getImageData(x, y - 1, 1, 1).data;
            if (
                dataU[0] == startColor[0] &&
                dataU[1] == startColor[1] &&
                dataU[2] == startColor[2] &&
                dataU[3] == startColor[3]
            ) {
                stackX[stackHead] = x;
                stackY[stackHead] = y - 1;
                plot(x, y - 1, 1);
                stackHead++;
            }
        }
    }
}

var plot = function (x, y, c) {
    if (isFinite(x) && isFinite(y)) {
        var color = {
            r: plot.color.r,
            g: plot.color.g,
            b: plot.color.b,
            a: plot.color.a * c,
        };
        setPixel(x, y, color);
    }
};

function setPixel(x, y, c) {
    c = c || 1;
    let p = ctx.createImageData(1, 1);
    p.data[0] = c.r;
    p.data[1] = c.g;
    p.data[2] = c.b;
    p.data[3] = c.a;
    let data = ctx.getImageData(x, y, 1, 1).data;
    if (data[3] <= p.data[3]) { 
        ctx.putImageData(p, x, y);
    }
}

function outputTime(ms_, figureIndex) {
    let ms = Math.round(ms_ * 1000) / 1000;
    document.getElementById("timeRequired" + figureIndex.toString()).innerHTML = "Витрачений час для " + figureIndex.toString()+ " фігури: " + ms + " мілісекунд";
}