var canvas = document.querySelector('#screen');

var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let pixelSize = 2;

function drawSurname() {
    clearScreen();
    setPisexSize(3);

    const start = window.performance.now()
    // width = "1200" height = "800"

    // T
    ddaSegment(100, 300, 300, 300);
    ddaSegment(200, 300, 200, 500);

    // a
    bresenhamCircle(298, 450, 50);
    ddaSegment(350, 400, 350, 475);
    ddaSegment(350, 475, 365, 500);
    ddaSegment(365, 500, 375, 500);

    // r
    ddaSegment(400, 400, 400, 500);
    ddaSegment(400, 450, 417, 424);
    ddaSegment(417, 424, 434, 412);
    ddaSegment(434, 412, 451, 406);
    ddaSegment(451, 406, 468, 404);
    ddaSegment(468, 404, 468, 415);

    //a
    bresenhamCircle(548, 450, 50);
    ddaSegment(600, 400, 600, 475);
    ddaSegment(600, 475, 615, 500);
    ddaSegment(615, 500, 625, 500);

    // n
    bresenhamHalfCircle(702, 450, 50, 650, 450, 750, 450);
    ddaSegment(650, 400, 650, 500);
    ddaSegment(752.5, 447, 752.5, 500);
    
    // i
    ddaSegment(800, 400, 800, 500);
    bresenhamCircle(802, 365, 5);

    // c
    bresenhamHalfCircle(902, 450, 50, 950, 450, 850, 450);
    bresenhamHalfCircle(902, 450, 50, 900, 500, 900, 400);
    ddaSegment(900, 400, 900, 410);

    // h
    bresenhamHalfCircle(1052, 450, 50, 1000, 450, 1100, 450);
    ddaSegment(1000, 300, 1000, 500);
    ddaSegment(1102.5, 447, 1102.5, 500);

    outputTime(window.performance.now() - start);
    setPisexSize(2);
}

function drawDDA() {
    clearScreen();
    const start = window.performance.now()
    ddaSegment(100, 200, 1100, 200);
    outputTime(window.performance.now() - start);
}

function drawBresenhamLine() {
    clearScreen();
    const start = window.performance.now()
    bresenhamSegment(100, 300, 1100, 300);
    outputTime(window.performance.now() - start);
}

function drawWu() {
    clearScreen();
    const start = window.performance.now()
    wuSegment(100, 400, 1100, 400);
    outputTime(window.performance.now() - start);
}

function drawBresenhamCircle() {
    clearScreen();
    const start = window.performance.now()
    bresenhamCircle(600, 400, 300);
    outputTime(window.performance.now() - start);
}

function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("timeRequired").innerHTML = "Витрачений час: ";
}

function ddaSegment(x1, y1, x2, y2) {
    if (x1 == x2) {
        drawPixel(x1, y1);
        while (y1 < y2) {
            y1 = y1 + 1.0;
            drawPixel(x1, y1);
        }
    } else {
        let Px = x2 - x1;
        let Py = y2 - y1;
        drawPixel(x1, y1);
        while (x1 < x2) {
            x1 = x1 + 1.0;
            y1 = y1 + Py / Px;
            drawPixel(x1, y1);
        }
    }
}

function bresenhamSegment(x1, y1, x2, y2) {
    let error = 0;
    if (x1 == x2) {
        let x = x1;
        for (let y = y1; y < y2; y++) {
            drawPixel(x, y);
        }
    } else {
        let deltaerr = Math.abs(y2 - y1) / Math.abs(x2 - x1);
        let y = y1;
        let dirY = (y2 - y1 > 0) ? 1 : -1;
        for (let x = x1; x < x2; x++) {
            drawPixel(x, y);
            error += deltaerr;
            if (error >= 0.5) {
                y += dirY;
                error -= 1.0;
            }
        }
    }
}

function bresenhamCircle(x1, y1, R) {
    let x = 0;
    let y = R;
    let delta = 1 - 2 * R;
    let error = 0;
    while (y >= 0) {
        drawPixel(x1 + x, y1 + y);
        drawPixel(x1 + x, y1 - y);
        drawPixel(x1 - x, y1 + y);
        drawPixel(x1 - x, y1 - y);
        error = 2 * (delta + y) - 1;
        if ((delta < 0) && (error <= 0)) {
            delta += 2 * ++x + 1;
            continue;
        }
        if ((delta > 0) && (error > 0)) {
            delta -= 2 * --y + 1;
            continue;
        }
        delta += 2 * (++x - y--);
    }
}
function bresenhamHalfCircle(x1, y1, R, dirX1, dirY1, dirX2, dirY2) {
    bresenhamCircle(x1, y1, R);

    ctx.fillStyle = "white";
    if (dirX1 == dirX2) {
        const width = R + 20;
        const height = 2*  R + 20;
        if (dirY1 < dirY2) {
            ctx.fillRect(dirX1 - R, dirY1, width, height);
        }
        else {
            ctx.fillRect(dirX2, dirY2, width, R + 20);
        }
    }
    else if (dirY1 == dirY2) {
        const width = 2 * R + 5 + 20;
        const height = R + 5 + 20;
        if (dirX1 < dirX2) {
            ctx.fillRect(dirX1, dirY1, width, height);
        }
        else {
            ctx.fillRect(dirX2, dirY2 - R, width, height);
        }
    }
}

function wuSegment(x1, y1, x2, y2) {
    if (x1 == x2) {
        drawPixel(Math.floor(x1), round(y1));
        drawPixel(Math.floor(x1) + 1, round(y1));
        drawPixel(Math.floor(x2), round(y2));
        drawPixel(Math.floor(x2) + 1, round(y2));
        for (var y = round(y1) + 1; y < round(y2) - 1; y++) {
            drawPixel(Math.floor(x1), y);
            drawPixel(Math.floor(x1) + 1, y);
        }
    } else {
        let dx = x2 - x1;
        let dy = y2 - y1;
        if (Math.abs(dx) < Math.abs(dy)) {
            x1 = [y1, y1 = x1][0];
            x2 = [y2, y2 = x2][0];
            dx = [dy, dy = dx][0];
        }
        if (x2 < x1) {
            x1 = [x2, x2 = x1][0];
            y1 = [y2, y2 = y1][0];
        }
        let gradient = dy / dx;
        let yend = y1 + gradient * (round(x1) - x1);
        let xpxl1 = round(x1);
        let ypxl1 = Math.floor(yend);
        drawPixel(xpxl1, ypxl1);
        drawPixel(xpxl1, ypxl1 + 1);
        let intery = yend + gradient;
        yend = y2 + gradient * (round(x2) - x2);
        let xpxl2 = round(x2);
        let ypxl2 = Math.floor(yend);
        drawPixel(xpxl2, ypxl2);
        drawPixel(xpxl2, ypxl2 + 1);
        for (var x = xpxl1 + 1; x < xpxl2 - 1; x++) {
            drawPixel(x, Math.floor(intery));
            drawPixel(x, Math.floor(intery) + 1);
            intery = intery + gradient;
        }
    }
}

function drawPixel(x, y) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, pixelSize, pixelSize);
}

function setPisexSize(x_) {
    pixelSize = x_;
}

function round(x) {
    return Math.floor(x + 0.5);
}

function outputTime(ms_) {
    let ms = Math.round(ms_ * 1000) / 1000;
    document.getElementById("timeRequired").innerHTML = "Витрачений час: " + ms + " мілісекунд";
}