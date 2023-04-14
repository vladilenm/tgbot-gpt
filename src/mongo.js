import { UserModel } from './models/user.model.js'
import { ConversationModel } from './models/conversation.model.js'

export async function createUser(user) {
  try {
    const existingUser = await UserModel.findOne({
      telegramId: user.telegramId,
    })

    if (existingUser) return

    await new UserModel({
      telegramId: user.telegramId,
      firstname: user.firstname,
      username: user.username,
    }).save()
  } catch (e) {
    console.log('Error in creating user', e.message)
  }
}

export async function saveConversation(
  { conversationId, messages },
  telegramId
) {
  try {
    const user = await UserModel.findOne({ telegramId })
    const conversation = conversationId
      ? await ConversationModel.findById(conversationId)
      : new ConversationModel({ messages, userId: user._id })

    conversation.messages = messages
    const data = await conversation.save()
    return data._id
  } catch (e) {
    console.log('Error in creating conversation', e.message)
  }
}
