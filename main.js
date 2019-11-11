const config = require('config')
const app = require('./src/app')

app.on('error', (err, ctx) => {
  console.error('server error', err)
})

let server = app.listen(config.port)
log(`http server run port: ${config.port}`)