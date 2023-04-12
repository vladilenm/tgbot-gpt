import { unlink } from 'fs/promises'

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
