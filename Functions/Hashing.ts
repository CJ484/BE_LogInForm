var bcrypt = require('bcrypt');

function EncryptString(str: string) {
    const salt = bcrypt.genSaltSync(4);
    let result = bcrypt.hashSync(str, salt);
    return result;
}

function CompareString(str: string, hashedStr: string) {
    let result = bcrypt.compareSync(str, hashedStr);
    return result;
}

export { EncryptString, CompareString };