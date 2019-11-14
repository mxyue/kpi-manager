const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId


const UserSchema = new Schema({
  nid: {type: Number, index: {unique: true}},
  name: {type: String},
  username: {type: String, index: {unique: true}},
  avatarUrl: {type: String},
  state: {type: String, enum: ['active','blocked']},
}, {timestamps: true})


let User = mongoose.model('User', UserSchema)


module.exports = User