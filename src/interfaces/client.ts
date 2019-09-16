export interface IClient {
  getJoinedRooms(): Promise<string[]>
  sendStateEvent(roomID: string, type: string, stateKey: string, content: any): Promise<string>
  getUserId(): Promise<string>
  getRoomStateEvent(roomID: string, type: string, stateKey: string): Promise<any>
  minPowerLevel(): number
  approvedUsers(): string[]
}
