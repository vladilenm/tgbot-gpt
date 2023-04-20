import { unlink } from 'fs/promises'
import { bold } from 'telegraf/format'
import { openai } from './openai.js'

const MAX_CONVERSATION_LENGTH = 10

export function normalize() {
  return function (ctx, next) {
    normalizeSession(ctx)
    return next()
  }
}

export async function removeFile(filepath) {
  try {
    await unlink(filepath)
  } catch (e) {
    console.log(`Error while unlinking file: `, e.message)
  }
}

export const gptMessage = (content, role = 'user') => ({
  content,
  role,
})

export const emptySession = () => ({
  messages: [],
  conversations: [],
})

export function initCommand(message) {
  return async function (ctx) {
    ctx.session = emptySession()
    await ctx.reply(message)
  }
}

function normalizeSession(ctx) {
  ctx.session ??= emptySession()
  if (ctx.session.messages.length > MAX_CONVERSATION_LENGTH) {
    ctx.session = emptySession()
  }
}

export const mapContextData = (from) => ({
  telegramId: from.id,
  username: from.username,
  firstname: from.first_name,
})

export function printConversation(conversation) {
  if (!conversation) return 'Ошибка при чтении истории. Чуть позже починю'

  return conversation.messages
    .map((m) => {
      if (m.role === openai.roles.USER) {
        return `<b>- ${m.content}</b>\n\r\n\r`
      }
      return `${m.content}\n\r\n\r`
    })
    .join('')
}
