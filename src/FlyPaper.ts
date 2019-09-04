import fs from 'fs'
import YAML from 'yaml'
import {
  MatrixClient,
  IStorageProvider, // eslint-disable-line no-unused-vars
  SimpleFsStorageProvider,
  AutojoinRoomsMixin
} from 'matrix-bot-sdk'

import { IConfig } from './interfaces' // eslint-disable-line no-unused-vars

export class FlyPaper {
  private client: MatrixClient

  constructor (configPath = './config.yaml', storageProvider?: IStorageProvider | undefined) {
    const configFile = fs.readFileSync(configPath, 'utf8')
    const config: IConfig = YAML.parse(configFile)
    const sync = storageProvider || new SimpleFsStorageProvider(config.files.syncHistory)

    this.client = new MatrixClient(config.server.url, config.botUser.accessToken, sync)
    this.client.syncingPresence = 'online'
    AutojoinRoomsMixin.setupOnClient(this.client)
  }
}
