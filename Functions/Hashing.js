const bcrypt = require('bcrypt')

function EncryptString (str) {
  const salt = bcrypt.genSaltSync(4)
  const result = bcrypt.hashSync(str, salt)
  return result
}

function CompareString (str, hashedStr) {
  const result = bcrypt.compareSync(str, hashedStr)
  return result
}

module.exports = { EncryptString, CompareString }
