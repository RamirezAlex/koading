'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongo = require('koa-mongo')

const router = new Router()
const app = new Koa()
app.use(bodyParser())
app.use(logger())
app.use(mongo())

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

  const result = await ctx.db.collection('pokemon')
    .insertOne({
      firstName,
      lastName,
      email,
      password
    })

  ctx.status = 201
  const user = result.ops[0]
  delete user.password
  
  ctx.body = {
    user
  }
})

router.get('/users/:id', async(ctx, next) => {
  const { id } = ctx.params

  const user = await ctx.db.collection('pokemon')
    .findOne({ _id : mongo.ObjectId(id) })

  delete user.password
  ctx.body = {
    user
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

  const user = await ctx.db.collection('pokemon')
    .findOne({ email, password })

  if (!user) {
    return ctx.status = 404
  }

  ctx.body = {
    user
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
