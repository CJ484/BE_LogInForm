"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareString = exports.EncryptString = void 0;
var bcrypt = require('bcrypt');
function EncryptString(str) {
    const salt = bcrypt.genSaltSync(4);
    let result = bcrypt.hashSync(str, salt);
    return result;
}
exports.EncryptString = EncryptString;
function CompareString(str, hashedStr) {
    let result = bcrypt.compareSync(str, hashedStr);
    return result;
}
exports.CompareString = CompareString;
//# sourceMappingURL=Hashing.js.map