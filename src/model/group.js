const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const IncCount  = require('./inccounts')


const GroupSchema = new Schema({
  nid: {type: Number, index: {unique: true}},
}, {timestamps: true})

GroupSchema.pre('save', function(done){
  if(!this.isNew) return done()
  IncCount.incNumber('Group').then(newId => {
    this.nid = newId
    done()
  })
})

let Group = mongoose.model('Group', GroupSchema)

module.exports = Group