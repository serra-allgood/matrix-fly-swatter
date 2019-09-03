import fs from 'fs'
import YAML from 'yaml'
import { IConfig } from 'interfaces' // eslint-disable-line no-unused-vars

export class FlyPaper implements IConfig {
  public server: { url: string, name: string }
  public botUser: { mxid: string, name: string, accessToken: string, avatar: string }
  public files: { syncHistory: string }

  constructor (configPath = './config.yaml') {
    const configFile = fs.readFileSync(configPath, 'utf8')
    const config = YAML.parse(configFile)

    this.server = config.server
    this.botUser = config.botUser
    this.files = config.files
  }
}
