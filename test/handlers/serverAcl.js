const test = require('tape')
const flatten = require('reduce-flatten')
const { getServerAclHandler } = require('../../lib/handlers')

const setupClient = (rooms, testers) => {
  const handlers = {}

  return () => {
    const client = {
      getUserId () {
        return Promise.resolve('@fly-paper:matrix.org')
      },
      getJoinedRooms () {
        return Promise.resolve(rooms)
      },
      on (eventType, handler) {
        handlers[eventType] = [handlers[eventType], handler].filter(h => h).reduce(flatten, [])
      },
      process (event) {
        handlers[event.type].forEach(async (handler) => {
          await handler(event.room_id, event)
        })
      }
    }

    Object.entries(testers).forEach(([name, tester]) => {
      client[name] = tester
    })

    return client
  }
}

const setupCommonConsts = (sender = '@abuse:matrix.org') => {
  const rooms = ['!foo:localhost', '!bar:localhost', '!baz:localhost']

  return {
    rooms,
    event: {
      content: {
        allow_ip_literals: false,
        allow: ['*'],
        deny: [
          'evil.com',
          '*.evil.com'
        ]
      },
      room_id: rooms[0],
      type: 'm.room.server_acl',
      user_id: sender
    }
  }
}

test('server_acl duplication', async t => {
  const { rooms, event } = setupCommonConsts()
  t.plan(rooms.length - 1)

  const sendStateEvent = (roomID, type, stateKey, content) => {
    t.test(`sendStateEvent for ${roomID}`, st => {
      st.plan(4)
      st.equals(type, 'm.room.server_acl', 'type is m.room.server_acl')
      st.equals(stateKey, '', 'stateKey is an empty string')
      st.equals(content, event.content, `content is ${event.content}`)
      st.notEquals(roomID, rooms[0], 'does not send to origin room')
    })

    return Promise.resolve('uniqueEventID')
  }

  const client = setupClient(rooms, { sendStateEvent })()
  const serverAcl = getServerAclHandler(client)
  client.on('m.room.server_acl', serverAcl)

  t.comment(`origin room: ${rooms[0]}`)
  client.process(event)
})

test('filtering out own events', t => {
  t.plan(1)
  const { rooms, event } = setupCommonConsts('@fly-paper:matrix.org')

  const sendStateEvent = (_roomID, _type, _stateKey, _content) => {
    t.test('this should not have been called', st => {
      st.plan(1)
      t.fail('failure')
    })

    return Promise.resolve('uniqueEventID')
  }

  const client = setupClient(rooms, { sendStateEvent })()
  const serverAcl = getServerAclHandler(client)
  client.on('m.room.server_acl', serverAcl)
  client.process(event)
  t.pass('no calls')
})
