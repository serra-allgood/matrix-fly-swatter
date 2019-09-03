const test = require('tape')
const FlyPaper = require('../lib').FlyPaper

test('FlyPaper', t => {
  t.plan(7)

  const flyPaper = new FlyPaper('config.sample.yaml')

  t.equals(flyPaper.server.url, 'https://matrix.org')
  t.equals(flyPaper.server.name, 'matrix.org')

  t.equals(flyPaper.botUser.accessToken, 'access_token')
  t.equals(flyPaper.botUser.name, 'FlyPaper')
  t.equals(flyPaper.botUser.mxid, '@fly-paper:matrix.org')
  t.equals(flyPaper.botUser.avatar, 'mxc://matrix.org/unique_mxc_id')

  t.equals(flyPaper.files.syncHistory, './log/sync_history.log')
})
