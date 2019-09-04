const test = require('tape')
const Handlers = require('../lib/Handlers').default

test('serverAcl', async t => {
  let index = 1
  const rooms = ['!foo:localhost', '!bar:localhost', '!baz:localhost']
  const event = {
    content: {
      allow_ip_literals: false,
      allow: ['*'],
      deny: [
        'evil.com',
        '*.evil.com'
      ]
    },
    room_id: rooms[0]
  }

  const client = {
    getJoinedRooms () {
      return Promise.resolve(rooms)
    },
    sendStateEvent (roomID, type, stateKey, content) {
      t.equals(type, 'm.room.server_acl', 'type is m.room.server_acl')
      t.equals(stateKey, '', 'stateKey is an empty string')
      t.equals(content, event.content, `content is ${event.content}`)
      t.equals(roomID, rooms[index], `roomID matches ${rooms[index]}`)

      index++
      return Promise.resolve('uniqueEventID')
    }
  }
  const handler = Handlers.serverAcl(client)

  handler(rooms[0], event).then(() => t.end())
})
