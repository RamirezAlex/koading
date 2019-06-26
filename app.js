'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new Koa()

router.get('/', async(ctx, next) => {
  ctx.body = {
    message: 'Hello, World!'
  }
})

router.post('/users', async (ctx, next) => {
  ctx.body = {
    message: '/users'
  }
})

router.get('/users/:id', async(ctx, next) => {
  ctx.body = {
    message: 'users/:id'
  }
})

router.patch('/users/catchPokemon', async(ctx, next) => {
  ctx.body = {
    message: 'users/catchPokemon'
  }
})

router.post('/users/login', async(ctx, next) => {
  ctx.body = {
    message: 'users/login'
  }
})

router.del('/users/removeAccount', async(ctx, next) => {
  ctx.body = {
    message: 'users/removeAccount'
  }
})

router.get('/users/logout', async(ctx,next) => {
  ctx.body = {
    message: 'users/logout'
  }
})

app.use(router.allowedMethods())
app.use(router.routes())

app.listen(3000, console.log('Sever listening in port: 3000'))
