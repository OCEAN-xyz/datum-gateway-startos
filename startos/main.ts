import { manifest } from 'bitcoin-knots/startos/manifest'
import { configJson } from './fileModels/datum_gateway_config.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { dataDir, knotsMountpoint, stratumPort, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Datum Gateway...')

  const conf = await configJson.read().const(effects)
  if (!conf) {
    throw new Error('datum config file not found')
  }

  return sdk.Daemons.of(effects)
    .addDaemon('datum', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'datum' },
        sdk.Mounts.of()
          .mountVolume({
            volumeId: 'main',
            subpath: null,
            mountpoint: '/root',
            readonly: false,
          })
          .mountDependency<typeof manifest>({
            dependencyId: 'bitcoind',
            volumeId: 'main',
            subpath: null,
            mountpoint: knotsMountpoint,
            readonly: true,
          }),
        'datum-sub',
      ),
      exec: {
        command: [
          'datum_gateway',
          '-c',
          `/root/${dataDir}/datum_gateway_config.json`,
        ],
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The Datum Gateway dashboard is ready'),
            errorMessage: i18n('The Datum Gateway dashboard is not ready'),
          }),
      },
      requires: [],
    })
    .addHealthCheck('stratum-interface', {
      ready: {
        display: i18n('Stratum Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, stratumPort, {
            timeout: 1000,
            successMessage: i18n('Stratum server is available'),
            errorMessage: i18n('Stratum server is unavailable'),
          }),
      },
      requires: ['datum'],
    })
})
