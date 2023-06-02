import { readFileSync } from 'fs'
import axios from 'axios'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'

const __dirname = dirname(fileURLToPath(import.meta.url))

class TextConverter {
  async getToken() {
    const key = JSON.parse(
      readFileSync(resolve(__dirname, '../google-key.json'), 'utf8')
    )
    const token = jwt.sign(
      {
        iss: key.client_email,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: 'https://www.googleapis.com/oauth2/v4/token',
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        iat: Math.floor(Date.now() / 1000),
      },
      key.private_key,
      { algorithm: 'RS256' }
    )
    const response = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      }
    )
    return response.data.access_token
  }

  async toSpeech(text) {
    try {
      const request = {
        input: { text },
        voice: { languageCode: 'ru-RU', name: 'ru-RU-Wavenet-B' },
        audioConfig: { audioEncoding: 'MP3' },
      }

      const accessToken = await this.getToken()

      const response = await axios({
        url: 'https://texttospeech.googleapis.com/v1/text:synthesize',
        method: 'post',
        data: request,
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
      })

      return Buffer.from(response.data.audioContent, 'base64')
    } catch (e) {
      console.error('Error while converting text to speech', e.message)
    }
  }
}

export const textConverter = new TextConverter()
