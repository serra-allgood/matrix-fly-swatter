import { IClient } from './interfaces' // eslint-disable-line no-unused-vars

interface IEvent {
  content: any
  room_id: string // eslint-disable-line camelcase
}

export default class Handlers {
  public static serverAcl (client: IClient): (
    currentRoom: string,
    event: IEvent
  ) => Promise<string[]> {
    return async (currentRoom: string, event: IEvent): Promise<string[]> => {
      const rooms = (await client.getJoinedRooms()).filter(room => room !== currentRoom)

      return Promise.all(
        rooms.map(room => {
          return client.sendStateEvent(room, 'm.room.server_acl', '', event.content)
        })
      )
    }
  }
}
