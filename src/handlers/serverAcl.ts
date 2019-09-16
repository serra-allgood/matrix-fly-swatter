import { IClient } from '../interfaces' // eslint-disable-line no-unused-vars

interface IEvent {
  content: any
  room_id: string // eslint-disable-line camelcase
  user_id: string // eslint-disable-line camelcase
}

export function getServerAclHandler (client: IClient): (originRoom: string, event: IEvent) => Promise<string[]> {
  return async (originRoom: string, event: IEvent): Promise<string[]> => {
    // This block of error checking is really ugly, but I don't feel like making
    // it pretty yet
    if (event.user_id === await client.getUserId()) {
      return Promise.reject(new Error('event sent by self'))
    }
    const powerLevels = await client.getPowerLevels(originRoom)
    const minPowerLevel = client.minPowerLevel()
    const roomPowerLevel = powerLevels.users[event.user_id]
    if (!roomPowerLevel || roomPowerLevel < minPowerLevel) {
      return Promise.reject(new Error('sending user does not have minimum power level to trigger fly-paper'))
    }
    const approvedUsers = client.approvedUsers()
    if (approvedUsers.length && !approvedUsers.find(user => user === event.user_id)) {
      return Promise.reject(new Error('sending user not on approved user list'))
    }

    const rooms = (await client.getJoinedRooms()).filter(room => room !== originRoom)

    return Promise.all(
      rooms.map(room => {
        return client.sendStateEvent(room, 'm.room.server_acl', '', event.content)
      })
    )
  }
}
