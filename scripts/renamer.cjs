const sizeOf = require("image-size");
const path = require("path");

function getImageSize(filePath) {
  const normalized = path.normalize(path.join(process.cwd() + filePath));

  sizeOf(normalized, function (err, dimensions) {
    console.log(dimensions.width, dimensions.height);
  });
}

console.log(getImageSize("/png-icons/ac_plug-0.png"));
