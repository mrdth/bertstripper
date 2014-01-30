var app = {
  
  textY : 0,
  lineHeight : 28,
  img : new Image(),
  ctx : document.getElementById('canvas').getContext('2d'),

  wrapText : function (text, x, y, lineHeight) {
    
    this.ctx.font = '18pt Arial';
    
    var maxWidth = this.ctx.canvas.width *0.9;
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = this.ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.ctx.textAlign = 'center';
        this.ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += this.lineHeight;
      }
      else {
        line = testLine;
      }
    }
    this.ctx.textAlign = 'center';
        this.ctx.fillText(line, x, y);
  },
  
  drawImage : function(file) {
      var url = window.URL || window.webkitURL,
          src = url.createObjectURL(file);

      this.img.src = src;
      this.img.onload = function() {
          app.ctx.canvas.width = this.width;
          app.ctx.canvas.height = this.height + (app.lineHeight * 3.5);
          app.textY = this.height + app.lineHeight;
          app.ctx.drawImage(app.img, 0, 0);
          url.revokeObjectURL(src);
      };
  },

  addTextToCanvas : function(text) {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, this.img.height, this.img.width, this.lineHeight * 3.5);
    this.ctx.fillStyle = "black";
    this.wrapText(text, this.img.width / 2, this.textY, this.lineHeight);
  },

  canvasToPNG : function() {
    bertString = document.getElementById("canvas").toDataURL("image/png");
    $("#canvas").hide();
    $("#bertStrip").attr("src",bertString).show();
    $("#download-text").show();
  },

  wipeCanvas : function() {
    this.ctx.canvas.width = this.ctx.canvas.width;
  }
};

$("#uploadimage").on("change", function(){
  if (this.files[0]){
    app.drawImage(this.files[0]);
  } else {
    app.wipeCanvas();
  }
});

$("#caption").on("keyup", function(){
  app.addTextToCanvas(this.value);
});

$("#download").on("click", function(){
  app.canvasToPNG();
});