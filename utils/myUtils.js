const fs = require('fs');

module.exports.mkdir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

module.exports.checkUser