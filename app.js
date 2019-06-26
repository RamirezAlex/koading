const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = {
    message: 'Hello, World!'
  }
})

app.listen(3000, console.log('Sever listening in port: 3000'))
