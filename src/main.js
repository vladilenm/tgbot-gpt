import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import config from 'config'
import mongoose from 'mongoose'
import { proccessVoiceMessage, proccessTextMessage } from './logic.js'
import { createUser } from './mongo.js'
import { emptySession } from './utils.js'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.use(session())

bot.use(async (ctx, next) => {
  const mapData = {
    telegramId: ctx.message.from.id,
    username: ctx.message.from.username,
    firstname: ctx.message.from.first_name,
  }
  createUser(mapData)
  return next()
})

bot.command('new', async (ctx) => {
  ctx.session = emptySession()
  await ctx.reply('Жду вашего голосового сообщения')
})

bot.command('start', async (ctx) => {
  ctx.session = emptySession()
  await ctx.reply('Жду вашего голосового сообщения')
})

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= emptySession()
  await proccessVoiceMessage(ctx)
})

bot.on(message('text'), async (ctx) => {
  ctx.session ??= emptySession()
  await proccessTextMessage(ctx)
  // ctx.reply(JSON.stringify(ctx.message.from, null, 2))
})

async function start() {
  try {
    await mongoose.connect(config.get('MONGO_URI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    bot.launch()

    console.log('MongoDB Connected and bot started.')

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
