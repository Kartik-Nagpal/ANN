//Create the canvas for User Input and add ~"actionlisteners" for drawing
$(document).ready(function () {
    context = document.getElementById("canvas").getContext("2d");
    var clickX = [];
    var clickY = [];
    var clickDrag = [];
    var paint;

    //create outline context
    outlineContext = document.getElementById("out").getContext("2d");
    outlineContext.fillStyle = "gray";
    outlineContext.strokeStyle = "black";

    $('#canvas').mousedown(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });

    $('#canvas').mousemove(function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });

    $('#canvas').mouseup(function (e) {
        paint = false;
    });

    $('#canvas').mouseleave(function (e) {
        paint = false;
    });

    $("#clear").on("click", function () {
        //clear drawing context
        clickX = [];
        clickY = [];
        clickDrag = [];
        paint = false;
        redraw();

        //clear outline context
        outlineContext.clearRect(0, 0, outlineContext.canvas.width, outlineContext.canvas.height);
    });

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.strokeStyle = "red";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }
}
);

//Create and return an array with 225 items (15x15) which represents a downsampled image
function getDownsampledDrawing() {
    var output = [];
    var blockSize = 10;
    var canvasSizeX = context.canvas.width;
    var canvasSizeY = context.canvas.height;

    for (var x = 0; x < canvasSizeX; x += blockSize) {
        for (var y = 0; y < canvasSizeY; y += blockSize) {
            var data = context.getImageData(x, y, blockSize, blockSize).data;
            var found = false;
            for (var i = 0; i < data.length; i++)
            {
                var layer = [];
                if (data[i])
                {
                    output.push(1);

                    outlineContext.fillRect(x, y, blockSize, blockSize);

                    found = true;
                    break;
                }
            }
            if (!found) {
                output.push(0);
            }
            outlineContext.strokeRect(x, y, blockSize, blockSize);
        }
    }
    return output;
}
