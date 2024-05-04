const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/drawingHub")
    .build();


var parts = window.location.href.split('/');
var boardId = parts.pop() || parts.pop();


hubConnection.on("ReceiveDrawAction", function (message) {

   /* console.log(message);*/
    img.src = message;
});

hubConnection.start()
    .then(function () {
        hubConnection.invoke("JoinBoard", boardId)  
        .catch(err => {
            console.log(err);
        });
    })
    .catch(function (err) {
        return console.error(err.toString());
    });




const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
const zoomSlider = document.getElementById('zoomSlider');
const zoomValueDisplay = document.getElementById('zoomValue');
var img = new Image();

img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
}

let currentTool = 'pencil';
let currentColor = 'black';
let currentLineWidth = 1;
let currentThickness = 1;
let painting = false;


function Scale() {
   /* context.scale(x, y);*/
    let scale = parseInt(zoomSlider.value) / 100;
    let x = (canvas.width - img.width * scale) / 2;
    let y = (canvas.height - img.height * scale) / 2;
    context.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

zoomSlider.addEventListener('input', function () {
    Scale();
    zoomValueDisplay.textContent = this.value + '%';  
});


//function saveThumbnail() {
//    var thumbnailDataURL = canvas.toDataURL();
//    fetch('/save-thumbnail', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({ imageData: thumbnailDataURL })
//    })
//        .then(response => response.json())
//        .then(data => console.log('Thumbnail saved successfully:', data))
//        .catch(error => console.error('Error saving thumbnail:', error));
//}
//function loadCanvas() {
//    fetch('/get-thumbnail')
//        .then(response => response.json())
//        .then(data => {
//            var img = new Image();
//            img.onload = function () {
//                context.clearRect(0, 0, canvas.width, canvas.height);
//                context.drawImage(img, 0, 0); 
//            };
//            img.src = data.imageData;
//        })
//        .catch(error => console.error('Error loading canvas:', error));
//}

function SendPicture() {

    var picturedata = canvas.toDataURL();
    hubConnection.invoke("SendDrawAction", boardId, picturedata)
        .catch(function (err) {
            return console.error(err.toString());
        });
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('tool').addEventListener('change', function () {
        currentTool = this.value;
    });

    document.getElementById('color').addEventListener('change', function () {
        currentColor = this.value;
    });

    document.getElementById('thickness').addEventListener('change', function () {
        currentThickness = parseInt(this.value);
    });

    document.getElementById('clearCanvas').addEventListener('click', function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('drawRectangleButton').addEventListener('click', function () {
        if (currentTool === 'rectangle') {
            drawRectangle(50, 50, 200, 100);
        }
    });
    document.getElementById('drawCircleButton').addEventListener('click', function () {
        if (currentTool === 'circle') {
            drawCircle(150, 150, 50);
        }
    });
    /*document.getElementById('saveThumbnailButton').addEventListener('click', saveThumbnail);*/

    document.getElementById('downloadJPEGButton').addEventListener('click', downloadJPEG);

    function handleDrawing(e) {
        if (!painting) return;
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        if (currentTool === 'rectangle') {
            drawRectangle(x, y, 100, 50);
        }
        else if (currentTool === 'circle') {
            drawCircle(x, y, 50);
        }
        else {
            context.lineTo(x, y);
            context.strokeStyle = currentColor;
            context.lineWidth = currentThickness;
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);
        }
        SendPicture();
       /* saveThumbnail();*/
    }

    canvas.addEventListener('mousedown', (e) => {
        painting = true;
        handleDrawing(e);
    });

    canvas.addEventListener('mousemove', handleDrawing);

    canvas.addEventListener('mouseup', () => {
        painting = false;
        context.beginPath();
    });

    canvas.addEventListener('mouseout', () => {
        painting = false;
    });
});
function drawRectangle(x, y, width, height) {
    context.beginPath();
    context.rect(x, y, width, height);
    context.fillStyle = currentColor;
    context.fill();
    context.lineWidth = currentLineWidth;
    context.strokeStyle = currentColor;
    context.stroke();
}
function drawCircle(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fillStyle = currentColor;
    context.fill();
    context.lineWidth = currentLineWidth;
    context.strokeStyle = currentColor;
    context.stroke();
}
function prepareTransparency(canvas, ctx) {
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

function downloadJPEG()
{
    prepareTransparency(canvas, context);
    var dataURL = canvas.toDataURL('image/jpeg');
    var link = document.createElement('a');
    link.download = 'my-drawing.jpeg';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
