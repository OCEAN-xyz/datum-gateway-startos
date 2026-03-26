import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { configJson } from '../fileModels/datum_gateway_config.json'

export const v_0_4_1_2_b8 = VersionInfo.of({
  version: '0.4.1:2-beta.8',
  releaseNotes: {
    en_US:
      'Strip rpcuser/rpcpassword from config to force cookie auth for bitcoind RPC',
    es_ES:
      'Eliminar rpcuser/rpcpassword de la configuración para forzar autenticación por cookie en bitcoind RPC',
    de_DE:
      'rpcuser/rpcpassword aus der Konfiguration entfernen, um Cookie-Authentifizierung für bitcoind-RPC zu erzwingen',
    pl_PL:
      'Usuń rpcuser/rpcpassword z konfiguracji, aby wymusić uwierzytelnianie cookie dla bitcoind RPC',
    fr_FR:
      "Supprimer rpcuser/rpcpassword de la configuration pour forcer l'authentification par cookie pour bitcoind RPC",
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
