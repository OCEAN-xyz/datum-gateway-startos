import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { configJson } from '../../fileModels/datum_gateway_config.json'

export const v_0_4_1_2_b3 = VersionInfo.of({
  version: '0.4.1:2-beta.3',
  releaseNotes: {
    en_US: 'Initial release for StartOS 0.4.0',
    es_ES: 'Versión inicial para StartOS 0.4.0',
    de_DE: 'Erstveröffentlichung für StartOS 0.4.0',
    pl_PL: 'Pierwsze wydanie dla StartOS 0.4.0',
    fr_FR: 'Version initiale pour StartOS 0.4.0',
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
        await configJson.merge(effects, {
          stratum: {
            max_clients_per_thread: configYaml.stratum?.max_clients_per_thread,
            max_threads: configYaml.stratum?.max_threads,
            max_clients: configYaml.stratum?.max_clients,
            vardiff_min: configYaml.stratum?.vardiff_min,
            vardiff_target_shares_min:
              configYaml.stratum?.vardiff_target_shares_min,
            vardiff_quickdiff_count:
              configYaml.stratum?.vardiff_quickdiff_count,
            vardiff_quickdiff_delta:
              configYaml.stratum?.vardiff_quickdiff_delta,
            share_stale_seconds: configYaml.stratum?.share_stale_seconds,
            fingerprint_miners: configYaml.stratum?.fingerprint_miners,
          },
          mining: {
            pool_address: configYaml.mining?.pool_address,
            coinbase_tag_primary: configYaml.mining?.coinbase_tag_primary,
            coinbase_tag_secondary: configYaml.mining?.coinbase_tag_secondary,
            coinbase_unique_id: configYaml.mining?.coinbase_unique_id,
          },
          api: {
            admin_password: configYaml.api?.admin_password,
            allow_insecure_auth: configYaml.api?.allow_insecure_auth,
          },
          logger: {
            log_level_console: configYaml.logger?.log_level_console,
            log_to_file: configYaml.logger?.log_to_file,
            log_file: configYaml.logger?.log_file,
            log_level_file: configYaml.logger?.log_level_file,
          },
          datum: {
            pool_host: configYaml.datum?.pool_host,
            pool_port: configYaml.datum?.pool_port,
            pool_pubkey: configYaml.datum?.pool_pubkey,
            pool_pass_workers: configYaml.datum?.pool_pass_workers,
            pool_pass_full_users: configYaml.datum?.pool_pass_full_users,
            always_pay_self: configYaml.datum?.always_pay_self,
          },
        })

        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      } else {
        // Fresh install or already migrated — ensure config exists with defaults
        await configJson.merge(effects, {})
      }
    },
    down: IMPOSSIBLE,
  },
})
