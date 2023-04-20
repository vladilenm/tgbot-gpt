import { code } from 'telegraf/format'
import { openai } from './openai.js'
import { ogg } from './ogg.js'
import { gptMessage, removeFile, emptySession } from './utils.js'
import { mongo } from './mongo.js'

export async function proccessVoiceMessage(ctx) {
  try {
    await ctx.reply(code('Секунду. Жду ответ от ChatGPT'))

    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)

    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)
    removeFile(oggPath)
    const text = await openai.transcription(mp3Path)
    removeFile(mp3Path)
    await ctx.reply(code(`Ваш запрос: ${text}`))
    await proccessGPTResponse(ctx, text)
  } catch (e) {
    await ctx.reply(
      `Ошибка с API. Скажи Владилену, чтоб пофиксил. ${e.message}`
    )
    console.error(`Error while proccessing voice message`, e.message)
  }
}

export async function proccessTextMessage(ctx) {
  try {
    await ctx.reply(code('Секунду. Жду ответ от ChatGPT'))
    await proccessGPTResponse(ctx, ctx.message.text)
  } catch (e) {
    await ctx.reply(
      `Ошибка с API. Скажи Владилену, чтоб пофиксил. ${e.message}`
    )
    console.error(`Error while proccessing text message`, e.message)
  }
}

export async function handleCallbackQuery(ctx) {
  try {
    if (ctx.update.callback_query.data === 'save_conversation') {
      const user = await mongo.createUser(ctx.update.callback_query.from)
      await mongo.saveConversation(ctx.session.messages, user._id)
      ctx.session = emptySession()
      await ctx.reply('Переписка сохранена и закрыта. Вы можете начать новую.')
    }
  } catch (e) {
    console.error(`Error while handling callback query`, e.message)
  }
}

async function proccessGPTResponse(ctx, text) {
  try {
    ctx.session.messages.push(gptMessage(text))
    const response = await openai.chat(ctx.session.messages)

    if (!response)
      return await ctx.reply(
        `Ошибка с API. Скажи Владилену, чтоб пофиксил. ${response}`
      )

    ctx.session.messages.push(
      gptMessage(response.content, openai.roles.ASSISTANT)
    )

    await ctx.reply(response.content, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Сохранить и закончить переписку?',
              callback_data: 'save_conversation',
            },
          ],
        ],
      },
    })
  } catch (e) {
    console.log(`Error while proccessing gpt response`, e.message)
  }
}
