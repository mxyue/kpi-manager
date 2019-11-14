const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId


const ProjectSchema = new Schema({
  nid: {type: Number, index: {unique: true}},
  name: {type: String},
  description: {type: String},
}, {timestamps: true})


let Project = mongoose.model('Project', ProjectSchema)


module.exports = Project