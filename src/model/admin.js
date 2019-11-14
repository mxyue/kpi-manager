const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const IncCount  = require('./inccounts')


const AdminSchema = new Schema({
  nid: {type: Number, index: {unique: true}},
  username: {type: String, index: {unique: true}},
  password: {type: String},
}, {timestamps: true})

AdminSchema.pre('save', function(done){
  if(!this.isNew) return done()
  IncCount.incNumber('Admin').then(newId => {
    this.nid = newId
    done()
  })
})

let Admin = mongoose.model('Admin', AdminSchema)


module.exports = Admin