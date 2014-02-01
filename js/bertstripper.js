var app = {
  imgurClientID: "872500c7b1ffd33",
  textY: 0,
  lineHeight: 28,
  img: new Image(),
  ctx: document.getElementById('canvas').getContext('2d'),

  /**
   * Draw text to a canvas, wrapping as necessary.
   * 
   * @param  string text
   *   The text to be drawn.
   * @param  int x
   *   x co-ord to start drawing from.
   * @param  int y
   *   y co-ord to start drawing from.
   * @param  int lineHeight
   *   Line height to use when wrapping text
   */
  wrapText: function(text, x, y, lineHeight) {

    this.ctx.font = '18pt Arial';

    var maxWidth = this.ctx.canvas.width * 0.9;
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = this.ctx.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        this.ctx.textAlign = 'center';
        this.ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += this.lineHeight;
      } else {
        line = testLine;
      }
    }

    this.ctx.textAlign = 'center';
    this.ctx.fillText(line, x, y);
  },

  /**
   * Draw an image to the canvas.
   * 
   * @param  object file
   *   Image object to be drawn.
   */
  drawImage: function(file) {
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

  /**
   * Load an image from a remote URL, and draw it to the canvas
   * 
   * @param  string url
   *   URL of an image to fetch.
   */
  loadImage: function(url) {
    this.img.src = url;

    this.img.onload = function() {
      $("#canvas").removeClass("loading");
      app.ctx.canvas.width = this.width;
      app.ctx.canvas.height = this.height + (app.lineHeight * 3.5);
      app.textY = this.height + app.lineHeight;
      app.ctx.drawImage(app.img, 0, 0);
    };

    this.img.onerror = function() {
      $("#canvas").removeClass("loading");
      app.wipeCanvas();
      $("#imageURL").addClass("bg-danger");
    };
  },

  /**
   * Helper function to blank any text already on the canvas, and draw in new text.
   * 
   * @param string text
   *   Text to be drawn.
   */
  addTextToCanvas: function(text) {
    // Add blank the bottom area of the canvas, to overwrite any previoud text.
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, this.img.height, this.img.width, this.lineHeight * 3.5);

    // Draw the new text string to the canvas.
    this.ctx.fillStyle = "black";
    this.wrapText(text, this.img.width / 2, this.textY, this.lineHeight);
  },

  /**
   * Convert the canvas to a PNG, display it, and return it as a data URL.
   * 
   * @return string
   *   data URL representing the newly created PNG.
   */
  canvasToPNG: function() {
    bertString = document.getElementById("canvas").toDataURL("image/png");
    $("#canvas").hide();
    $("#bertStrip").attr("src", bertString).show();
    $("#download-text").show();
    return bertString;
  },

  /**
   * Helper function to clear the canvas.
   */
  wipeCanvas: function() {
    // Changing the width of a canvas clears it's contents.
    this.ctx.canvas.width = this.ctx.canvas.width;
  },

  /**
   * Post an image anonomously to imgur.com.
   * 
   * @param  string img
   *   The img to be sent, as a data URL. 
   * @param  string title
   *   Title to be used on imgur.com
   *   
   * @return string
   *   
   */
  postToImgur: function(img, title) {

  },

  /**
   * Redirect the browser to the submit page for the sub.
   * 
   * @param  string url
   *   URL of the image on imgur.com
   * @param  string title
   *   Title to use on the submission form (same as used for imgur.com).
   */
  redirectToReddit: function(url, title) {
    var redirect = "http://reddit.com/r/bertstrips/submit?url=";
    redirect += url + "&title=" + title;
    window.location.href = redirect;
  }
};


$("#uploadimage").on("change", function() {

  if (this.files[0]) {
    $("#imageURL").val("");
    app.drawImage(this.files[0]);
  } else {
    app.wipeCanvas();
  }
});

$("#fetchURL").on("click", function(ev) {
  ev.preventDefault();
  $("#clearUpload").click();
  app.wipeCanvas();
  $("#canvas").addClass("loading");
  app.loadImage($("#imageURL").val());
});

$("#imageURL").on('focus', function() {
  $(this).removeClass("bg-danger");
});

$("#caption").on("keyup", function() {
  app.addTextToCanvas(this.value);
});

$("#download").on("click", function() {
  app.canvasToPNG();
});
