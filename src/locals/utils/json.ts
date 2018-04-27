import * as jsonfile from 'jsonfile'

export const write = (path: string, object: any): void => {
  jsonfile.writeFileSync(path, object)
}

export const read = (path: string): any => {
  return jsonfile.readFileSync(path)
}