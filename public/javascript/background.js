$(document).ready(function() {
    const BLUE = "#2482bd";

    var homeContainer = document.getElementById("home");
    var canvas = document.getElementById("homeCanvas");
    var ctx = canvas.getContext("2d");
    resizeCanvas(homeContainer.offsetWidth, homeContainer.offsetHeight - 21 - 20 - 20);

    drawSpikeyBall(100,100, 10);

    function resizeCanvas(width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    function drawTriangle(x1, y1, x2, y2, x3, y3, color, fill) {
        let path = new Path2D();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        path.lineTo(x3, y3);
        

        if (fill) {
            ctx.fillStyle = color;
            ctx.fill(path);
        }
        else {
            path.lineTo(x1, x1);
            ctx.strokeStyle = color;
            ctx.stroke(path);
        }
    }

    function drawCircle(x, y, radius, color, fill) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        fill ? ctx.fillStyle = color : ctx.strokeStyle = color;
        fill ? ctx.fill() : ctx.stroke();
        ctx.closePath();
    }

    function drawSpikeyBall(x, y, radius) {
        let spikeWidth = 1;
        drawCircle(x, y, radius, BLUE, true);
        drawTriangle(x-radius*spikeWidth, y, x+radius*spikeWidth, y, x, y+radius*2, BLUE, true);
        drawTriangle(x-radius*spikeWidth, y, x+radius*spikeWidth, y, x, y-radius*2, BLUE, true);
        drawTriangle(x, y-radius*spikeWidth, x, y+radius*spikeWidth, x+radius*2, y, BLUE, true);
        drawTriangle(x, y-radius*spikeWidth, x, y+radius*spikeWidth, x-radius*2, y, BLUE, true);
    }
});