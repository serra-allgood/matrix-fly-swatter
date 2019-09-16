import { IClient } from '../interfaces' // eslint-disable-line no-unused-vars

interface IEvent {
  content: any
  room_id: string // eslint-disable-line camelcase
  user_id: string // eslint-disable-line camelcase
}

export function getServerAclHandler (client: IClient): (originRoom: string, event: IEvent) => Promise<string[]> {
  return async (originRoom: string, event: IEvent): Promise<string[]> => {
    if (event.user_id === await client.getUserId()) {
      return Promise.reject(new Error('event sent by self'))
    }

    const rooms = (await client.getJoinedRooms()).filter(room => room !== originRoom)

    return Promise.all(
      rooms.map(room => {
        return client.sendStateEvent(room, 'm.room.server_acl', '', event.content)
      })
    )
  }
}
