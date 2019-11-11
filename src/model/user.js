const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const Incount  = require('./incounts')


const UserSchema = new Schema({
  nid: {type: Number, index: {unique: true}},
  name: {type: String},
  username: {type: String, index: {unique: true}},
  avatar_url: {type: String},
}, {timestamps: true})

UserSchema.pre('save', function(done){
  if(!this.isNew) return done()
  Incount.incNumber('User').then(newId => {
    this.id = newId
    done()
  })
})

let User = mongoose.model('User', UserSchema)


module.exports = User