import fs from 'fs'

export const readJSONFixture = (filePath) => {
  const rawjson = fs.readFileSync(filePath)
  return JSON.parse(rawjson.toString())
}
