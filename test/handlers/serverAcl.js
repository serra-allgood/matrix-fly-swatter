const test = require('tape')
const { getServerAclHandler } = require('../../lib/handlers')

const setup = rooms => mockSendStateEvent => {
  return {
    getJoinedRooms () {
      return Promise.resolve(rooms)
    },
    sendStateEvent: mockSendStateEvent
  }
}

test('server_acl duplication', async t => {
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
    roomd_id: rooms[0]
  }

  let index = 1
  const sendStateEvent = (roomID, type, stateKey, content) => {
    t.equals(type, 'm.room.server_acl', 'type is m.room.server_acl')
    t.equals(stateKey, '', 'stateKey is an empty string')
    t.equals(content, event.content, `content is ${event.content}`)
    t.equals(roomID, rooms[index], `roomID matches ${rooms[index]}`)

    index++
    return Promise.resolve('uniqueEventID')
  }

  const client = setup(rooms)(sendStateEvent)
  const serverAcl = getServerAclHandler(client)

  serverAcl(rooms[0], event).then(() => t.end())
})

test.skip('filtering out own events', t => {
})
