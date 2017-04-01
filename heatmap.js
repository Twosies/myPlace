var canvas
var canvasWidth
var canvasHeight
var ctx
var ctxData
var framesRendered = 0;

var addActivity = function(x, y) {
  var index = (x + y*canvasWidth) * 4;

  ctxData.data[index + 0] = 255;
  ctxData.data[index + 1] = 255;
  ctxData.data[index + 2] = 255;
  //ctxData.data[index + 3] = 255;
}

var updateCanvas = function() {
  ctx.putImageData(ctxData, 0, 0);
  framesRendered += 1
  
  if(framesRendered % 16 == 0) {
    for(var i = 0; i < ctxData.data.length; i++) {
      if(i % 4 != 3) {
        ctxData.data[i] -= 1;
      }
    }
  }
  
}

$(document).ready(function(){
  canvas = $('canvas#heatmap')[0];
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvasWidth,canvasHeight);
  ctxData = ctx.getImageData(0,0,canvasWidth,canvasHeight);

  setInterval(updateCanvas, 50);
})