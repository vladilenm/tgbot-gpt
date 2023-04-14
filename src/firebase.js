import axios from 'axios'
import config from 'config'

class Firebase {
  constructor(url) {
    this.url = url
  }

  async push(data) {
    try {
      const response = await axios.post(this.url, data)
      return response.data
    } catch (e) {
      console.log(`Error while pushing to firebase`, e.message)
    }
  }

  async read() {
    try {
      const response = await axios.get(this.url)
      return mapFirebaseResponse(response.data)
    } catch (e) {
      console.log(`Error while reading firebase`, e.message)
    }
  }
}

export const firebase = new Firebase(config.get('FIREBASE_URL'))

function mapFirebaseResponse(data) {
  if (!data) return []

  return Object.keys(data).map((id) => ({ id, ...data[id] }))
}

export function dbRecord(data) {
  return {
    cost: null,
    firstname: data.firstname,
    username: data.username,
    messages: data.messages,
  }
}
