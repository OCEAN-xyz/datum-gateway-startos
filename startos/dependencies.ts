import { i18n } from './i18n'
import { sdk } from './sdk'
import { otherConfig } from 'bitcoin-knots/startos/actions/config/other'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', otherConfig, 'critical', {
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
      versionRange: '>=29.1:2-beta.0',
      healthChecks: ['bitcoind'],
    },
  }
})
