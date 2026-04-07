import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { configJson } from '../fileModels/datum_gateway_config.json'

export const v_0_4_1_4 = VersionInfo.of({
  version: '0.4.1:4',
  releaseNotes: {
    en_US:
      'Fix the read logic for reward sharing in the datum config section',
    es_ES:
      'Corregir la lógica de lectura para el reparto de recompensas en la sección de configuración del datum',
    de_DE:
      'Die Leselogik für das Belohnungs-Sharing im Datum-Konfigurationsabschnitt beheben',
    pl_PL:
      'Napraw logikę odczytu dla udostępniania nagród w sekcji konfiguracji datum',
    fr_FR:
      "Corriger la logique de lecture pour le partage des récompenses dans la section de configuration de datum",
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
