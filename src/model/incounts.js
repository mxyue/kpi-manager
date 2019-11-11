const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
 

const IncountSchema = new Schema({
  field: {type: String, index: {unique: true}},
  value: {type: Number, default: 1}
})

IncountSchema.statics = {
  incNumber: function(field){
    return this.findOneAndUpdate({field}, {$inc: {value: 1}}, {upsert: true, new: true})
    .then(result => result.value)
  }
}

let Incount = mongoose.model('Incount', IncountSchema)

module.exports = Incount