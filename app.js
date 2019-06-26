'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongo = require('koa-mongo')
const jsonwebtoken = require('jsonwebtoken')

const router = new Router()
const app = new Koa()
app.use(bodyParser())
app.use(logger())
app.use(mongo())

app.use(async (ctx, next) => {
  switch(ctx.request.url) { 
    case '/users/catchPokemon':
    case '/users/removeAccount':
      try {
        const user = jsonwebtoken.verify(
          ctx.request.header.authorization,
          'hush-hush'
        )
      
        if (!user) {
          return ctx.status = 401
        }
      
        ctx.user = user
        return next()
      } catch (err) {
        ctx.status = 401
        return ctx.body = {
          error: "Authentication failed"
        }
      }
    break;
    default:
      return next()
      break;
  }
})

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

  if(!ctx.user) {
    ctx.status = 401
    return ctx.body = {
      error: "Authentication failed"
    }
  }

  const user = await ctx.db.collection('pokemon')
    .findOne({ _id: mongo.ObjectId(ctx.user.id) })

  const pokemon = {
    name,
    level,
    hitPoints,
    attacks
  }
  
  if(user.pokemons) {
    user.pokemons.push(pokemon)
  } else {
    user.pokemons = [pokemon]
  }

  ctx.body = {
    user
  }
})

router.post('/users/login', async(ctx, next) => {
  const { email, password } = ctx.request.body

  const user = await ctx.db.collection('pokemon')
    .findOne({ email, password })

  if (!user) {
    return ctx.status = 404
  }
  const accessToken = await jsonwebtoken.sign({
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  }, "hush-hush")

  ctx.body = {
    accessToken
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
