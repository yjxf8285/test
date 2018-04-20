const fs = require("fs");
const writeFile = function (data) {
  let fData = [];
  data.map(m => {
    if (m.substr(0, 1) !== '.') {
      fData.push('"' + m + '"')
    }
  });
  fData = 'export default [' + fData + ']';
  fs.writeFile(__dirname + '/../src/router/views-name.js', fData, function (err) {
    err && console.error(err);
  });
};
const readDir = function () {
  fs.readdir(__dirname + '/../src/views', function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    writeFile(data);
  });
};

module.exports = readDir;

