var canvas
var canvasWidth
var canvasHeight
var canvasHeat
var canvasLive
var ctx
var ctxHeat
var ctxLive
var ctxDataHeat
var ctxDataLive
var framesRendered = 0;

var colors = [[255, 255, 255],
              [228, 228, 228],
              [136, 136, 136],
              [ 34,  34,  34],
              [255, 167, 209],
              [229,   0,   0],
              [229, 149,   0],
              [160, 106,  66],
              [229, 217,   0],
              [148, 224,  68],
              [  2, 190,   1],
              [  0, 211, 211],
              [  0, 131, 199],
              [  0,   0, 234],
              [207, 110, 228],
              [130,   0, 128]]

// JQuery is fucking useless here because it tries to encode the bitmap as a string.
//   I spent hours discovering this.
var loadCurrentCanvas = function() {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", "https://cors-anywhere.herokuapp.com/https://www.reddit.com/api/place/board-bitmap", true);
  oReq.responseType = "arraybuffer";
  
  oReq.onload = function (event) {
    var arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      var dataArray = []
      for (var i = 0; i < byteArray.byteLength; i++) {
        colorCode = byteArray[i];
        dataArray.push((colorCode >>>  4) & 0xf);
        dataArray.push((colorCode >>>  0) & 0xf);
      }
      for(var i = 0; i < dataArray.length; i++) {
        colorCode = dataArray[i];
        ctxDataLive.data[i*4 + 0] = colors[colorCode][0];
        ctxDataLive.data[i*4 + 1] = colors[colorCode][1];
        ctxDataLive.data[i*4 + 2] = colors[colorCode][2];
      }
    }
  };
  
  oReq.send(null);
}

var addActivity = function(x, y, colorCode) {
  var index = (x + y*canvasWidth) * 4;
  
    ctxDataHeat.data[index + 0] = 255;
    ctxDataHeat.data[index + 1] = 255;
    ctxDataHeat.data[index + 2] = 255;

    ctxDataLive.data[index + 0] = colors[colorCode][0];
    ctxDataLive.data[index + 1] = colors[colorCode][1];
    ctxDataLive.data[index + 2] = colors[colorCode][2];

  
  //ctxData.data[index + 3] = 255;
}

var updateCanvas = function() {
  renderMode = $('form#canvas-controls input:radio[name=visual]:checked').val();
  if(renderMode == 'heat') {
    ctx.putImageData(ctxDataHeat, 0, 0);
  } else if (renderMode == 'live') {
    ctx.putImageData(ctxDataLive, 0, 0);
  }
  framesRendered += 1
  
  if(framesRendered % 64 == 0) {
    for(var i = 0; i < ctxDataHeat.data.length; i++) {
      if(i % 4 != 3) {
        ctxDataHeat.data[i] -= 1;
      }
    }
  }
}

$(document).ready(function(){
  canvas = $('canvas#rendered-canvas')[0];
  canvasHeat = $('canvas#heat-canvas')[0];
  canvasLive = $('canvas#live-canvas')[0];
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  ctx = canvas.getContext('2d');
  ctxHeat = canvasHeat.getContext('2d');
  ctxLive = canvasLive.getContext('2d');
  ctxHeat.fillStyle = 'black';
  ctxHeat.fillRect(0,0,canvasWidth,canvasHeight);
  ctxLive.fillStyle = 'white';
  ctxLive.fillRect(0,0,canvasWidth,canvasHeight);

  ctxDataHeat = ctxHeat.getImageData(0,0,canvasWidth,canvasHeight);
  ctxDataLive = ctxLive.getImageData(0,0,canvasWidth,canvasHeight);

  loadCurrentCanvas();

  setInterval(updateCanvas, 50);
})
