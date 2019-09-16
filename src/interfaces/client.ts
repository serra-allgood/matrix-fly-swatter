export interface IClient {
  getJoinedRooms(): Promise<string[]>
  sendStateEvent(roomdID: string, type: string, stateKey: string, content: any): Promise<string>
  getUserId(): Promise<string>
}
