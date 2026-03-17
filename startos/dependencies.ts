import { autoconfig } from 'bitcoin-knots/startos/actions/config/autoconfig'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
    input: {
      kind: 'partial',
      value: {
        blocknotify: 'curl -s -m5 http://datum.startos:7152/NOTIFY',
      },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: i18n('Datum requires a particular blocknotify url'),
  })

  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.3:5-beta.1',
      healthChecks: ['bitcoind'],
    },
  }
})
