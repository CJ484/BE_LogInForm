var bcrypt = require('bcrypt');

function EncryptString(str) {
    const salt = bcrypt.genSaltSync(4);
    let result = bcrypt.hashSync(str, salt);
    return result;
}

function CompareString(str, hashedStr) {
    let result = bcrypt.compareSync(str, hashedStr);
    return result;
}

module.exports = { EncryptString, CompareString };