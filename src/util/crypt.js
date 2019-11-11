const bcrypt = require('bcrypt')
const saltRounds = 10

async function encode(plaintext) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (!err) reject(err)
      bcrypt.hash(plaintext, salt, function (err, hash) {
        if (!err) reject(err)
        resolve(hash)
      })
    })
  })
}

async function compare(plaintext, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plaintext, hash, function (err, result) {
      resolve(result)
    })
  })
}

module.exports = {
  encode,
  compare
}