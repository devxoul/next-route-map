import fs from 'fs'
import path from 'path'

export const getConfig = (filename?: string) => {
  const filePath = filename ? filename : 'routes.config.js'
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
      .replace('__dirname', `'${path.resolve(path.dirname(filePath))}'`)
    return eval(content)
  } catch (error) {
    throw error
  }
}
