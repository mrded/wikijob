'use strict';

function convertImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContext('2d');
  var img = new Image;

  img.crossOrigin = 'Anonymous';

  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL(outputFormat || 'image/png');

    callback.call(this, dataURL.replace(/^data:image\/(png|jpg);base64,/, ''));

    // Clean up
    canvas = null;
  };

  img.src = url;
}

function convertBlobToBase64(blob, callback) {
  var reader = new window.FileReader();
  reader.readAsDataURL(blob);

  reader.onloadend = function() {
    callback.call(this, reader.result);
  }
}
