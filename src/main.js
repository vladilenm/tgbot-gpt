import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import config from 'config'
import { proccessVoiceMessage, proccessTextMessage } from './logic.js'

export const INITIAL_SESSION = {
  messages: [],
}

console.log(config.get('TELEGRAM_TOKEN'))

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.use(session())

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION
  await ctx.reply('Жду вашего голосового сообщения')
})

bot.command('start', async (ctx) => {
  ctx.session = INITIAL_SESSION
  await ctx.reply('Жду вашего голосового сообщения')
})

// bot.command('image', async (ctx) => {
//   ctx.session = INITIAL_SESSION
//   await ctx.reply('Жду вашего голосового сообщения')
// })

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION
  await proccessVoiceMessage(ctx)
})

bot.on(message('text'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION
  await proccessTextMessage(ctx)
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
