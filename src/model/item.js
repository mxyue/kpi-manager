const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId


const ItemSchema = new Schema({
  title: {type: String},
  description: {type: String},

  authorId: {type: Number},

  assigneeId: {type: Number}, //执行人

  due: {type: Number, default: 0}, //预估工时 
  complex: {type: Number, default: 0}, //复杂度,难度

  codeReview: {type: Number, default: 0}, //code review 得分,可正可负

  bug: {type: Number, default: 0}, //bug扣分
  test: {type: Number, default: 0}, //测试扣分

  score: {type: Number, default: 0}, //总得分

  labels: {type: String}, //标签

  gitlab: {type: {
    pid: Number,
    iid: Number,
  }}, //是否关联 gitlab

  closedAt: {type: Date },
}, {timestamps: true})

ItemSchema.virtual('project', {
  ref: 'Project',
  localField: 'gitlab.pid',
  foreignField: 'nid',
  justOne: true,
})

let Item = mongoose.model('Item', ItemSchema)

module.exports = Item