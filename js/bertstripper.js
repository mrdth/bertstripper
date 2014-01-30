var textY = 0;
var lineHeight = 28;
var img = new Image();
var ctx = document.getElementById('canvas').getContext('2d');

function wrapText(text, x, y, lineHeight) {
  
  ctx.font = '18pt Arial';
  
  var maxWidth = ctx.canvas.width *0.9;
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.textAlign = 'center';
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;

    }
    else {
      line = testLine;
    }
  }
  ctx.textAlign = 'center';
      ctx.fillText(line, x, y);
}

function draw(f) {
    var url = window.URL || window.webkitURL,
        src = url.createObjectURL(f);

    img.src = src;
    img.onload = function() {
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height + (lineHeight * 3.5);
        textY = this.height + lineHeight;
        ctx.drawImage(img, 0, 0);
        url.revokeObjectURL(src);
    };
}

$("#uploadimage").on("change", function(){
  if (this.files[0]){
    draw(this.files[0]);
  } else {
    ctx.canvas.width = ctx.canvas.width
  }
});

$("#caption").on("keyup", function(){
  ctx.fillStyle = "white";
  ctx.fillRect(0, img.height, img.width, lineHeight * 3.5);
  ctx.fillStyle = "black";
  wrapText(this.value, img.width / 2, textY, lineHeight);
});

$("#download").on("click", function(){
  bertString = document.getElementById("canvas").toDataURL("image/png");
  $("#canvas").hide();
  $("#bertStrip").attr("src",bertString).show();
  $("#download-text").show();
});