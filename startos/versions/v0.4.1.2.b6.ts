import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { configJson } from '../fileModels/datum_gateway_config.json'

export const v_0_4_1_2_b6 = VersionInfo.of({
  version: '0.4.1:2-beta.6',
  releaseNotes: {
    en_US:
      'Watch bitcoind cookie file for changes to fix RPC auth after bitcoind restarts',
    es_ES:
      'Vigilar el archivo cookie de bitcoind para corregir la autenticación RPC tras reiniciar bitcoind',
    de_DE:
      'Bitcoin-Cookie-Datei auf Änderungen überwachen, um RPC-Authentifizierung nach bitcoind-Neustart zu beheben',
    pl_PL:
      'Obserwuj plik cookie bitcoind w celu naprawy uwierzytelniania RPC po ponownym uruchomieniu bitcoind',
    fr_FR:
      "Surveiller le fichier cookie de bitcoind pour corriger l'authentification RPC après le redémarrage de bitcoind",
  },
  migrations: {
    up: async ({ effects }) => {
      // Try to read the old 0.3.5.x config. If it exists, carry over
      // user-configurable settings to the new config format.
      const configYaml: Record<string, any> | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        const {
          stratum = {},
          mining = {},
          api = {},
          logger = {},
          datum = {},
        } = configYaml
        await configJson.merge(effects, {
          stratum,
          mining,
          api,
          logger,
          datum,
        })

        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
