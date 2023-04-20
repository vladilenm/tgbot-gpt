import { UserModel } from './models/user.model.js'
import { ConversationModel } from './models/conversation.model.js'
import { mapContextData } from './utils.js'

// export function mongoUser() {
//   return (ctx, next) => {
//     createUser(mapContextData(ctx))
//     return next()
//   }
// }

class MondoDB {
  async createUser(from) {
    const user = mapContextData(from)

    try {
      const existingUser = await UserModel.findOne({
        telegramId: user.telegramId,
      })

      if (existingUser) return existingUser

      return await new UserModel({
        telegramId: user.telegramId,
        firstname: user.firstname,
        username: user.username,
      }).save()
    } catch (e) {
      console.log('Error in creating user', e.message)
    }
  }

  async saveConversation(messages, userId) {
    try {
      const conversation = await new ConversationModel({
        messages,
        userId,
      }).save()
      console.log('Conversation', conversation)
    } catch (e) {
      console.log('Error in creating conversation', e.message)
    }
  }
}

export const mongo = new MondoDB()
