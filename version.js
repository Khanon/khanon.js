const fs = require('fs');
var package = require('./package.json');

fs.writeFileSync('./public/version.txt', package.version);
