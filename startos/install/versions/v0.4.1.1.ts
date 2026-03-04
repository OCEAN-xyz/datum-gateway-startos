import { VersionInfo } from '@start9labs/start-sdk'
import { configJson } from '../../fileModels/datum_gateway_config.json'

export const v_0_4_1_1 = VersionInfo.of({
  version: '0.4.1:1-alpha.2',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.55',
    es_ES: 'Actualización a StartOS SDK beta.55',
    de_DE: 'Aktualisierung auf StartOS SDK beta.55',
    pl_PL: 'Aktualizacja do StartOS SDK beta.55',
    fr_FR: 'Mise à jour vers StartOS SDK beta.55',
  },
  migrations: {
    up: async ({ effects }) => {
      await configJson.merge(effects, {
        api: {
          allow_insecure_auth: false,
        },
      })
    },
    down: async () => {},
  }
})
