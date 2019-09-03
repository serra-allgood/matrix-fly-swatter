export interface IConfig {
  server: {
    url: string,
    name: string
  }
  botUser: {
    accessToken: string,
    mxid: string,
    name: string,
    avatar: string
  }
  files: {
    syncHistory: string
  }
}
