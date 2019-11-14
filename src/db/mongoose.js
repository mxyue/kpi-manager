const mongoose = require('mongoose')
const config = require('config')

let url = `${config.mongo.url}/${config.mongo.dbName}`

mongoose.connect(url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false
})

