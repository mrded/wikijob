'use strict';

Array.prototype.unique = function() {
  var a = this.concat();

  for (var i=0; i<a.length; ++i) {
    for (var j=i+1; j<a.length; ++j) {
      if (JSON.stringify(a[i]) === JSON.stringify(a[j])) {
        a.splice(j, 1);
      }
    }
  }

  return a;
};

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
