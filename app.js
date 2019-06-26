'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')

const router = new Router()
const app = new Koa()
app.use(bodyParser())
app.use(logger())

router.get('/', async(ctx, next) => {
  ctx.body = {
    message: 'Hello, World!'
  }
})

router.post('/users', async (ctx, next) => {
  const {
    firstName,
    lastName,
    email,
    password
  } = ctx.request.body

  ctx.body = {
    message: '/users',
  }
})

router.get('/users/:id', async(ctx, next) => {
  const { id } = ctx.params

  ctx.body = {
    message: 'users/:id',
    params: ctx.params
  }
})

router.patch('/users/catchPokemon', async(ctx, next) => {
  const {
    name,
    level,
    hitPoints,
    attacks
  } = ctx.request.body

  ctx.body = {
    message: 'users/catchPokemon',
  }
})

router.post('/users/login', async(ctx, next) => {
  const { email, password } = ctx.request.body

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
